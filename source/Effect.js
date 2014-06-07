/**
 * Effect represents an element which just shows on a screen,
 * and not affect any other elements.
 */
function EffectManager( gameState ) {
  this.parent = ElementManager ;
  this.parent.call( this, gameState ) ;
} ;
__inherit( EffectManager, ElementManager ) ;


EffectManager.prototype._initFactory = function( ) {
  this.factory = new EffectFactory( this.gameState,
                                    this.gameState.getWidth( ),
                                    this.gameState.getHeight( ) ) ;
} ;


EffectManager.prototype.create = function( element, type, params ) {
  this.addElement( this.factory.create( element, type, params ) ) ;
} ;


/**
 * TODO: temporal. combine with create()?
 */
EffectManager.prototype.createGraze = function(element, params) {
  this.addElement(this.factory.createGraze(element, params));
};


/**
 * TODO: temporal. combine with create()?
 */
EffectManager.prototype.createDamageEffect = function(enemy) {
  this.addElement(this.factory.createDamageEffect(enemy));
};


/**
 * TODO: temporal. combine with create()?
 */
EffectManager.prototype.createExplosion = function(enemy) {
  this.addElement(this.factory.createExplosion(enemy));
};


/**
 * TODO: temporal. combine with create()?
 */
EffectManager.prototype.createBigExplosion = function(enemy) {
  this.addElement(this.factory.createBigExplosion(enemy));
};



function EffectFactory(gameState, maxX, maxY) {
  this.parent = ElementFactory;
  this.grazeFreelist = null;
  this.damageFreelist = null;
  this.explosionFreelist = null;
  this.bExplosionFreelist = null;
  this.parent.call(this, gameState, maxX, maxY);
} ;
__inherit(EffectFactory, ElementFactory);

EffectFactory._SHOCKWAVE_NUM = 200 ;
EffectFactory._GRAZE_NUM = 200 ;
EffectFactory._DAMAGE_NUM = 200;
EffectFactory._EXPLOSION_NUM = 200;
EffectFactory._BIG_EXPLOSION_NUM = 10;


// TODO: temporal
EffectFactory._PARAMS = [
 {'w': 4, 'g': 5, 'a': 0.1, 'b': 10, 'endCount': 10, 'default': true},
 {'x': 0, 'y': 0}
];


EffectFactory.prototype._initFreelist = function() {
  this.freelist = new ShockWaveEffectFreeList(EffectFactory._SHOCKWAVE_NUM,
                                              this.gameState);
  this.grazeFreelist = new GrazeEffectFreeList(EffectFactory._GRAZE_NUM,
                                              this.gameState);
  this.damageFreelist = new DamageEffectFreeList(EffectFactory._DAMAGE_NUM,
                                                 this.gameState);
  this.explosionFreelist = new ExplosionEffectFreeList(
                                 EffectFactory._EXPLOSION_NUM, this.gameState);   this.bExplosionFreelist = new BigExplosionEffectFreeList(
                                  EffectFactory._BIG_EXPLOSION_NUM,
                                  this.gameState);
};


/**
 *
 */
EffectFactory.prototype.create = function( element, type, params ) {
  // TODO: temporal
  if( ! params )
    params = EffectFactory._PARAMS[ 0 ] ;

  params.x = element.getX( ) ;
  params.y = element.getY( ) ;

  var effect = this.freelist.get( ) ;
  effect.init( params, this._getImage( params ), element ) ;
  return effect ;
} ;


/**
 * TODO: temporal
 */
EffectFactory.prototype.createGraze = function(fighter, bullet) {
  params = EffectFactory._PARAMS[1];

  params.x = fighter.getX();
  params.y = fighter.getY();

  var effect = this.grazeFreelist.get();
  effect.init(params, this._getImage(params), fighter, bullet);
  return effect;
};


/**
 * TODO: temporal. combine this method with create( )?
 */
EffectFactory.prototype.createDamageEffect = function(enemy) {
  var effect = this.damageFreelist.get();
  effect.init(enemy, this.gameState.getImage(Game._IMG_DAMAGE), enemy);
  return effect;
};


EffectFactory.prototype.createExplosion = function(enemy) {
  var effect = this.explosionFreelist.get();
  effect.init(enemy, this.gameState.getImage(Game._IMG_VANISHED), enemy);
  return effect;
};


EffectFactory.prototype.createBigExplosion = function(enemy) {
  var effect = this.bExplosionFreelist.get();
  effect.init(enemy, this.gameState.getImage(Game._IMG_VANISHED), enemy);
  return effect;
};


EffectFactory.prototype.free = function(element) {
  if(element instanceof GrazeEffect)
    this.grazeFreelist.free(element);
  else if(element instanceof DamageEffect)
    this.damageFreelist.free(element);
  else if(element instanceof ExplosionEffect)
    this.explosionFreelist.free(element);
  else if(element instanceof BigExplosionEffect)
    this.bExplosionFreelist.free(element);
  else
    this.freelist.free(element);
};


/**
 * TODO: temporal
 */
EffectFactory.prototype._getImage = function( params ) {
  return this.gameState.getImage( Game._IMG_SHOCK_WAVE ) ;
} ;



function ShockWaveEffectFreeList( num, gameState ) {
  this.parent = ElementFreeList ;
  this.parent.call( this, num, gameState ) ;
}
__inherit( ShockWaveEffectFreeList, ElementFreeList ) ;


ShockWaveEffectFreeList.prototype._generateElement = function( ) {
  return new ShockWaveEffect( this.gameState,
                              this.gameState.getWidth( ),
                              this.gameState.getHeight( ) ) ;
} ;



function ShockWaveEffect( gameState, maxX, maxY ) {
  this.parent = Element ;
  this.parent.call( this, gameState, maxX, maxY ) ;
  this.element = null ;
  this.w = null ;
  this.g = null ;
  this.a = null ;
  this.b = null ;
  this.default = null;
  this.endCount = null ;
  this.preCanvas = ShockWaveEffect._PRE_CANVAS;
}
__inherit( ShockWaveEffect, Element ) ;

ShockWaveEffect._PRE_CANVAS = []; /* temporal */
ShockWaveEffect._INNER_COLOR = 'rgba(255, 255, 255, 0.0)';
ShockWaveEffect._OUTER_COLORS = [
  'rgba(255, 255, 255, 0.0)',
  'rgba(255, 255, 255, 0.1)',
  'rgba(255, 255, 255, 0.2)',
  'rgba(255, 255, 255, 0.3)',
  'rgba(255, 255, 255, 0.4)',
  'rgba(255, 255, 255, 0.5)',
  'rgba(255, 255, 255, 0.6)',
  'rgba(255, 255, 255, 0.7)',
  'rgba(255, 255, 255, 0.8)',
  'rgba(255, 255, 255, 0.9)',
  'rgba(255, 255, 255, 1.0)',
];

ShockWaveEffect.prototype.init = function(params, image, element) {
  this.parent.prototype.init.call(this, params, image);
  this.element = element;
  this.w = params.w;
  this.g = params.g;
  this.a = params.a;
  this.b = params.b;
  this.default = params.default;
  this.endCount = this._calculateEndCount(params.endCount);
};


ShockWaveEffect.prototype._calculateEndCount = function(count) {

  if(this.default || count * this.b < this.gameState.getWidth() / 2)
    return count;

  var x = this.getX();
  var y = this.getY();
  if(x < this.gameState.getWidth() / 2)
    x = this.gameState.getWidth() - x;
  if(y < this.gameState.getHeight() / 2)
    y = this.gameState.getHeight() - y;
  var r = parseInt(Math.sqrt(x*x + y*y));
  var count2 = parseInt(r / this.b) + this.g;

  return (count2 < count) ? count2 : count;

};


ShockWaveEffect.prototype.display = function(surface) {

  if(this.default) {
    this._displayDefault(surface);
    return;
  }

  var x = Math.round(this.getX());
  var y = Math.round(this.getY());

  surface.save();
  this._display(surface, x, y);
  surface.restore();

//  surface.fillText( x + ':' + y, x, y ) ;
} ;


/**
 * display with pre-rendering.
 */
ShockWaveEffect.prototype._displayDefault = function(surface) {
  var x = Math.round(this.getX());
  var y = Math.round(this.getY());
  var r = this.count * this.b;

  if(this.preCanvas[this.count] == undefined) {
    var cvs = document.createElement('canvas')
    cvs.width = r*2 + this.w;
    cvs.height = r*2 + this.w;
    var ctx = cvs.getContext('2d');
    this._display(ctx, r+this.w/2, r+this.w/2);
    this.preCanvas[this.count] = cvs;
  }
  surface.drawImage(this.preCanvas[this.count], x-r-this.w/2, y-r-this.w/2);
};


ShockWaveEffect.prototype._display = function(surface, x, y) {
  var r = this.count * this.b;
  if(r <= 0)
    return;
  var s = 1 - (this.g*this.w)/(this.count*this.b);
  if(s < 0)
    s = 0.0;
  var g = surface.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(s, ShockWaveEffect._INNER_COLOR);
  g.addColorStop(1.00, ShockWaveEffect._OUTER_COLORS[parseInt(this.a*10)]);
  surface.beginPath();
  surface.fillStyle = g;
  surface.arc(x, y, r, 0, Math.PI * 2);
  surface.fill();
};


ShockWaveEffect.prototype.checkLoss = function( ) {
  return this.count > this.endCount ? true : false ;
} ;



function ExplosionEffectFreeList(num, gameState) {
  this.parent = ElementFreeList;
  this.parent.call(this, num, gameState);
};
__inherit(ExplosionEffectFreeList, ElementFreeList);


ExplosionEffectFreeList.prototype._generateElement = function() {
  return new ExplosionEffect(this.gameState, this.gameState.getWidth(),
                             this.gameState.getHeight());
};



function ExplosionEffect(gameState, maxX, maxY) {
  this.parent = Element;
  this.parent.call(this, gameState, maxX, maxY);
  this.preCanvas = ExplosionEffect._PRE_CANVAS;
}
__inherit(ExplosionEffect, Element);

ExplosionEffect._WIDTH = 32 ;
ExplosionEffect._HEIGHT = 32 ;
ExplosionEffect._END_COUNT = 10;
ExplosionEffect._PRE_CANVAS = []; /* TODO: temporal */


ExplosionEffect.prototype.init = function(params, image, enemy) {
  this.parent.prototype.init.call(this, params, image);
  this.setX(enemy.getX());
  this.setY(enemy.getY());
  this.width  = ExplosionEffect._WIDTH;
  this.height = ExplosionEffect._HEIGHT;
  this.collisionWidth  = this.width;
  this.collisionHeight = this.height;
  this.indexX = 0;
  this.indexY = 1;
};


/**
 * TODO: temporal
 */
ExplosionEffect.prototype.display = function(surface) {
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
    ctx.globalAlpha = (ExplosionEffect._END_COUNT - this.count + 1) * 0.05;
    ctx.arc(r+2, r+2, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = 'rgb(255, 255, 255)';
    ctx.globalAlpha = (ExplosionEffect._END_COUNT - this.count + 1) * 0.1;
    ctx.lineWidth = 3;
    ctx.arc(r+2, r+2, r, 0, Math.PI * 2);
    ctx.stroke();

    this.preCanvas[this.count] = cvs;
  }
  surface.drawImage(this.preCanvas[this.count], x-r-2, y-r-2);

//  surface.fillText( x + ':' + y, x, y ) ;
};


ExplosionEffect.prototype.checkLoss = function() {
  return this.count > ExplosionEffect._END_COUNT ? true : false;
};



function GrazeEffectFreeList(num, gameState) {
  this.parent = ElementFreeList ;
  this.parent.call(this, num, gameState);
}
__inherit(GrazeEffectFreeList, ElementFreeList);


GrazeEffectFreeList.prototype._generateElement = function() {
  return new GrazeEffect(this.gameState,
                         this.gameState.getWidth(),
                         this.gameState.getHeight());
};



function GrazeEffect(gameState, maxX, maxY) {
  this.parent = Element;
  this.parent.call(this, gameState, maxX, maxY);
  this.element = null;
  this.theta = 0;
}
__inherit(GrazeEffect, Element);

GrazeEffect._END_COUNT = 20;
GrazeEffect._SPAN = 4;
GrazeEffect._SIZE = 4;
GrazeEffect._FLUCTUATION = 30;
GrazeEffect._GAP = 5;


GrazeEffect.prototype.init = function(params, image, element, bullet) {
  this.parent.prototype.init.call(this, params, image);
  this.element = element;

  if(bullet.getVelocity()) {
    this.theta = bullet.getTheta();
  } else {
    var ax = this.element.getCenterX() - bullet.getCenterX();
    var ay = this.element.getCenterY() - bullet.getCenterY();
    this.theta = this._calculateTheta(Math.atan2(ay, ax));
  }
  // TODO: temporal
  this.theta += this.gameState.count % GrazeEffect._FLUCTUATION
                - GrazeEffect._FLUCTUATION/2;
};


GrazeEffect.prototype.display = function(surface) {
  var x = Math.round(this.getX());
  var y = Math.round(this.getY());
  x = x + (this.count + GrazeEffect._GAP) 
            * Math.cos(this._calculateRadian(this.theta))
            * GrazeEffect._SPAN;
  y = y + (this.count + GrazeEffect._GAP)
            * Math.sin(this._calculateRadian(this.theta))
            * GrazeEffect._SPAN;

  surface.save();
  surface.globalAlpha = 1.0 - this.count/GrazeEffect._END_COUNT;
  surface.fillRect(x-GrazeEffect._SIZE/2, y-GrazeEffect._SIZE/2,
                   GrazeEffect._SIZE, GrazeEffect._SIZE);
  surface.restore();

//  surface.fillText( x + ':' + y, x, y ) ;
} ;


GrazeEffect.prototype.checkLoss = function() {
  return this.count > GrazeEffect._END_COUNT ? true : false;
};


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



function BigExplosionEffectFreeList(num, gameState) {
  this.parent = ElementFreeList;
  this.parent.call(this, num, gameState);
};
__inherit(BigExplosionEffectFreeList, ElementFreeList);


BigExplosionEffectFreeList.prototype._generateElement = function() {
  return new BigExplosionEffect(this.gameState,
                                this.gameState.getWidth(),
                                this.gameState.getHeight());
};



function BigExplosionEffect(gameState, maxX, maxY) {
  this.parent = Element;
  this.parent.call(this, gameState, maxX, maxY);
  this.boss = null;
};
__inherit(BigExplosionEffect, Element);

BigExplosionEffect._WIDTH = 32;
BigExplosionEffect._HEIGHT = 32;


BigExplosionEffect.prototype.init = function(params, image, boss) {
  this.parent.prototype.init.call(this, params, image);

  this.width  = BigExplosionEffect._WIDTH;
  this.height = BigExplosionEffect._HEIGHT;
  this.collisionWidth  = this.width;
  this.collisionHeight = this.height;
  this.boss = boss;
  this.indexX = 0;
  this.indexY = 1;
};


/**
 * TODO: temporal
 */
BigExplosionEffect.prototype.display = function(surface) {
  var x = Math.round(this.getX());
  var y = Math.round(this.getY());
  var r = this.width * this.count * 0.1;
  surface.save();
  surface.fillStyle = 'rgb(255, 255, 255)';
  surface.globalAlpha = (100 - this.count + 1) * 0.005;
  surface.beginPath();
  surface.arc(x, y, r,  0, Math.PI * 2);
  surface.fill();

  surface.strokeStyle = 'rgb(255, 255, 255)';
  surface.globalAlpha = (100 - this.count + 1 ) * 0.01;
  surface.beginPath();
  surface.arc(x, y, r,  0, Math.PI * 2);
  surface.lineWidth = 3;
  surface.stroke();
  surface.restore();

//  surface.fillText( x + ':' + y, x, y ) ;
};


BigExplosionEffect.prototype.checkLoss = function() {
  return this.count > 100 ? true : false;
};


