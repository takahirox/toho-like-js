function OpeningState( game ) {
  this.parent = GameState ;
  this.parent.call( this, game ) ;

  this.initialized = false ;

  this.state = OpeningState._STATE_LOGO ;
  this.states = [ ] ;
  this.states[ OpeningState._STATE_LOGO ]  = new LogoState( this ) ;
  this.states[ OpeningState._STATE_TITLE ] = new TitleState( this ) ;
}
__inherit( OpeningState, GameState ) ;

OpeningState._STATE_LOGO  = 0x0 ;
OpeningState._STATE_TITLE = 0x1 ;


OpeningState.prototype.init = function( ) {
  if( this.initialized )
    this.notifyLogoConclusion( ) ;
  this.initialized = true ;
} ;


OpeningState.prototype.runStep = function( ) {
  this.states[ this.state ].runStep( ) ;
} ;


OpeningState.prototype.updateDisplay = function( surface ) {
  this.game.clear( surface ) ;
  this.states[ this.state ].updateDisplay( surface ) ;
} ;


OpeningState.prototype.handleKeyDown = function( e ) {
  this.states[ this.state ].handleKeyDown( e ) ;
} ;


OpeningState.prototype.handleKeyUp = function( e ) {
} ;


OpeningState.prototype.notifyLogoConclusion = function( ) {
  this.state = OpeningState._STATE_TITLE ;
  this.states[ this.state ].init( ) ;
} ;


OpeningState.prototype.notifyTitleConclusion = function() {
  if(! this.isMultiPlay() || this.isConnected()) {
    this.game.notifyOpeningConclusion();
  } else {
    // TODO: temporal
    window.alert('connect to begin the game.');
  }
};


OpeningState.prototype.notifyReplaySelectBegin = function() {
  if(this.isMultiPlay()) {
    // TODO: temporal
    window.alert('cannot choose replay for multi play.');
  } else {
    this.game.notifyReplaySelectBegin();
  }
};


OpeningState.prototype.getImage = function( key ) {
  return this.game.getImage( key ) ;
} ;


OpeningState.prototype.soundEffect = function( key ) {
  this.game.soundEffect( key ) ;
} ;


OpeningState.prototype.soundBGM = function( key ) {
  this.game.soundBGM( key ) ;
} ;



OpeningAbstractState = function( opening ) {
  this.opening = opening ;
}


OpeningAbstractState.prototype.init = function( ) {
} ;


OpeningAbstractState.prototype.runStep = function( ) {
} ;


OpeningAbstractState.prototype.handleKeyDown = function( e ) {
} ;


OpeningAbstractState.prototype.updateDisplay = function( surface ) {
} ;


OpeningAbstractState.prototype.getImage = function( key ) {
  return this.opening.getImage( key ) ;
} ;


OpeningAbstractState.prototype.soundEffect = function( key ) {
  this.opening.soundEffect( key ) ;
} ;


OpeningAbstractState.prototype.soundBGM = function( key ) {
  this.opening.soundBGM( key ) ;
} ;



LogoState = function( opening ) {
  this.parent = OpeningAbstractState ;
  this.parent.call( this, opening ) ;
  this.count = 0 ;
}
__inherit( LogoState, OpeningAbstractState ) ;

LogoState._GLOBALALPHA_SPAN = 100 ;
LogoState._DISPLAY_SPAN = 300 ;


LogoState.prototype.init = function( ) {
  this.count = 0 ;
} ;


LogoState.prototype.runStep = function( ) {
  this.count++ ;
  if( this.count > LogoState._DISPLAY_SPAN )
    this.opening.notifyLogoConclusion( ) ;
} ;


LogoState.prototype.handleKeyDown = function( e ) {
  switch( e.keyCode ) {
    case 90: // z
      this.opening.notifyLogoConclusion( ) ;
      break ;
  } ;
} ;


LogoState.prototype.updateDisplay = function( surface ) {
  this._displayBG( surface ) ;
  this._displayMessage( surface ) ;
} ;


LogoState.prototype._displayBG = function( surface ) {
  surface.save( ) ;
  surface.fillStyle = 'rgb( 0, 0, 0 )' ;
  surface.fillRect( 0, 0, this.opening.getWidth( ), this.opening.getHeight( ) ) ;
  surface.restore( ) ;
} ;


LogoState.prototype._displayMessage = function( surface ) {
  surface.save( ) ;

  if( this.count < LogoState._GLOBALALPHA_SPAN )
    surface.globalAlpha = this.count / LogoState._GLOBALALPHA_SPAN ;
  else if( this.count > LogoState._DISPLAY_SPAN - LogoState._GLOBALALPHA_SPAN )
    surface.globalAlpha = ( LogoState._DISPLAY_SPAN - this.count ) / LogoState._GLOBALALPHA_SPAN ;
  else
    surface.globalAlpha = 1.0 ;

  surface.font = "30px 'Comic Sans MS'" ;
  surface.textAlign = 'center' ;
  surface.textBaseAlign = 'middle' ;
  surface.fillStyle = 'rgb( 255, 255, 255 )' ;
  surface.fillText( 'This is a fan STG of Toho-Project', this.opening.getWidth( ) / 2, 200 ) ;
  surface.fillText( 'Presented by @superhoge', this.opening.getWidth( ) / 2, 300 ) ;

  surface.restore( ) ;
} ;



TitleState = function( opening ) {
  this.parent = OpeningAbstractState ;
  this.parent.call( this, opening ) ;
  this.count = 0 ;
  this.state = 0 ;
  this.index = 0 ;
}
__inherit( TitleState, OpeningAbstractState ) ;

TitleState._WIDTH = 1280 ;
TitleState._HEIGHT = 960 ;

TitleState._GLOBALALPHA_SPAN = 100 ;

TitleState._STATE_DISPLAYING = 0x0 ;
TitleState._STATE_DISPLAYED  = 0x1 ;


TitleState.prototype.init = function( ) {
  this.count = 0 ;
  this.index = 0 ;
  this.state = TitleState._STATE_DISPLAYING ;
  this.soundBGM( Game._BGM_TITLE ) ;
} ;


TitleState.prototype.runStep = function( ) {
  if( this.state == TitleState._STATE_DISPLAYING &&
      this.count >= TitleState._GLOBALALPHA_SPAN * 2 )
    this.state = TitleState._STATE_DISPLAYED ;

  this.count++ ;
} ;


TitleState.prototype.updateDisplay = function( surface ) {
  this._displayBG( surface ) ;
  this._displayImage( surface ) ;
  this._displayMessage( surface ) ;
  this._displayPressKey( surface ) ;
} ;


TitleState.prototype._displayBG = function( surface ) {
  surface.save( ) ;
  surface.fillStyle = 'rgb( 0, 0, 0 )' ;
  surface.fillRect( 0, 0, this.opening.getWidth( ), this.opening.getHeight( ) ) ;
  surface.fillStyle = 'rgb( 255, 255, 255 )' ;
  surface.fillRect( 0, 50, this.opening.getWidth( ), this.opening.getHeight( ) - 100 ) ;
  surface.restore( ) ;
} ;


TitleState.prototype._displayImage = function( surface ) {
  surface.save( ) ;

  if( this.count < TitleState._GLOBALALPHA_SPAN )
    surface.globalAlpha = this.count / TitleState._GLOBALALPHA_SPAN ;
  else
    surface.globalAlpha = 1.0 ;

  surface.drawImage( this.getImage( Game._IMG_TITLE_BG ),
                     0,                 
                     0,
                     TitleState._WIDTH,
                     TitleState._HEIGHT,
                     0,
                     0,
                     this.opening.getWidth( ),
                     this.opening.getHeight( ) ) ;
  surface.restore( ) ;
} ;


TitleState.prototype._displayMessage = function( surface ) {
  if( this.count < TitleState._GLOBALALPHA_SPAN )
    return ;

  surface.save( ) ;
  surface.font = "24px 'Comic Sans MS'" ;
  surface.textAlign = 'center' ;
  surface.textBaseAlign = 'middle' ;
  surface.fillStyle = 'rgb( 0, 0, 0 )' ;

  if( this.count - TitleState._GLOBALALPHA_SPAN < TitleState._GLOBALALPHA_SPAN )
    surface.globalAlpha = ( this.count - TitleState._GLOBALALPHA_SPAN ) / TitleState._GLOBALALPHA_SPAN ;
  else
    surface.globalAlpha = 1.0 ;

  surface.fillText( 'Toho like STG JS', 120, 200 ) ;
  surface.restore( ) ;
} ;


TitleState.prototype._displayPressKey = function( surface ) {
  if( this.count < TitleState._GLOBALALPHA_SPAN * 2 )
    return ;

  surface.save( ) ;
  surface.font = "24px 'Comic Sans MS'" ;
  surface.textAlign = 'center' ;
  surface.textBaseAlign = 'middle' ;
  surface.fillStyle = 'rgb( 0, 0, 0 )' ;

  if( this.index == 0 )
    surface.globalAlpha = 1.0 ;
  else
    surface.globalAlpha = 0.2 ;
  surface.fillText( 'Start', 120, 300 ) ;

  if( this.index == 1 )
    surface.globalAlpha = 1.0 ;
  else
    surface.globalAlpha = 0.2 ;
  surface.fillText( 'Replay', 120, 340 ) ;

  surface.restore( ) ;
} ;


TitleState.prototype.handleKeyDown = function( e ) {
  switch( e.keyCode ) {
    case 90: // z
      this.soundEffect( Game._SE_SELECT ) ;
      if( this.state == TitleState._STATE_DISPLAYED ) {
        if( this.index == 0 )
          this.opening.notifyTitleConclusion( ) ;
        else
          this.opening.notifyReplaySelectBegin( ) ;
      } else {
        this.state = TitleState._STATE_DISPLAYED ;
        this.count = TitleState._GLOBALALPHA_SPAN * 2 ; // TODO: temporal
      }
      break ;
    case 38: // up
    case 40: // down
      if( this.state == TitleState._STATE_DISPLAYED ) {
        this.soundEffect( Game._SE_SELECT ) ;
        if( this.index == 0 )
          this.index = 1 ;
        else
          this.index = 0 ;
      }
      break ;
    case 32: // space
      break ;
  } ;
} ;


