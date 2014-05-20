function EndingState( game ) {
  this.parent = GameState ;
  this.parent.call( this, game ) ;
  this.count = 0 ;
}
__inherit( EndingState, GameState ) ;


EndingState.prototype.init = function( ) {
  this._soundBGM( Game._BGM_ENDING ) ;
} ;


EndingState.prototype.runStep = function( ) {
  this.count++ ;
} ;


EndingState.prototype.updateDisplay = function( surface ) {
  this.game.clear( surface ) ;
  this._displayBG( surface ) ;
  this._displayMessage( surface ) ;
} ;


EndingState.prototype._displayBG = function( surface ) {
  surface.save( ) ;
  surface.fillStyle = 'rgb( 0, 0, 0 )' ;
  surface.fillRect( 0, 0, this.getWidth( ), this.getHeight( ) ) ;
  surface.restore( ) ;
} ;


EndingState.prototype._displayMessage = function( surface ) {
  surface.save( ) ;
  surface.font = '30pt Calibri' ;
  surface.textAlign = 'center' ;
  surface.fillStyle = 'rgb( 255, 255, 255 )' ;
  if( this.count >= 0 ) {
    surface.fillText( 'You\'ve done.', this.getWidth( ) / 2, 50 ) ;
  }
  if( this.count >= 100 ) {
    surface.fillText( 'And all was over.', this.getWidth( ) / 2, 100 ) ;
  }
  if( this.count >= 200 ) {
    surface.fillText( 'Thank you for the playing.', this.getWidth( ) / 2, 150 ) ;
  }
  surface.restore( ) ;
} ;


EndingState.prototype.handleKeyDown = function( e ) {
} ;


EndingState.prototype.handleKeyUp = function( e ) {
} ;
