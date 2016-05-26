/**
 * TODO: optimize
 */
function Peer(room, wsURL, receiver) {
  this.room = room;
  this.peopleInTheRoom = 0;
  this.ws = new WebSocket(wsURL);
  this.receiver = receiver;

  this.pc = null;
  this.channel = null;

  var self = this;
  this.gotSDPFunc = function(sdp) {self._gotSDP(sdp);};
  this.onIceCandidateFunc = function(event) {self._onIceCandidate(event);};
  this.onDataChannelFunc = function(event) {self._onDataChannel(event);};
  this.onMessageFunc = function(event) {self._onMessage(event);};
  this.onOpenFunc = function(event) {self._onOpen(event);};
  this.onCloseFunc = function(event) {self._onClose(event);};
  this.onErrorFunc = function(event) {self._onError(event);};
  this.dummySendFunc = function() { self._keepSendDummy(); };

  this.ws.onmessage = function(event) {self._gotSignal(event);};
  this.ws.onopen = function(event) {self._wsReady(event);};

  this.interval = null;
  this.peerConnected = false;
}

// must be same as the server side ones.
Peer.prototype._PEER_ID_DUMMY       = -1;
Peer.prototype._PEER_ID_NOTICE_ROOM = 0;
Peer.prototype._PEER_ID_SYNC        = 1;

Peer.prototype._ICE_SERVERS = [
{url:'stun:stun01.sipphone.com'},
{url:'stun:stun.ekiga.net'},
{url:'stun:stun.fwdnet.net'},
{url:'stun:stun.ideasip.com'},
{url:'stun:stun.iptel.org'},
{url:'stun:stun.rixtelecom.se'},
{url:'stun:stun.schlund.de'},
{url:'stun:stun.l.google.com:19302'},
{url:'stun:stun1.l.google.com:19302'},
{url:'stun:stun2.l.google.com:19302'},
{url:'stun:stun3.l.google.com:19302'},
{url:'stun:stun4.l.google.com:19302'},
{url:'stun:stunserver.org'},
{url:'stun:stun.softjoys.com'},
{url:'stun:stun.voiparound.com'},
{url:'stun:stun.voipbuster.com'},
{url:'stun:stun.voipstunt.com'},
{url:'stun:stun.voxgratia.org'},
{url:'stun:stun.xten.com'},
{
	url: 'turn:numb.viagenie.ca',
	credential: 'muazkh',
	username: 'webrtc@live.com'
},
{
	url: 'turn:192.158.29.39:3478?transport=udp',
	credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
	username: '28224511:1379330808'
},
{
	url: 'turn:192.158.29.39:3478?transport=tcp',
	credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
	username: '28224511:1379330808'
}
];

Peer.prototype._DUMMY_SPAN = 1000 * 20;
Peer.prototype._DUMMY_DATA = JSON.stringify({_pid: Peer.prototype._PEER_ID_DUMMY});


Peer.prototype.log = function(data) {
//  console.log(data);
};


Peer.prototype._wsReady = function(event) {
  if(this.receiver.notifyWsReady !== void 0)
    this.receiver.notifyWsReady(event);
  this._noticeRoom();
  this._keepSendDummy();
};


Peer.prototype._noticeRoom = function() {
  var str = JSON.stringify({_pid: this._PEER_ID_NOTICE_ROOM, room: this.room});
  this.ws.send(str);
};


Peer.prototype.sendSignal = function(params) {
  var str = JSON.stringify(params);
  this.ws.send(str);
  this.log(str);
};


Peer.prototype._gotSignal = function(event) {
  var params = JSON.parse(event.data);

  if(params._pid === void 0) {
    switch(params.type) {
      case 'offer':
        this._gotOffer(params);
        break;
      case 'answer':
        this._gotAnswer(params);
        break;
      case 'candidate':
        this._gotCandidate(params);
        break;
    }
  } else {
    if(params._pid == Peer.prototype._PEER_ID_NOTICE_ROOM) {
      this.peopleInTheRoom = params.num;
      if(this.receiver.notifyRoomUpdate !== void 0)
        this.receiver.notifyRoomUpdate(this.peopleInTheRoom);
    }
  }
  this.log(params);
};


Peer.prototype.createPeerConnection = function() {
  var servers = {'iceServers': this._ICE_SERVERS};

  this.pc = new webkitRTCPeerConnection(servers);
  this.pc.onicecandidate = this.onIceCandidateFunc;
};


Peer.prototype._onIceCandidate = function(event) {
  if(event.candidate) {
    var params = {type: 'candidate',
                  sdpMLineIndex: event.candidate.sdpMLineIndex,
                  candidate: event.candidate.candidate};
    this.sendSignal(params);
  }
};


Peer.prototype.offer = function() {
  this.channel = this.pc.createDataChannel('mychannel',
                                           {reliable: false});
  this.channel.onmessage = this.onMessageFunc;
  this.channel.onopen = this.onOpenFunc;
  this.channel.onclose = this.onCloseFunc;
  // TODO: temporal
  this.channel.onerror = function(e) {
    window.alert(e);
    console.log(e);
  };
  this.pc.createOffer(this.gotSDPFunc, this.onErrorFunc);
};


Peer.prototype._gotSDP = function(sdp) {
  this.pc.setLocalDescription(sdp);
  this.sendSignal(sdp);
};


Peer.prototype._gotOffer = function(msg) {
  this.pc.ondatachannel = this.onDataChannelFunc;
  this._setRemoteDescription(msg);
  this.pc.createAnswer(this.gotSDPFunc, this.onErrorFunc);
};


Peer.prototype._gotAnswer = function(msg) {
  this._setRemoteDescription(msg);
};


Peer.prototype._gotCandidate = function(msg) {
  var candidate = new RTCIceCandidate(msg);
  this.pc.addIceCandidate(candidate);
};


Peer.prototype._setRemoteDescription = function(msg) {
  this.pc.setRemoteDescription(new RTCSessionDescription(msg));
};


Peer.prototype._onDataChannel = function(event) {
  this.channel = event.channel;
  this.channel.onmessage = this.onMessageFunc;
  this.channel.onopen = this.onOpenFunc;
  this.channel.onclose = this.onCloseFunc;
};


Peer.prototype._onOpen = function(event) {
  this.peerConnected = true;
  this.ws.close(1000); // TODO: consider more
  if(this.receiver.notifyOpenPeer !== void 0)
    this.receiver.notifyOpenPeer(event);
};


Peer.prototype._onClose = function(event) {
  this.peerConnected = false;
  if(this.receiver.notifyClosePeer !== void 0)
    this.receiver.notifyClosePeer(event);
};


Peer.prototype._onError = function(event) {
  window.alert(event);
};


Peer.prototype._onMessage = function(event) {
  this.log(event.data);
  this.receiver.receiveFromPeer(JSON.parse(event.data));
};


Peer.prototype.send = function(data) {
  this.channel.send(JSON.stringify(data));
};


Peer.prototype._keepSendDummy = function() {
  this.ws.send(this._DUMMY_DATA);
  this._setIntervalForDummy();
};


Peer.prototype._setIntervalForDummy = function() {
  if(! this.ws || this.peerConnected)
    return;
  this.interval = setTimeout(this.dummySendFunc, this._DUMMY_SPAN);
};
