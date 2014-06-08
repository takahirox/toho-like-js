/**
 * TODO: optimize this file.
 *       some codes and parameters are no longer used
 *       because of the design change.
 */

/**
 * Effect represents an element which just shows on a screen,
 * and not affect any other elements.
 */
function EffectManager(gameState) {
  this.parent = ElementManager;
  this.parent.call(this, gameState);
};
__inherit(EffectManager, ElementManager);

EffectManager._MAX_NUM = 200; // TODO: for each so far


EffectManager.prototype._initMaxNum = function() {
  return EffectManager._MAX_NUM;
};


EffectManager.prototype._initFactory = function() {
  this.factory = new EffectFactory(this.gameState,
                                   this.gameState.getWidth(),
                                   this.gameState.getHeight());
};



/**
 * TODO: consider the design. To use drawers is easy to handle,
 *       but not smart. To extend Drawer could be smarter and
 *       performance could be better.
 */
EffectManager.prototype.initDrawer = function(layer, image) {
  this.drawers = [];
  this.drawers.push(this._generateShockWaveDrawer(layer));
  this.drawers.push(this._generateGrazeDrawer(layer));
  this.drawers.push(this._generateExplosionDrawer(layer));
  this.drawers.push(this._generateDamageDrawer(layer));
  this.drawers.push(this._generateBigShockWaveDrawer(layer));
  this.drawers.push(this._generateBigExplosionDrawer(layer));
};


EffectManager.prototype._generateShockWaveDrawer = function(layer) {
  return new ShockWaveDrawer(this, layer,
                             this._generateShockWaveImage());
};


EffectManager.prototype._generateGrazeDrawer = function(layer) {
  return new GrazeDrawer(this, layer,
                         this._generateGrazeImage());
};


EffectManager.prototype._generateExplosionDrawer = function(layer) {
  return new ExplosionDrawer(this, layer,
                             this._generateExplosionImage());
};


EffectManager.prototype._generateBigShockWaveDrawer = function(layer) {
  return new BigShockWaveDrawer(this, layer,
                                this._generateBigShockWaveImage());
};


EffectManager.prototype._generateBigExplosionDrawer = function(layer) {
  return new BigExplosionDrawer(this, layer,
                                this._generateBigExplosionImage());
};


EffectManager.prototype._generateDamageDrawer = function(layer) {
  return new DamageDrawer(this, layer,
                          this._generateDamageImage());
};


/**
 * create ShockWaveEffect.
 * TODO: rename or combine with other create methods.
 */
EffectManager.prototype.create = function(element, type, params) {
  this.addElement(this.factory.create(element, type, params));
};


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
EffectManager.prototype.createBigShockWave = function(enemy, type, params) {
  this.addElement(this.factory.createBigShockWave(enemy, type, params));
};


/**
 * TODO: temporal. combine with create()?
 */
EffectManager.prototype.createBigExplosion = function(enemy) {
  this.addElement(this.factory.createBigExplosion(enemy));
};


/**
 * TODO: should move into ShockWave?
 */
EffectManager.prototype._generateShockWaveImage = function() {
  var cvs = document.createElement('canvas');
  cvs.width = Layer.calculateSquareValue(ShockWaveEffect._WIDTH);
  cvs.height = Layer.calculateSquareValue(
                 ShockWaveEffect._HEIGHT*ShockWaveEffect._END_COUNT);
  var ctx = cvs.getContext('2d');

  var w = ShockWaveEffect._WIDTH;
  var h = ShockWaveEffect._HEIGHT;
  for(var i = 0; i < ShockWaveEffect._END_COUNT; i++) {
    var x = w/2;
    var y = h*i + h/2;
    var r = ShockWaveEffect._SPEED * i;
    var s = 1 - ShockWaveEffect._GRADATION/(ShockWaveEffect._SPEED*i);

    if(r <= 1)
      r = 1;
    if(s < 0)
      s = 0.0;

    ctx.beginPath();
    var g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(s, 'rgba(255, 255, 255, 0.0)');
    g.addColorStop(1.00, 'rgba(255, 255, 255, 1.0)');
    ctx.fillStyle = g;
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  return cvs;
};


/**
 * TODO: should move into Graze?
 */
EffectManager.prototype._generateGrazeImage = function() {
  var cvs = document.createElement('canvas');
  cvs.width = Layer.calculateSquareValue(GrazeEffect._SIZE);
  cvs.height = Layer.calculateSquareValue(GrazeEffect._SIZE);
  var ctx = cvs.getContext('2d');

  var w = GrazeEffect._SIZE;
  var h = GrazeEffect._SIZE;
  ctx.fillStyle = 'rgb(255, 255, 255)';
  ctx.fillRect(0, 0, w, h);
  return cvs;
};


/**
 * TODO: should move into Explosion?
 */
EffectManager.prototype._generateExplosionImage = function() {
  var cvs = document.createElement('canvas');
  cvs.width = Layer.calculateSquareValue(ExplosionEffect._WIDTH);
  cvs.height = Layer.calculateSquareValue(
                 ExplosionEffect._HEIGHT*ExplosionEffect._END_COUNT);
  var ctx = cvs.getContext('2d');

  var w = ExplosionEffect._WIDTH;
  var h = ExplosionEffect._HEIGHT;
  for(var i = 0; i < ExplosionEffect._END_COUNT; i++) {
    var x = w/2;
    var y = h*i + h/2;
    var r = w/2 * i/ExplosionEffect._END_COUNT - 2;
    if(r <= 1)
      r = 1;

    ctx.beginPath();
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.globalAlpha = 0.5;
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = 'rgb(255, 255, 255)';
    ctx.globalAlpha = 1;
    ctx.lineWidth = 4;
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  return cvs;
};


/**
 * TODO: should move into DamageEffect?
 */
EffectManager.prototype._generateDamageImage = function() {
  var cvs = document.createElement('canvas');
  cvs.width = Layer.calculateSquareValue(DamageEffect._WIDTH);
  cvs.height = Layer.calculateSquareValue(DamageEffect._HEIGHT);
  var ctx = cvs.getContext('2d');

  var w = DamageEffect._WIDTH;
  var h = DamageEffect._HEIGHT;
  var x = w/2;
  var y = h/2;
  var r = w/2-4;

  ctx.beginPath();
  ctx.fillStyle = 'rgb(255, 255, 255)';
  ctx.globalAlpha = 0.5;
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  return cvs;
};


/**
 * TODO: should move into BigShockWave?
 * TODO: can share the logic with _generateShockWaveImage()?
 */
EffectManager.prototype._generateBigShockWaveImage = function() {
  var cvs = document.createElement('canvas');
  cvs.width = Layer.calculateSquareValue(BigShockWaveEffect._WIDTH);
  cvs.height = Layer.calculateSquareValue(BigShockWaveEffect._HEIGHT);
  var ctx = cvs.getContext('2d');

  var w = BigShockWaveEffect._WIDTH;
  var h = BigShockWaveEffect._HEIGHT;
  var x = w/2;
  var y = h/2;
  var r = w/2;
  // TODO: remove magic numbers.
  var s = 1 - (5*4)/(10*10);

  if(r <= 1)
    r = 1;
  if(s < 0)
    s = 0.0;

  ctx.beginPath();
  var g = ctx.createRadialGradient(x, y, 0, x, y, r);
  // TODO: bad to get params from other class.
  g.addColorStop(s, 'rgba(255, 255, 255, 0.0)');
  g.addColorStop(1.00, 'rgba(255, 255, 255, 1.0)');
  ctx.fillStyle = g;
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  return cvs;
};


/**
 * TODO: should move into BigExplosion?
 */
EffectManager.prototype._generateBigExplosionImage = function() {
  var cvs = document.createElement('canvas');
  cvs.width = Layer.calculateSquareValue(BigExplosionEffect._WIDTH);
  cvs.height = Layer.calculateSquareValue(BigExplosionEffect._HEIGHT);
  var ctx = cvs.getContext('2d');

  var w = BigExplosionEffect._WIDTH;
  var h = BigExplosionEffect._HEIGHT;
  var x = w/2;
  var y = h/2;
  var r = w/2 - 2;

  ctx.beginPath();
  ctx.fillStyle = 'rgb(255, 255, 255)';
  ctx.globalAlpha = 0.5;
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.strokeStyle = 'rgb(255, 255, 255)';
  ctx.globalAlpha = 1;
  ctx.lineWidth = 4;
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  return cvs;
};


EffectManager.prototype.draw = function(layer) {
  for(var i = 0; i < this.drawers.length; i++) {
    this.drawers[i].draw(layer);
  }
};



function EffectFactory(gameState, maxX, maxY) {
  this.parent = ElementFactory;
  this.grazeFreelist = null;
  this.damageFreelist = null;
  this.explosionFreelist = null;
  this.bShockWaveFreelist = null;
  this.bExplosionFreelist = null;
  this.parent.call(this, gameState, maxX, maxY);
} ;
__inherit(EffectFactory, ElementFactory);

EffectFactory._SHOCKWAVE_NUM = 200 ;
EffectFactory._GRAZE_NUM = 200 ;
EffectFactory._DAMAGE_NUM = 200;
EffectFactory._EXPLOSION_NUM = 200;
EffectFactory._BIG_SHOCKWAVE_NUM = 10;
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
                                 EffectFactory._EXPLOSION_NUM, this.gameState);
  this.bShockWaveFreelist = new BigShockWaveEffectFreeList(
                                  EffectFactory._BIG_SHOCKWAVE_NUM,
                                  this.gameState);
  this.bExplosionFreelist = new BigExplosionEffectFreeList(
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
 * TODO: temporal. combine this method with create( )?
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


/**
 * TODO: temporal. combine this method with create( )?
 */
EffectFactory.prototype.createExplosion = function(enemy) {
  var effect = this.explosionFreelist.get();
  effect.init(enemy, this.gameState.getImage(Game._IMG_VANISHED), enemy);
  return effect;
};


/**
 * TODO: temporal. combine this method with create( )?
 */
EffectFactory.prototype.createBigShockWave = function(element, type, params) {
  params.x = element.getX();
  params.y = element.getY();

  var effect = this.bShockWaveFreelist.get();
  effect.init(params, this._getImage(params), element);
  return effect;
};


/**
 * TODO: temporal. combine this method with create( )?
 */
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
  else if(element instanceof BigShockWaveEffect)
    this.bShockWaveFreelist.free(element);
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



function ShockWaveDrawer(elementManager, layer, image) {
  this.parent = ElementDrawer;
  this.parent.call(this, elementManager, layer, image);
};
__inherit(ShockWaveDrawer, ElementDrawer);


ShockWaveDrawer.prototype._doPour = function(e) {
  return (e instanceof ShockWaveEffect);
};



function ShockWaveView(element) {
  this.parent = ElementView;
  this.parent.call(this, element);
  this.a = 0.1;
};
__inherit(ShockWaveView, ElementView);


ShockWaveView.prototype.animate = function() {
  this._initCoordinates();
};



/**
 * This class is for small shockwave like the one
 * it shows when enemy is destroyed.
 */
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

ShockWaveEffect._WIDTH = 200;
ShockWaveEffect._HEIGHT = 200;
ShockWaveEffect._END_COUNT = 10;

ShockWaveEffect._GRADATION = 20;
ShockWaveEffect._SPEED = 10;

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
  this.width = ShockWaveEffect._WIDTH;
  this.height = ShockWaveEffect._HEIGHT;
  this.w = params.w;
  this.g = params.g;
  this.a = params.a;
  this.b = params.b;
  this.default = params.default;
  this.endCount = this._calculateEndCount(params.endCount);
  this._initView();
};


ShockWaveEffect.prototype._generateView = function() {
  return new ShockWaveView(this);
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


ShockWaveEffect.prototype.getImageIndexX = function() {
  return 0;
};


ShockWaveEffect.prototype.getImageIndexY = function() {
  return this.count;
};


/**
 * TODO: temporal
 */
ShockWaveEffect.prototype.getImageWidth = function() {
  return 256;
};


/**
 * TODO: temporal
 */
ShockWaveEffect.prototype.getImageHeight = function() {
  return 2048;
};



function BigShockWaveEffectFreeList(num, gameState) {
  this.parent = ElementFreeList;
  this.parent.call(this, num, gameState);
}
__inherit(BigShockWaveEffectFreeList, ElementFreeList);


BigShockWaveEffectFreeList.prototype._generateElement = function() {
  return new BigShockWaveEffect(this.gameState,
                                this.gameState.getWidth(),
                                this.gameState.getHeight());
};



function BigShockWaveDrawer(elementManager, layer, image) {
  this.parent = ElementDrawer;
  this.parent.call(this, elementManager, layer, image);
};
__inherit(BigShockWaveDrawer, ElementDrawer);


BigShockWaveDrawer.prototype._doPour = function(e) {
  return (e instanceof BigShockWaveEffect);
};



function BigShockWaveView(element) {
  this.parent = ElementView;
  this.parent.call(this, element);
};
__inherit(BigShockWaveView, ElementView);


BigShockWaveView.prototype.animate = function() {
  this.a = this.element.a;

  var w = this.element.b * this.element.count;
  var h = this.element.b * this.element.count;

  this.vertices[0]  = -w;
  this.vertices[1]  = -h;
  this.vertices[2]  = -1.0;
  this.vertices[3]  =  w;
  this.vertices[4]  = -h;
  this.vertices[5]  = -1.0;
  this.vertices[6]  =  w;
  this.vertices[7]  =  h;
  this.vertices[8]  = -1.0;
  this.vertices[9]  = -w;
  this.vertices[10] =  h;
  this.vertices[11] = -1.0;
};



function BigShockWaveEffect(gameState, maxX, maxY) {
  this.parent = Element;
  this.parent.call(this, gameState, maxX, maxY);
  this.element = null;
  this.w = null;
  this.g = null;
  this.a = null;
  this.b = null;
  this.default = null;
  this.endCount = null;
  this.preCanvas = ShockWaveEffect._PRE_CANVAS;
}
__inherit(BigShockWaveEffect, Element);

BigShockWaveEffect._WIDTH = 512;
BigShockWaveEffect._HEIGHT = 512;


BigShockWaveEffect.prototype.init = function(params, image, element) {
  this.parent.prototype.init.call(this, params, image);
  this.element = element;
  this.width = 512;
  this.height = 512;
  this.w = params.w;
  this.g = params.g;
  this.a = params.a;
  this.b = params.b;
  this.default = params.default;
  this.endCount = this._calculateEndCount(params.endCount);
  this._initView();
};


BigShockWaveEffect.prototype._generateView = function() {
  return new BigShockWaveView(this);
};


BigShockWaveEffect.prototype._calculateEndCount = function(count) {

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


BigShockWaveEffect.prototype.checkLoss = function( ) {
  return this.count > this.endCount ? true : false ;
} ;


/**
 * TODO: temporal
 */
BigShockWaveEffect.prototype.getImageWidth = function() {
  return 512;
};


/**
 * TODO: temporal
 */
BigShockWaveEffect.prototype.getImageHeight = function() {
  return 512;
};



function ExplosionEffectFreeList(num, gameState) {
  this.parent = ElementFreeList;
  this.parent.call(this, num, gameState);
};
__inherit(ExplosionEffectFreeList, ElementFreeList);


ExplosionEffectFreeList.prototype._generateElement = function() {
  return new ExplosionEffect(this.gameState, this.gameState.getWidth(),
                             this.gameState.getHeight());
};



function ExplosionDrawer(elementManager, layer, image) {
  this.parent = ElementDrawer;
  this.parent.call(this, elementManager, layer, image);
};
__inherit(ExplosionDrawer, ElementDrawer);


ExplosionDrawer.prototype._doPour = function(e) {
  return (e instanceof ExplosionEffect);
};



function ExplosionView(element) {
  this.parent = ElementView;
  this.parent.call(this, element);
};
__inherit(ExplosionView, ElementView);


ExplosionView.prototype.animate = function() {
  this._initCoordinates();
  this.a = (ExplosionEffect._END_COUNT - this.element.count + 1)/
             ExplosionEffect._END_COUNT;
};



function ExplosionEffect(gameState, maxX, maxY) {
  this.parent = Element;
  this.parent.call(this, gameState, maxX, maxY);
  this.preCanvas = ExplosionEffect._PRE_CANVAS;
}
__inherit(ExplosionEffect, Element);

ExplosionEffect._WIDTH = 64 ;
ExplosionEffect._HEIGHT = 64 ;
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
  this._initView();
};


ExplosionEffect.prototype._generateView = function() {
  return new ExplosionView(this);
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


ExplosionEffect.prototype.getImageIndexX = function() {
  return 0;
};


ExplosionEffect.prototype.getImageIndexY = function() {
  return this.count;
};


/**
 * TODO: temporal
 */
ExplosionEffect.prototype.getImageWidth = function() {
  return 64;
};


/**
 * TODO: temporal
 */
ExplosionEffect.prototype.getImageHeight = function() {
  return 1024;
};



function GrazeDrawer(elementManager, layer, image) {
  this.parent = ElementDrawer;
  this.parent.call(this, elementManager, layer, image);
};
__inherit(GrazeDrawer, ElementDrawer);


GrazeDrawer.prototype._doPour = function(e) {
  return (e instanceof GrazeEffect);
};



function GrazeView(element) {
  this.parent = ElementView;
  this.parent.call(this, element);
  this.a = 0.1;
};
__inherit(GrazeView, ElementView);


GrazeView.prototype.animate = function() {
  this.a = 1.0 - this.element.count/GrazeEffect._END_COUNT;
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


GrazeEffect.prototype._generateView = function() {
  return new GrazeView(this);
};


GrazeEffect.prototype.init = function(params, image, element, bullet) {
  this.parent.prototype.init.call(this, params, image);
  this.element = element;

  this.width = GrazeEffect._SIZE;
  this.height = GrazeEffect._SIZE;

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

  // TODO: temporal
  for(var i = 0; i < GrazeEffect._GAP; i++)
    this.move();

  this._initView();
};


/**
 * TODO: use MoveVector?
 */
GrazeEffect.prototype.move = function() {
  var x = this.getX();
  var y = this.getY();
  x = x + Math.cos(this._calculateRadian(this.theta))
            * GrazeEffect._SPAN;
  y = y + Math.sin(this._calculateRadian(this.theta))
            * GrazeEffect._SPAN;
  this.setX(x);
  this.setY(y);
};


GrazeEffect.prototype.display = function(surface) {
  var x = Math.round(this.getX());
  var y = Math.round(this.getY());
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


/**
 * TODO: temporal
 */
GrazeEffect.prototype.getImageWidth = function() {
  return GrazeEffect._SIZE;
};


/**
 * TODO: temporal
 */
GrazeEffect.prototype.getImageHeight = function() {
  return GrazeEffect._SIZE;
};



function DamageEffectFreeList( num, gameState ) {
  this.parent = ElementFreeList ;
  this.parent.call( this, num, gameState ) ;
} ;
__inherit( DamageEffectFreeList, ElementFreeList ) ;


DamageEffectFreeList.prototype._generateElement = function( ) {
  return new DamageEffect( this.gameState, this.gameState.getWidth( ), this.gameState.getHeight( ) ) ;
} ;



function DamageDrawer(elementManager, layer, image) {
  this.parent = ElementDrawer;
  this.parent.call(this, elementManager, layer, image);
};
__inherit(DamageDrawer, ElementDrawer);


DamageDrawer.prototype._doPour = function(e) {
  return (e instanceof DamageEffect);
};



function DamageView(element) {
  this.parent = ElementView;
  this.parent.call(this, element);
};
__inherit(DamageView, ElementView);


DamageView.prototype.animate = function() {
  this.a = (DamageEffect._END_COUNT - this.element.count + 1) * 0.02;
};



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
DamageEffect._END_COUNT = 2;


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

  // TODO: temporal
  var tmp = 32;
  this.dx = -tmp/2 + (Math.pow(this.gameState.count, 2)%32);
  this.dy = -tmp/2 + (Math.pow(this.gameState.count, 2)%32);

  this._initView();
} ;


DamageEffect.prototype._generateView = function() {
  return new DamageView(this);
};


/**
 * TODO: temporal
 */
DamageEffect.prototype.runStep = function( ) {
  var tmp = 32 ;
  this.dx = -tmp / 2 + parseInt( Math.random( ) * tmp ) ;
  this.dy = -tmp / 2 + parseInt( Math.random( ) * tmp ) ;
  this.parent.prototype.runStep.call( this ) ;
} ;


DamageEffect.prototype.getX = function() {
  return this.parent.prototype.getX.call(this) + this.dx;
};


DamageEffect.prototype.getY = function() {
  return this.parent.prototype.getY.call(this) + this.dy;
};


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


/**
 * TODO: temporal
 */
DamageEffect.prototype.getImageWidth = function() {
  return DamageEffect._WIDTH;
};


/**
 * TODO: temporal
 */
DamageEffect.prototype.getImageHeight = function() {
  return DamageEffect._HEIGHT;
};



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



function BigExplosionDrawer(elementManager, layer, image) {
  this.parent = ElementDrawer;
  this.parent.call(this, elementManager, layer, image);
};
__inherit(BigExplosionDrawer, ElementDrawer);


BigExplosionDrawer.prototype._doPour = function(e) {
  return (e instanceof BigExplosionEffect);
};



function BigExplosionView(element) {
  this.parent = ElementView;
  this.parent.call(this, element);
};
__inherit(BigExplosionView, ElementView);


BigExplosionView.prototype.animate = function() {
  this.a = (BigExplosionEffect._END_COUNT - this.element.count + 1)/
             BigExplosionEffect._END_COUNT;
  var w = 32 * this.element.count * 0.1;
  var h = 32 * this.element.count * 0.1;

  this.vertices[0]  = -w;
  this.vertices[1]  = -h;
  this.vertices[2]  = -1.0;
  this.vertices[3]  =  w;
  this.vertices[4]  = -h;
  this.vertices[5]  = -1.0;
  this.vertices[6]  =  w;
  this.vertices[7]  =  h;
  this.vertices[8]  = -1.0;
  this.vertices[9]  = -w;
  this.vertices[10] =  h;
  this.vertices[11] = -1.0;
};




function BigExplosionEffect(gameState, maxX, maxY) {
  this.parent = Element;
  this.parent.call(this, gameState, maxX, maxY);
  this.boss = null;
};
__inherit(BigExplosionEffect, Element);

BigExplosionEffect._WIDTH = 320;
BigExplosionEffect._HEIGHT = 320;

BigExplosionEffect._END_COUNT = 100;

BigExplosionEffect.prototype.init = function(params, image, boss) {
  this.parent.prototype.init.call(this, params, image);
  this.width  = BigExplosionEffect._WIDTH;
  this.height = BigExplosionEffect._HEIGHT;
  this.collisionWidth  = this.width;
  this.collisionHeight = this.height;
  this.boss = boss;
  this.indexX = 0;
  this.indexY = 0;
  this._initView();
};


BigExplosionEffect.prototype._generateView = function() {
  return new BigExplosionView(this);
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
  surface.globalAlpha = (BigExplosionEffect._END_COUNT - this.count + 1)
                          * 0.005;
  surface.beginPath();
  surface.arc(x, y, r,  0, Math.PI * 2);
  surface.fill();

  surface.strokeStyle = 'rgb(255, 255, 255)';
  surface.globalAlpha = (BigExplosionEffect._END_COUNT - this.count + 1 )
                          * 0.01;
  surface.beginPath();
  surface.arc(x, y, r,  0, Math.PI * 2);
  surface.lineWidth = 3;
  surface.stroke();
  surface.restore();

//  surface.fillText( x + ':' + y, x, y ) ;
};


BigExplosionEffect.prototype.checkLoss = function() {
  return this.count > BigExplosionEffect._END_COUNT ? true : false;
};


/**
 * TODO: temporal
 */
BigExplosionEffect.prototype.getImageWidth = function() {
  return 512;
};


/**
 * TODO: temporal
 */
BigExplosionEffect.prototype.getImageHeight = function() {
  return 512;
};