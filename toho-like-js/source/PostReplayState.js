function PostReplayState( game ) {
  this.parent = GameState ;
  this.parent.call( this, game ) ;
  this.count = 0 ;
  this.index = 0 ;
}
__inherit( PostReplayState, GameState ) ;

PostReplayState._STATE_SELECT               = 0x0 ;
PostReplayState._STATE_REPLAY_POSTING       = 0x1 ;
PostReplayState._STATE_REPLAY_POSTING_ERROR = 0x2 ;

PostReplayState._DIR = 'http://gachapin.jp/stg/' ;


PostReplayState.prototype.init = function( ) {
  this.count = 0 ;
  this.index = 0 ;
  this.state = PostReplayState._STATE_SELECT ;
} ;


/**
 * TODO: temporal. implement error handling
 */
PostReplayState.prototype._postReplay = function( ) {
  var user = window.prompt( 'your name?' ) ;
  if( ! user )
    return ;
  var xhr = new XMLHttpRequest( ) ;
  xhr.open( 'POST', PostReplayState._DIR + 'post.cgi', true ) ;
  var self = this ;
  xhr.onload = function( ) {
    self.game.notifyQuitStage( ) ; // TODO: temporal
  } ;
  xhr.onerror = function( e ) {
    window.alert( e ) ;
  } ;
  // TODO: temporal
  params = this.game.states[ Game._STATE_IN_STAGE ].exportPlayRecord( ) ;
  params.user = user ;
  xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' ) ;
  xhr.send( this._encode( params ) ) ;
  this.state = PostReplayState._STATE_REPLAY_POSTING ;
} ;


PostReplayState.prototype._encode = function( data ) {
  var params = [];

  for( var name in data ) {
    var value = data[ name ];
    var param = encodeURIComponent( name ).replace( /%20/g, '+' )
        + '=' + encodeURIComponent( value ).replace( /%20/g, '+' );

    params.push( param );
  }

  return params.join( '&' );
} ;


PostReplayState.prototype.runStep = function( ) {
  this.count++ ;
} ;


PostReplayState.prototype.updateDisplay = function( surface ) {
  this.game.clear( surface ) ;
  this._displayBG( surface ) ;
  this._displayMessage( surface ) ;
  if( this.state == PostReplayState._STATE_SELECT )
    this._displayQuestion( surface ) ;
} ;


/**
 * TODO: temporal
 */
PostReplayState.prototype._displayBG = function( surface ) {
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

  surface.globalAlpha = 0.5 ;
  surface.fillStyle = 'rgb( 0, 0, 0 )' ;
  surface.fillRect( 0, 0, this.getWidth( ), this.getHeight( ) ) ;

  surface.restore( ) ;
} ;


PostReplayState.prototype._displayMessage = function( surface ) {
  surface.save( ) ;
  surface.font = "30px 'Comic Sans MS'" ;
  surface.textAlign = 'center' ;
  surface.textBaseAlign = 'middle' ;
  surface.fillStyle = 'rgb( 255, 255, 255 )' ;
  surface.fillText( 'Replay Select', this.getWidth( ) / 2, 35 ) ;

  // TODO: temporal
  if( this.state == PostReplayState._STATE_REPLAY_POSTING ) {
    surface.fillText( 'Saving...', this.getWidth( ) / 2, this.getHeight( ) / 2 ) ;
  }

  surface.restore( ) ;

} ;


PostReplayState.prototype._displayQuestion = function( surface ) {
  surface.save( ) ;
  surface.font = "30px 'Comic Sans MS'" ;
  surface.textAlign = 'center' ;
  surface.textBaseAlign = 'middle' ;
  surface.fillStyle = 'rgb( 255, 255, 255 )' ;
  surface.fillText( 'Will you save your replay?', this.getWidth( ) / 2, 100 ) ;

  if( this.index == 0 )
    surface.globalAlpha = 1.0 ;
  else
    surface.globalAlpha = 0.4 ;
  surface.fillText( 'Yes', this.getWidth( ) / 2, 200 ) ;

  if( this.index == 1 )
    surface.globalAlpha = 1.0 ;
  else
    surface.globalAlpha = 0.4 ;
  surface.fillText( 'No', this.getWidth( ) / 2, 250 ) ;

  surface.restore( ) ;
} ;


PostReplayState.prototype.handleKeyDown = function( e ) {
  switch( e.keyCode ) {
    case 38: // up
    case 40: // down
      this._soundEffect( Game._SE_SELECT ) ;
      if( this.index == 0 )
        this.index = 1 ;
      else
        this.index = 0 ;
      break ;
    case 90: // z
      this._soundEffect( Game._SE_SELECT ) ;
      if( this.index == 0 )
        this._postReplay( ) ;
      else
        this.game.notifyQuitStage( ) ; // TODO: temporal
      break ;
  } ;
} ;


PostReplayState.prototype.handleKeyUp = function( e ) {

} ;
