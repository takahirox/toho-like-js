function VanishedEnemyManager( gameState ) {
  this.parent = ElementManager ;
  this.parent.call( this, gameState ) ;
} ;
__inherit( VanishedEnemyManager, ElementManager ) ;


VanishedEnemyManager.prototype._initFactory = function( ) {
  this.factory = new VanishedEnemyFactory( this.gameState, this.gameState.getWidth( ), this.gameState.getHeight( ) ) ;
} ;


/**
 * TODO: temporal
 */
VanishedEnemyManager.prototype.checkLoss = function( ) {
  this.parent.prototype.checkLoss.call( this, this._checkLossCallBack.bind( this ) ) ;
}


VanishedEnemyManager.prototype._checkLossCallBack = function( element ) {
  if( element instanceof VanishedBoss )
    this.gameState.notifyBossVanishEnd( element.boss ) ;
} ;


VanishedEnemyManager.prototype.create = function( enemy ) {
  this.addElement( this.factory.create( enemy ) ) ;
} ;


function VanishedEnemyFactory( gameState, maxX, maxY ) {
  this.parent = ElementFactory ;

  this.bossFreelist = null ;
  this.escapeFreelist = null ;
  this.effectFreelist = null ;

  this.parent.call( this, gameState, maxX, maxY ) ;
} ;
__inherit( VanishedEnemyFactory, ElementFactory ) ;

VanishedEnemyFactory._BOSS_NUM = 10 ;
VanishedEnemyFactory._ESCAPE_NUM = 10 ;


VanishedEnemyFactory.prototype._initFreelist = function( ) {
  this.bossFreelist   = new VanishedBossFreeList( VanishedEnemyFactory._BOSS_NUM, this.gameState ) ;
  this.escapeFreelist = new EscapeBossFreeList( VanishedEnemyFactory._ESCAPE_NUM, this.gameState ) ;
} ;


/**
 * TODO: temporal. consider 1st and 2nd argument of element.init( ) again.
 */
VanishedEnemyFactory.prototype.create = function( enemy ) {
  var element ;
  if( enemy instanceof Boss ) {
    if( enemy.dead == 'escape' ) {
      element = this.escapeFreelist.get( ) ;
      element.init( enemy, this._getImage( enemy ), enemy ) ;
    } else {
      element = this.bossFreelist.get( ) ;
      element.init( enemy, this._getImage( enemy ), enemy ) ;
    }
  } else {
  }
  return element ;
} ;


VanishedEnemyFactory.prototype._getImage = function( params ) {
  return this.gameState.getImage( Game._IMG_VANISHED ) ;
} ;


VanishedEnemyFactory.prototype.free = function( element ) {
  if( element instanceof VanishedBoss )
    this.bossFreelist.free( element ) ;
  else if( element instanceof EscapeBoss )
    this.escapeFreelist.free( element ) ;
} ;



function VanishedBossFreeList( num, gameState ) {
  this.parent = ElementFreeList ;
  this.parent.call( this, num, gameState ) ;
} ;
__inherit( VanishedBossFreeList, ElementFreeList ) ;


VanishedBossFreeList.prototype._generateElement = function( ) {
  return new VanishedBoss( this.gameState, this.gameState.getWidth( ), this.gameState.getHeight( ) ) ;
} ;



function VanishedBoss( gameState, maxX, maxY ) {
  this.parent = Element ;
  this.parent.call( this, gameState, maxX, maxY ) ;
  this.boss = null ;
}
__inherit( VanishedBoss, Element ) ;

VanishedBoss._WIDTH = 32 ;
VanishedBoss._HEIGHT = 32 ;


VanishedBoss.prototype.init = function( params, image, boss ) {
  this.parent.prototype.init.call( this, params, image ) ;

  this.width  = VanishedBoss._WIDTH ;
  this.height = VanishedBoss._HEIGHT ;
  this.collisionWidth  = this.width ;
  this.collisionHeight = this.height ;
  this.boss = boss ;
  this.indexX = 0 ;
  this.indexY = 1 ;
} ;


/**
 * TODO: temporal
 */
VanishedBoss.prototype.display = function( surface ) {
  var x = Math.round( this.getX( ) ) ;
  var y = Math.round( this.getY( ) ) ;
  var r = this.width * this.count * 0.1 ;
  surface.save( ) ;
  surface.fillStyle = 'rgb( 255, 255, 255 )' ;
  surface.globalAlpha = ( 100 - this.count + 1 ) * 0.005 ;
  surface.beginPath( ) ;
  surface.arc( x, y, r,  0, Math.PI * 2 ) ;
  surface.fill( ) ;

  surface.strokeStyle = 'rgb( 255, 255, 255 )' ;
  surface.globalAlpha = ( 100 - this.count + 1 ) * 0.01 ;
  surface.beginPath( ) ;
  surface.arc( x, y, r,  0, Math.PI * 2 ) ;
  surface.lineWidth = 3 ;
  surface.stroke( ) ;

  this.boss.display( surface ) ;

  surface.restore( ) ;

//  surface.fillText( x + ':' + y, x, y ) ;
} ;


VanishedBoss.prototype.checkLoss = function( ) {
  return this.count > 100 ? true : false ;
} ;



function EscapeBossFreeList( num, gameState ) {
  this.parent = ElementFreeList ;
  this.parent.call( this, num, gameState ) ;
} ;
__inherit( EscapeBossFreeList, ElementFreeList ) ;


EscapeBossFreeList.prototype._generateElement = function( ) {
  return new EscapeBoss( this.gameState, this.gameState.getWidth( ), this.gameState.getHeight( ) ) ;
} ;



function EscapeBoss( gameState, image, x, y, maxX, maxY, vectors, boss ) {
  this.parent = Element ;
  this.parent.call( this,
                    gameState,
                    image,
                    x,
                    y,
                    maxX,
                    maxY,
                    vectors ) ;
  this.width = EscapeBoss._WIDTH ;
  this.height = EscapeBoss._HEIGHT ;
  this.collisionWidth = this.width ;
  this.collisionHeight = this.height ;
  this.boss = boss ;
  this.indexX = 0 ;
  this.indexY = 1 ;
}
__inherit( EscapeBoss, Element ) ;

EscapeBoss._WIDTH = 32 ;
EscapeBoss._HEIGHT = 32 ;
EscapeBoss._VECTOR = { 'r': 0, 'theta': 225, 'ra': 0.1 } ;


EscapeBoss.prototype.init = function( params, image, boss ) {
  this.parent.prototype.init.call( this, params, image ) ;
  this.width = EscapeBoss._WIDTH ;
  this.height = EscapeBoss._HEIGHT ;
  this.collisionWidth = this.width ;
  this.collisionHeight = this.height ;
  this.boss = boss ;
  this.indexX = 0 ;
  this.indexY = 1 ;
  this.vector = this.moveVectorManager.create( EscapeBoss._VECTOR ) ;
} ;


EscapeBoss.prototype.runStep = function( ) {
  this.boss.setX( this.boss.getX( ) + this.vector.moveX( ) ) ;
  this.boss.setY( this.boss.getY( ) + this.vector.moveY( ) ) ;
  this.vector.runStep( ) ;
} ;


/**
 * TODO: temporal
 */
EscapeBoss.prototype.display = function( surface ) {
  this.boss.display( surface ) ;
//  surface.fillText( x + ':' + y, x, y ) ;
} ;


/**
 * TODO: temporal
 */
EscapeBoss.prototype.checkLoss = function( ) {
  return this.boss.outOfTheField( ) ;
} ;
