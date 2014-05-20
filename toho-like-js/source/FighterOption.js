function FighterOptionManager( gameState ) {
  this.parent = ElementManager ;
  this.parent.call( this, gameState ) ;
} ;
__inherit( FighterOptionManager, ElementManager ) ;


FighterOptionManager.prototype._initFactory = function( ) {
  this.factory = new FighterOptionFactory( this.gameState,
                                           this.gameState.getWidth( ),
                                           this.gameState.getHeight( ) ) ;
} ;


FighterOptionManager.prototype.create = function( fighter, params ) {
  this.addElement( this.factory.create( fighter, params ) ) ;
} ;


function FighterOptionFactory( gameState, maxX, maxY ) {
  this.parent = ElementFactory ;
  this.parent.call( this, gameState, maxX, maxY ) ;
} ;
__inherit( FighterOptionFactory, ElementFactory ) ;

FighterOptionFactory._NUM = 10 ;


FighterOptionFactory.prototype._initFreelist = function( ) {
  this.freelist = new FighterOptionFreeList( FighterOptionFactory._NUM,
                                             this.gameState ) ;
} ;


/**
 *
 */
FighterOptionFactory.prototype.create = function( fighter, params ) {
  var option = this.freelist.get( ) ;
  option.init( params, this._getImage( params ), fighter ) ;
  return option ;
} ;


FighterOptionFactory.prototype._getImage = function( params ) {
  return this.gameState.getImage( Game._IMG_REIMU_OPTION ) ; // TODO: temporal
} ;



function FighterOptionFreeList( num, gameState ) {
  this.parent = ElementFreeList ;
  this.parent.call( this, num, gameState ) ;
} ;
__inherit( FighterOptionFreeList, ElementFreeList ) ;


FighterOptionFreeList.prototype._generateElement = function( ) {
  return new FighterOption( this.gameState,
                            this.gameState.getWidth( ),
                            this.gameState.getHeight( ) ) ;
} ;



function FighterOption( gameState, maxX, maxY ) {
  this.parent = Element ;
  this.parent.call( this, gameState, maxX, maxY ) ;
  this.fighter = null ;
  this.angle   = null ;
  this.theta   = null ;
  this.d       = null ;
  this.trange  = null ;
}
__inherit( FighterOption, Element ) ;

FighterOption._WIDTH = 16 ;
FighterOption._HEIGHT = 16 ;

FighterOption._MOVE_SPEED = 8 ;
FighterOption._ROTATE_SPEED = 4 ;


FighterOption.prototype.init = function( params, image, fighter ) {
  this.parent.prototype.init.call( this, params, image ) ;
  this.fighter = fighter ;

  this.width  = FighterOption._WIDTH ;
  this.height = FighterOption._HEIGHT ;
  this.collisionWidth  = this.width ;
  this.collisionHeight = this.height ;

  this.angle  = this._getValueOrDefaultValue( params.angle, 0 ) ;
  this.theta  = this._getValueOrDefaultValue( params.theta, 0 ) ;
  this.d      = this._getValueOrDefaultValue( params.d, 0 ) ;
  this.trange = this._getValueOrDefaultValue( params.trange, null ) ;
} ;


/**
 * TODO: temporal. Should I use MoveVector?
 */
FighterOption.prototype.runStep = function( ) {
  if( this.fighter.hasOption( ) ) {
    this.theta += ( this.fighter.isFlagSet( Fighter._FLAG_SLOW ) ? 1 : -1 )
                    * this.d * FighterOption._MOVE_SPEED ;
    if( this.theta > this.trange.max )
      this.theta = this.trange.max ;
    if( this.theta < this.trange.min )
      this.theta = this.trange.min ;
    this.setX( this.r * Math.cos( this._calculateRadian( this.theta ) ) ) ;
    this.setY( this.r * Math.sin( this._calculateRadian( this.theta ) ) ) ;
  }
  this.parent.prototype.runStep.call( this ) ;
} ;


/**
 * TODO: temporal
 */
FighterOption.prototype.display = function( surface ) {
  if( ! this.fighter.hasOption( ) )
    return ;

  this.image = this.fighter.characterIndex == 0
                 ? this.gameState.getImage( Game._IMG_REIMU_OPTION )
                 : this.gameState.getImage( Game._IMG_MARISA_OPTION ) ;

  var angle = ( this.angle + this.count * FighterOption._ROTATE_SPEED + 90 )
                % 360 ;
  this.parent.prototype.display.call( this, surface, true, angle ) ;
} ;


FighterOption.prototype.checkLoss = function( ) {
  return false ;
} ;


FighterOption.prototype.getCenterX = function( ) {
  return this.getX( ) + this.fighter.getX( ) ;
} ;


FighterOption.prototype.getCenterY = function( ) {
  return this.getY( ) + this.fighter.getY( ) ;
} ;


