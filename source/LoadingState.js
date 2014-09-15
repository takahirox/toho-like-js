function LoadingState( game ) {
  this.parent = GameState ;
  this.parent.call( this, game ) ;
  this.loadImageNum = 0 ;
  this.loadSoundNum = 0 ;
  this.loadBgmNum = 0 ;
}
__inherit( LoadingState, GameState ) ;


LoadingState.prototype.init = function( params ) {
  this._loadImages( ) ;
  this._loadSEs( ) ;
  this._loadBGMs( ) ;
} ;


LoadingState.prototype.runStep = function( ) {
  this._checkLoadCompletion( ) ;
} ;


LoadingState.prototype._checkLoadCompletion = function( ) {

  if( this.loadImageNum < this.game.images.length )
    return ;
  if( this.loadSoundNum < this.game.sounds.length )
    return ;
  if( this.loadBgmNum < this.game.bgms.length )
    return ;

  this.game.notifyLoadingConclusion( ) ;

} ;


LoadingState.prototype._loadImages = function( ) {
  var self = this ;
  for( var key in Game._IMGS ) {
    this.game.images[ key ] = new Image( ) ;
    this.game.images[ key ].src = Game._IMGS[ key ] ;
    this.game.images[ key ].onload = function( ) {
      self.loadImageNum++ ;
    } ;
  }
} ;


LoadingState.prototype._loadSEs = function( ) {
  var self = this ;
  for( var key in Game._SES ) {
    this.game.sounds[ key ] = new Audio( Game._SES[ key ] ) ;
    this.game.sounds[ key ].addEventListener( 'canplay', function( e ) {
      self.loadSoundNum++ ;
    } ) ;
    this.game.sounds[ key ].load( ) ;
  }
} ;


LoadingState.prototype._loadBGMs = function( ) {
  var self = this ;
  for( var key in Game._BGMS ) {
    this.game.bgms[ key ] = new Audio( Game._BGMS[ key ] ) ;
    this.game.bgms[ key ].addEventListener( 'loadstart', function( e ) {
      self.loadBgmNum++ ;
    } ) ;
    this.game.bgms[ key ].load( ) ;
  }
} ;



LoadingState.prototype.updateDisplay = function( surface ) {
  surface.save( ) ;
  this.game.clear( surface ) ; // TODO: temporal
  surface.fillStyle = 'rgb( 0, 0, 0 )' ;
  surface.textAlign = 'right' ;
  surface.fillText( 'loading...', 180, 200 ) ;
  surface.fillText( ( this.loadImageNum  + this.loadSoundNum  + this.loadBgmNum ) + '/' +
                    ( this.game.images.length + this.game.sounds.length + this.game.bgms.length ), 200, 240 ) ;
  surface.restore( ) ;
} ;
