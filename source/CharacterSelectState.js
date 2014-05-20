function CharacterSelectState( game ) {
  this.parent = GameState ;
  this.parent.call( this, game ) ;
  this.elements = [ ] ;
  this.index = 0 ;
  this.count = 0 ;
}
__inherit( CharacterSelectState, GameState ) ;


CharacterSelectState._APPEAR_SPAN = 10 ;

CharacterSelectState.prototype.init = function( ) {
  this.count = 0 ;
  // TODO: magic number
  for( var i = 0; i < 2; i++ ) {
    this.elements[ i ] = { } ;
    this.elements[ i ].width = 400 ;
    this.elements[ i ].height = 600 ;
  }
  this.index = 0 ;
} ;


CharacterSelectState.prototype.runStep = function( ) {
  this.count++ ;
} ;


CharacterSelectState.prototype.updateDisplay = function( surface ) {
  this.game.clear( surface ) ;
  this._displayBG( surface ) ;
  this._displayMessage( surface ) ;
  this._displayCharacters( surface ) ;
} ;


/**
 * TODO: temporal
 */
CharacterSelectState.prototype._displayBG = function( surface ) {
  surface.save( ) ;
  surface.fillStyle = 'rgb( 0, 0, 0 )' ;
  surface.fillRect( 0, 0, this.getWidth( ), this.getHeight( ) ) ;
  surface.fillStyle = 'rgb( 255, 255, 255 )' ;
  surface.fillRect( 0, 50, this.getWidth( ), this.getHeight( ) - 100 ) ;

  surface.globalAlpha = 0.05 ;
  surface.drawImage( this.game.getImage( Game._IMG_TITLE_BG ),
                     0,                 
                     0,
                     TitleState._WIDTH,
                     TitleState._HEIGHT,
                     0,
                     0,
                     this.getWidth( ),
                     this.getHeight( ) ) ;

  surface.restore( ) ;
} ;


CharacterSelectState.prototype._displayMessage = function( surface ) {
  surface.save( ) ;
  surface.font = "30px 'Comic Sans MS'" ;
  surface.textAlign = 'center' ;
  surface.textBaseAlign = 'middle' ;
  surface.fillStyle = 'rgb( 255, 255, 255 )' ;
  surface.fillText( 'Character Select', this.getWidth( ) / 2, 35 ) ;
  surface.restore( ) ;
} ;


CharacterSelectState.prototype._displayCharacters = function( surface ) {
  surface.save( ) ;
  if( this.index == 0 ) {
    surface.globalAlpha = 0.6 ;
    this._displayMarisa( surface ) ;
    surface.globalAlpha = 1.0 ;
    this._displayReimu( surface ) ;
  } else {
    surface.globalAlpha = 0.6 ;
    this._displayReimu( surface ) ;
    surface.globalAlpha = 1.0 ;
    this._displayMarisa( surface ) ;
  }
  surface.restore( ) ;
} ;


CharacterSelectState.prototype._displayReimu = function( surface ) {
  surface.save( ) ;
  var target = 0 ;
  var from = this.getWidth( ) ;
  var w = from - ( from - target ) * this.count / CharacterSelectState._APPEAR_SPAN ;
  if( w < target )
    w = target ;
  surface.drawImage( this.game.getImage( Game._IMG_STAND_REIMU ),
                     w,
                     0 ) ;
  surface.restore( ) ;
} ;


CharacterSelectState.prototype._displayMarisa = function( surface ) {
  surface.save( ) ;
  var target = this.getWidth( ) - this.elements[ 1 ].width ;
  var from = -this.elements[ 1 ].width ;
  var w = from - ( from - target ) * this.count / CharacterSelectState._APPEAR_SPAN ;
  if( w > target )
    w = target ;
  surface.drawImage( this.game.getImage( Game._IMG_STAND_MARISA ),
                     w,
                     0 ) ;
  surface.restore( ) ;
} ;


CharacterSelectState.prototype.handleKeyDown = function( e ) {
  // TODO: temporal
  if( this.count < CharacterSelectState._APPEAR_SPAN )
    return ;

  switch( e.keyCode ) {
    case 37: // left
      this.index++ ;
      if( this.index > 1 )
        this.index = 0 ;
      this._soundEffect( Game._SE_SELECT ) ;
      break ;
    case 39: // right
      this.index-- ;
      if( this.index < 0 )
        this.index = 1 ;
      this._soundEffect( Game._SE_SELECT ) ;
      break ;
    case 88: // x
      this.game.notifyLoadingConclusion( this.index ) ; // TODO: temporal
      break ;
    case 90: // z
      this.game.notifyCharacterSelectConclusion( this.index ) ;
      break ;
  } ;
} ;


CharacterSelectState.prototype.handleKeyUp = function( e ) {

} ;
