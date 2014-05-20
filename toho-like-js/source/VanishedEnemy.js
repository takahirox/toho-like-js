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


/**
 * TODO: temporal
 */
VanishedEnemyManager.prototype.createDamageEffect = function( enemy ) {
  this.addElement( this.factory.createDamageEffect( enemy ) ) ;
} ;


function VanishedEnemyFactory( gameState, maxX, maxY ) {
  this.parent = ElementFactory ;

  this.bossFreelist = null ;
  this.escapeFreelist = null ;
  this.effectFreelist = null ;

  this.parent.call( this, gameState, maxX, maxY ) ;
} ;
__inherit( VanishedEnemyFactory, ElementFactory ) ;

VanishedEnemyFactory._ENEMY_NUM = 200 ;
VanishedEnemyFactory._BOSS_NUM = 10 ;
VanishedEnemyFactory._ESCAPE_NUM = 10 ;
VanishedEnemyFactory._EFFECT_NUM = 200 ;


VanishedEnemyFactory.prototype._initFreelist = function( ) {
  this.freelist       = new VanishedEnemyFreeList( VanishedEnemyFactory._ENEMY_NUM, this.gameState ) ;
  this.bossFreelist   = new VanishedBossFreeList( VanishedEnemyFactory._BOSS_NUM, this.gameState ) ;
  this.escapeFreelist = new EscapeBossFreeList( VanishedEnemyFactory._ESCAPE_NUM, this.gameState ) ;
  this.effectFreelist = new DamageEffectFreeList( VanishedEnemyFactory._EFFECT_NUM, this.gameState ) ;
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
    element = this.freelist.get( ) ;
    element.init( enemy, this._getImage( enemy ), enemy ) ;
  }
  return element ;
} ;


/**
 * TODO: temporal. combine this method with create( )?
 */
VanishedEnemyFactory.prototype.createDamageEffect = function( enemy ) {
  var effect = this.effectFreelist.get( ) ;
  effect.init( enemy, this.gameState.getImage( Game._IMG_DAMAGE ), enemy ) ;
  return effect ;
} ;


VanishedEnemyFactory.prototype._getImage = function( params ) {
  return this.gameState.getImage( Game._IMG_VANISHED ) ;
} ;


VanishedEnemyFactory.prototype.free = function( element ) {
  if( element instanceof VanishedBoss )
    this.bossFreelist.free( element ) ;
  else if( element instanceof EscapeBoss )
    this.escapeFreelist.free( element ) ;
  else if( element instanceof DamageEffect )
    this.effectFreelist.free( element ) ;
  else
    this.freelist.free( element ) ;
} ;



function VanishedEnemyFreeList( num, gameState ) {
  this.parent = ElementFreeList ;
  this.parent.call( this, num, gameState ) ;
} ;
__inherit( VanishedEnemyFreeList, ElementFreeList ) ;


VanishedEnemyFreeList.prototype._generateElement = function( ) {
  return new VanishedEnemy( this.gameState, this.gameState.getWidth( ), this.gameState.getHeight( ) ) ;
} ;



function VanishedEnemy( gameState, maxX, maxY ) {
  this.parent = Element ;
  this.parent.call( this, gameState, maxX, maxY ) ;
  this.preCanvas = VanishedEnemy._PRE_CANVAS;
}
__inherit( VanishedEnemy, Element ) ;

VanishedEnemy._WIDTH = 32 ;
VanishedEnemy._HEIGHT = 32 ;
VanishedEnemy._END_COUNT = 10;
VanishedEnemy._PRE_CANVAS = []; /* TODO: temporal */


VanishedEnemy.prototype.init = function( params, image, enemy ) {
  this.parent.prototype.init.call( this, params, image ) ;
  this.setX( enemy.getX( ) ) ;
  this.setY( enemy.getY( ) ) ;
  this.width  = VanishedEnemy._WIDTH ;
  this.height = VanishedEnemy._HEIGHT ;
  this.collisionWidth  = this.width ;
  this.collisionHeight = this.height ;
  this.indexX = 0 ;
  this.indexY = 1 ;
} ;


/**
 * TODO: temporal
 */
VanishedEnemy.prototype.display = function(surface) {
  var x = Math.round(this.getX());
  var y = Math.round(this.getY());
  var r = Math.round(this.width * this.count * 0.1);

  if(this.preCanvas[this.count] == undefined) {
    var cvs = document.createElement('canvas')
    cvs.width = r*2 + 4;
    cvs.height = r*2 + 4;
    var ctx = cvs.getContext('2d');

    ctx.beginPath();
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.globalAlpha = (VanishedEnemy._END_COUNT - this.count + 1) * 0.05;
    ctx.arc(r+2, r+2, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = 'rgb(255, 255, 255)';
    ctx.globalAlpha = (VanishedEnemy._END_COUNT - this.count + 1) * 0.1;
    ctx.lineWidth = 3;
    ctx.arc(r+2, r+2, r, 0, Math.PI * 2);
    ctx.stroke();

    this.preCanvas[this.count] = cvs;
  }
  surface.drawImage(this.preCanvas[this.count], x-r-2, y-r-2);

//  surface.fillText( x + ':' + y, x, y ) ;
} ;


VanishedEnemy.prototype.checkLoss = function( ) {
  return this.count > VanishedEnemy._END_COUNT ? true : false ;
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



function DamageEffectFreeList( num, gameState ) {
  this.parent = ElementFreeList ;
  this.parent.call( this, num, gameState ) ;
} ;
__inherit( DamageEffectFreeList, ElementFreeList ) ;


DamageEffectFreeList.prototype._generateElement = function( ) {
  return new DamageEffect( this.gameState, this.gameState.getWidth( ), this.gameState.getHeight( ) ) ;
} ;



function DamageEffect( gameState, maxX, maxY ) {
  this.parent = Element ;
  this.parent.call( this, gameState, maxX, maxY ) ;
  this.enemy = null ;
  this.dx = 0 ;
  this.dy = 0 ;
}
__inherit( DamageEffect, Element ) ;

DamageEffect._WIDTH = 64 ;
DamageEffect._HEIGHT = 64 ;


DamageEffect.prototype.init = function( params, image, enemy ) {
  this.parent.prototype.init.call( this, params, image ) ;
  this.enemy = enemy ;
  this.setX( enemy.getX( ) ) ;
  this.setY( enemy.getY( ) ) ;
  this.width  = DamageEffect._WIDTH ;
  this.height = DamageEffect._HEIGHT ;
  this.collisionWidth  = this.width ;
  this.collisionHeight = this.height ;
  this.indexX = 0 ;
  this.indexY = 0 ;
  this.dx     = 0 ;
  this.dy     = 0 ;
} ;


/**
 * TODO: temporal
 */
DamageEffect.prototype.runStep = function( ) {
  var tmp = 32 ;
  this.dx = -tmp / 2 + parseInt( Math.random( ) * tmp ) ;
  this.dy = -tmp / 2 + parseInt( Math.random( ) * tmp ) ;
  this.parent.prototype.runStep.call( this ) ;
} ;


/**
 * TODO: temporal
 */
DamageEffect.prototype.display = function( surface ) {
  surface.save( ) ;
  var x = Math.round( this.getLeftX( ) + this.dx ) ;
  var y = Math.round( this.getUpY( )   + this.dy ) ;
  var width  = this.getWidth( ) ;
  var height = this.getHeight( ) ;
  surface.globalAlpha = ( 3 - this.count ) * 0.1 ;
  surface.drawImage( this.image,
                     this.width  * this.indexX,
                     this.height * this.indexY + 32 * 13,
                     this.width,                this.height,
                     x,                         y,
                     width,                     height ) ;
  surface.restore( ) ;
//  surface.fillText( x + ':' + y, x, y ) ;
} ;


DamageEffect.prototype.checkLoss = function( ) {
  return this.count > 2 ? true : false ;
} ;
