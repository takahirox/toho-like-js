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
 * TODO: temporal
 */
EffectManager.prototype.createGraze = function(element, params) {
  this.addElement(this.factory.createGraze(element, params));
};



function EffectFactory(gameState, maxX, maxY) {
  this.parent = ElementFactory;
  this.grazeFreelist = null;
  this.parent.call(this, gameState, maxX, maxY);
} ;
__inherit(EffectFactory, ElementFactory);

EffectFactory._SHOCKWAVE_NUM = 200 ;
EffectFactory._GRAZE_NUM = 200 ;

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


EffectFactory.prototype.free = function(element) {
  if(element instanceof GrazeEffect)
    this.grazeFreelist.free(element);
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
  x = x + this.count * Math.cos(this._calculateRadian(this.theta))
            * GrazeEffect._SPAN;
  y = y + this.count * Math.sin(this._calculateRadian(this.theta))
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
