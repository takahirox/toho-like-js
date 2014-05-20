/**
 * TODO: should make FighterManager?
 */
function Fighter(gameState, maxX, maxY) {
  this.characterIndex = 0;  // TODO: temporal
  this.parent = Element;
  this.parent.call(this, gameState, maxX, maxY);
  this.width = Fighter._WIDTH;
  this.height = Fighter._HEIGHT;
  this.collisionWidth = Fighter._COLLISION_WIDTH[this.characterIndex];
  this.collisionHeight = Fighter._COLLISION_HEIGHT[this.characterIndex];
  this.grazeWidth = this.width;
  this.grazeHeight = this.height;
  this.power = 0;
  this.powerLevel = 0;
  this.deadCount = 0;
  this.spellCard = 'Special Spell'; // TODO: temporary
  this.setFlag(Element._FLAG_UNHITTABLE);
}
__inherit(Fighter, Element);


// TODO: temporal
Fighter._REIMU = 0 ;
Fighter._MARISA = 1 ;

// TODO: prameters should be in parameter .js file.
Fighter._SHIP_IMAGE = [ Game._IMG_REIMU_SHIP, Game._IMG_MARISA_SHIP ] ;
Fighter._SPAN_FAST = [ 4, 5 ] ;
Fighter._SPAN_SLOW = [ 3, 4 ] ;
Fighter._COLLISION_WIDTH = [ 4, 6 ] ;
Fighter._COLLISION_HEIGHT = [ 4, 6 ] ;

Fighter._FLAG_SLOW = 0x1000 ;

Fighter._UNHITABLE_COUNT = 100 ;

Fighter._WIDTH = 32 ;
Fighter._HEIGHT = 48 ;

Fighter._ANIMATION_SPAN = 2 ;

Fighter.prototype.reset = function( ) {
  this.state = Element._STATE_ALIVE ;
  this.flags = 0 ;
  this.setFlag( Element._FLAG_UNHITTABLE ) ;
  this.power = 0 ;
  this.powerLevel = 0 ;
  this.deadCount = 0 ;
  this.count = 0 ;
  this.indexX = 0 ;
  this.indexY = 0 ;
} ;


Fighter.prototype.beDefaultPosition = function( ) {
  this.setX( parseInt( this.maxX / 2 ) ) ;
  this.setY( this.maxY - 100 ) ;
} ;


/**
 * TODO: temporal
 */
Fighter.prototype.initOptions = function( ) {
  this.gameState.fighterOptionManager.create( this, { 'r':  32, 'angle': 180, 'theta': 180, 'd':  1, 'trange': { 'min': 180, 'max': 250 } } ) ;
  this.gameState.fighterOptionManager.create( this, { 'r':  32, 'angle':   0, 'theta': 360, 'd': -1, 'trange': { 'min': 290, 'max': 360 } } ) ;
} ;


Fighter.prototype.display = function( surface ) {
  if( this.isFlagSet( Element._FLAG_UNHITTABLE ) )
    surface.globalAlpha = 0.7 ;
//  surface.save( ) ;
  this.parent.prototype.display.call( this, surface ) ;
  if( this.isFlagSet( Element._FLAG_UNHITTABLE ) )
    surface.globalAlpha = 1.0 ;
//  surface.restore( ) ;
} ;


/**
 * TODO: temporal
 */
Fighter.prototype._setDirection = function( ) {
  if( ( ! this.isFlagSet( Element._FLAG_MOVE_LEFT ) &&
        ! this.isFlagSet( Element._FLAG_MOVE_RIGHT ) ) ||
      (   this.isFlagSet( Element._FLAG_MOVE_LEFT ) &&
          this.isFlagSet( Element._FLAG_MOVE_RIGHT ) ) ) {
    this.indexY = 0 ;
  } else if( this.isFlagSet( Element._FLAG_MOVE_LEFT ) ) {
    this.indexY = 1 ;
    this.indexX = 7 ;
  } else if( this.isFlagSet( Element._FLAG_MOVE_RIGHT ) ) {
    this.indexY = 2 ;
    this.indexX = 7 ;
  }
} ;


Fighter.prototype.move = function( ) {

  this._setDirection( ) ;
  var d = this.isFlagSet( Fighter._FLAG_SLOW )
            ? Fighter._SPAN_SLOW[ this.characterIndex ] : Fighter._SPAN_FAST[ this.characterIndex ] ;
  // TODO: temporal
  if( this.isFlagSet( Element._FLAG_MOVE_LEFT ) ) {
    this.x -= d ;
  }
  if( this.isFlagSet( Element._FLAG_MOVE_DOWN ) ) {
    this.y += d ;
  }
  if( this.isFlagSet( Element._FLAG_MOVE_RIGHT ) ) {
    this.x += d ;
  }
  if( this.isFlagSet( Element._FLAG_MOVE_UP ) ) {
    this.y -= d ;
  }
  this._beInTheField( ) ;
} ;


Fighter.prototype.runStep = function( ) {
  if( this.isFlagSet( Element._FLAG_UNHITTABLE ) && this.count > Fighter._UNHITABLE_COUNT + this.deadCount ) {
    this.clearFlag( Element._FLAG_UNHITTABLE ) ;
  }

  this._shot( ) ;

  this.parent.prototype.runStep.call( this ) ;
  if( this.count % Fighter._ANIMATION_SPAN == 0 ) {
    this.indexX++ ;
    if( ! this.indexY && this.indexX > 7 )
      this.indexX = 0 ;
    else if( this.indexY && this.indexX > 7 )
      this.indexX = 4 ;
  }
} ;


Fighter.prototype._shot = function( ) {
  if( this.isFlagSet( Element._FLAG_SHOT ) )
    this.gameState.notifyFighterDoShot( this ) ;
} ;


Fighter.prototype.getBulletIndex = function( ) {
  return this.isFlagSet( Fighter._FLAG_SLOW ) ? 1 : 0 ;
} ;


Fighter.prototype.setCharacterIndex = function( index ) {
  this.characterIndex = index ;
  this._updateFighterInfoDependingCharacterIndex( ) ;
} ;


/**
 * TODO: temporal
 */
Fighter.prototype.changeCharacter = function( ) {
  this.characterIndex++ ;
  if( this.characterIndex > 1 )
    this.characterIndex = 0 ;
  this._updateFighterInfoDependingCharacterIndex( ) ;
} ;


Fighter.prototype._updateFighterInfoDependingCharacterIndex = function( ) {
  this.image = this.gameState.getImage( Fighter._SHIP_IMAGE[ this.characterIndex ] ) ;
  this.collisionWidth = Fighter._COLLISION_WIDTH[ this.characterIndex ] ;
  this.collisionHeight = Fighter._COLLISION_HEIGHT[ this.characterIndex ] ;
} ;


Fighter.prototype._initVector = function( ) {
} ;


/**
 * TODO: temporal
 */
Fighter.prototype.getPower = function( ) {
  return this.power ;
} ;


/**
 * TODO: temporal
 */
Fighter.prototype.getPowerLevel = function( ) {
  return this.powerLevel > 3 ? 3 : this.powerLevel;
} ;


Fighter.prototype._calculatePowerLevel = function( power ) {
  if( this.power < 8 )
    return 0 ;
  if( this.power < 16 )
    return 1 ;
  if( this.power < 32 )
    return 2 ;
  if( this.power < 48 )
    return 3 ;
  if( this.power < 64 )
    return 4 ;
  if( this.power < 80 )
    return 5 ;
  if( this.power < 96 )
    return 6 ;
  if( this.power < 128 )
    return 7 ;
  return 8 ;
} ;


/**
 * TODO: temporal
 */
Fighter.prototype.hasOption = function( ) {
  return this.getPowerLevel( ) > 0 ? true : false ;
} ;


/**
 * TODO: temporal
 */
Fighter.prototype.incrementPower = function( num ) {

  var prePowerLevel = this._calculatePowerLevel( this.power ) ;
  this.power += num ;

  if( this.power > 128 ) {
    this.power = 128 ;
    return false ;
  }

  this.powerLevel = this._calculatePowerLevel( this.power ) ;

  if( this.powerLevel > prePowerLevel )
    this.gameState.notifyFighterPowerUp( ) ;

} ;


Fighter.prototype.beNeutral = function( ) {
  this.clearFlag( Fighter._FLAG_SLOW ) ;
  this.clearFlag( Element._FLAG_MOVE_LEFT ) ;
  this.clearFlag( Element._FLAG_MOVE_UP ) ;
  this.clearFlag( Element._FLAG_MOVE_RIGHT ) ;
  this.clearFlag( Element._FLAG_MOVE_DOWN ) ;
  this.clearFlag( Element._FLAG_SHOT ) ;
} ;
