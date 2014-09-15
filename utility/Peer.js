function Peer(room, wsURL, receiver) {
  this.room = room;
  this.id = (Math.random() * 10000000) | 0; // TODO: temporal
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

  this.ws.onmessage = function(event) {self._gotSignal(event);};
  this.ws.onopen = function(event) {self._wsReady(event);};
}

Peer.prototype._ICE_SERVERS = [{'url': 'stun:stun.l.google.com:19302'}];

Peer.prototype.log = function(data) {
//  console.log(data);
};


Peer.prototype._wsReady = function(event) {
  if(this.receiver.notifyWsReady !== void 0)
    this.receiver.notifyWsReady(event);
};


Peer.prototype.sendSignal = function(params) {
  params.id = this.id;
  params.room = this.room;
  var str = JSON.stringify(params);
  this.ws.send(str);
  this.log(str);
};


Peer.prototype._gotSignal = function(event) {
  var params = JSON.parse(event.data);

  // TODO: temporal
  if(params.id === this.id || (params.room !== null && params.room !== this.room))
    return;

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
  this.log(params);
};


Peer.prototype.createPeerConnection = function() {
  var servers = {'iceServers': this._ICE_SERVERS};
  var options = {optional: [{
                    RtpDataChannels: true
                }]};

  this.pc = new webkitRTCPeerConnection(servers, options);
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
  this.pc.createOffer(this.gotSDPFunc);
};


Peer.prototype._gotSDP = function(sdp) {
  this.pc.setLocalDescription(sdp);
  this.sendSignal(sdp);
};


Peer.prototype._gotOffer = function(msg) {
  this.pc.ondatachannel = this.onDataChannelFunc;
  this._setRemoteDescription(msg);
  this.pc.createAnswer(this.gotSDPFunc);
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
  if(this.receiver.notifyOpenPeer !== void 0)
    this.receiver.notifyOpenPeer(event);
};


Peer.prototype._onClose = function(event) {
  if(this.receiver.notifyClosePeer !== void 0)
    this.receiver.notifyClosePeer(event);
};


Peer.prototype._onMessage = function(event) {
  this.log(event.data);
  this.receiver.receiveFromPeer(JSON.parse(event.data));
};


Peer.prototype.send = function(data) {
  this.channel.send(JSON.stringify(data));
};
