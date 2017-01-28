/**
 *  transferred data: state and activeNum.
 */
function GameSocket(game) {
  this.game = game;
  this.ws = null;
  this.params = {}; // for sent data.
  this.interval = null;

  var self = this;
  this.onMessageFunc = function(event) { self._messageCallback(event); };
  this.dummySendFunc = function() { self._keepSendDummy(); };
};

GameSocket._URL = 'wss://safe-retreat-9152.herokuapp.com/';
//GameSocket._URL = 'ws://localhost:5000';

GameSocket._DUMMY_SPAN = 1000 * 20;

// Share these parameters with Server.
GameSocket._STATE_OPEN                    = 0;
GameSocket._STATE_CLOSE                   = 1;

GameSocket._STATE_BEGIN_GAME              = 2;
GameSocket._STATE_DEAD                    = 3;
GameSocket._STATE_DESTROY_STAGE1_MID_BOSS = 4;
GameSocket._STATE_DESTROY_STAGE1_BIG_BOSS = 5;
GameSocket._STATE_DESTROY_STAGE2_MID_BOSS = 6;
GameSocket._STATE_DESTROY_STAGE2_BIG_BOSS = 7;
GameSocket._STATE_GAME_CLEAR              = 8;
GameSocket._STATE_GAME_OVER               = 9;

GameSocket._CONNECTION_STATUS_MAX_NUM = 1;
GameSocket._SHOOTING_STATE_MAX_NUM    = 9;


GameSocket.prototype.connected = function() {
  return this.ws ? true : false;
};


GameSocket.prototype.connect = function() {
  try {
    this.ws = new WebSocket(GameSocket._URL);
    this.ws.onmessage = this.onMessageFunc;
  } catch(e) {
    this.ws = null;
    console.log(e);
  }
  this._setIntervalForDummy();
};


GameSocket.prototype._messageCallback = function(event) {
  try {
    var message = JSON.parse(event.data);
  } catch(e) {
    return;
  }

  var activeNum = this.convertToValidActiveNum(message.activeNum);
  var key = this.convertToValidState(message.state);
  if(this.isValidState(key) && this.isValidActiveNum(activeNum))
    this.game.notifyMessageReceive(activeNum, key);
};


/**
 * Prolly JSON.stringify allocates new memory in it and
 * this could lead GC.
 */
GameSocket.prototype.send = function(key) {
  if(! this.ws)
    return;
  this.params.state = key;
  var data = JSON.stringify(this.params);
  this.ws.send(data);
};


GameSocket.prototype._keepSendDummy = function() {
  this.send(-1);
  this._setIntervalForDummy();
};


GameSocket.prototype._setIntervalForDummy = function() {
  if(! this.ws)
    return;
  this.interval = setTimeout(this.dummySendFunc, GameSocket._DUMMY_SPAN);
};


GameSocket.prototype.convertToValidState = function(key) {
  return parseInt(key);
};


GameSocket.prototype.isValidShootingState = function(key) {
  if(key >  GameSocket._CONNECTION_STATUS_MAX_NUM &&
     key <= GameSocket._SHOOTING_STATE_MAX_NUM)
    return true;
  return false;
};


GameSocket.prototype.isValidState = function(key) {
  if(key >= 0 &&
     key <= GameSocket._SHOOTING_STATE_MAX_NUM)
    return true;
  return false;
};


GameSocket.prototype.convertToValidActiveNum = function(num) {
  return parseInt(num);
};


GameSocket.prototype.isValidActiveNum = function(num) {
  if(num >= 0)
    return true;
  return false;
};
