function GameState( game ) {
  this.game = game ;
  this.flags = 0 ;
  this.state = 0 ;
}


GameState.prototype.init = function( params ) {
} ;


GameState.prototype.runStep = function( ) {
} ;


GameState.prototype.doRunNextStep = function() {
  return true;
};


GameState.prototype.updateDisplay = function( surface ) {
} ;


GameState.prototype.handleKeyDown = function( e ) {
} ;


GameState.prototype.handleKeyUp = function( e ) {
} ;


GameState.prototype.getImage = function( key ) {
  return this.game.getImage( key ) ;
} ;


GameState.prototype.getWidth = function( ) {
  return this.game.width ;
} ;


GameState.prototype.getHeight = function( ) {
  return this.game.height ;
} ;


GameState.prototype._soundBGM = function( key ) {
  this.game.soundBGM( key ) ;
} ;


GameState.prototype._soundEffect = function( key ) {
  this.game.soundEffect( key ) ;
} ;


GameState.prototype.isFlagSet = function( type ) {
  return ( this.flags & type ) ? true : false ;
} ;


GameState.prototype.setFlag = function( type ) {
  this.flags |= type ;
} ;


GameState.prototype.clearFlag = function( type ) {
  this.flags &= ~type ;
} ;


GameState.prototype.isMultiPlay = function() {
  return this.game.isMultiPlay();
};


GameState.prototype.isMaster = function() {
  return this.game.isMaster();
};


GameState.prototype.isConnected = function() {
  return this.game.isConnected();
};


GameState.prototype.receiveFromPeer = function(data) {
};

