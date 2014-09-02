function MoveVectorManager( ) {
  this.elements = [ ] ;
  this.factory = null ;
  this._initFactory( ) ;
}

MoveVectorManager.prototype._NUM = 2000;


MoveVectorManager.prototype._initFactory = function() {
  this.factory = new MoveVectorFactory(this._NUM);
};


MoveVectorManager.prototype.reset = function( ) {
  for(var i = 0, len = this.elements.length; i < len; i++) {
    this.factory.free(this.elements[i]);
  }
  this.elements.length = 0;
};


MoveVectorManager.prototype.create = function( params ) {
  return this.factory.create( params ) ;
} ;


MoveVectorManager.prototype.free = function( element ) {
  this.factory.free( element ) ;
} ;



function MoveVectorFactory( num ) {
  this.num = num ;
  this.freelist = null ;
  this._initFreelist( ) ;
}


MoveVectorFactory.prototype._initFreelist = function( ) {
  this.freelist = new MoveVectorFreeList( this.num ) ;
} ;


MoveVectorFactory.prototype.create = function( params ) {
  var vector = this.freelist.get( ) ;
  vector.init( params ) ;
  return vector ;
} ;


MoveVectorFactory.prototype.free = function( vector ) {
  this.freelist.free( vector ) ;
} ;


/**
 * TODO: list may should be Linked list if num is large.
 */
function MoveVectorFreeList( num ) {
  FreeList.call( this, num ) ;
}
__inherit( MoveVectorFreeList, FreeList ) ;


/**
 * Child class must override this method.
 */
MoveVectorFreeList.prototype._generateElement = function( ) {
  return new MoveVector( ) ;
} ;



/**
 *
 */
function MoveVector( ) {
  this.r       = 0 ;  // TODO: should be "v"elocity?
  this.theta   = 90 ;
  this.w       = 0 ;
  this.ra      = 0 ;
  this.wa      = 0 ;
  this.raa     = 0 ;
  this.waa     = 0 ;
  this.trange  = null ;
  this.rrange  = null ;
  this.wrange  = null ;
  this.rarange = null ;
  this.warange = null ;
  this.element = null ;
  this.reflectCount = 0 ;
}

// only for reference
MoveVector.prototype.Math = Math;
MoveVector.prototype.Randomizer = __randomizer;


MoveVector.prototype.init = function( params ) {
  this.r       = params.r       !== void 0 ? params.r       : 0 ;
  this.theta   = params.theta   !== void 0 ? params.theta   : 90 ;
  this.w       = params.w       !== void 0 ? params.w       : 0 ;
  this.ra      = params.ra      !== void 0 ? params.ra      : 0 ;
  this.wa      = params.wa      !== void 0 ? params.wa      : 0 ;
  this.raa     = params.raa     !== void 0 ? params.raa     : 0 ;
  this.waa     = params.waa     !== void 0 ? params.waa     : 0 ;
  this.trange  = params.trange  !== void 0 ? params.trange  : null ;
  this.rrange  = params.rrange  !== void 0 ? params.rrange  : null ;
  this.wrange  = params.wrange  !== void 0 ? params.wrange  : null ;
  this.rarange = params.rarange !== void 0 ? params.rarange : null ;
  this.warange = params.warange !== void 0 ? params.warange : null ;
  this.element = null ;
  this.reflectCount = 0 ;

  if(params.rrandom !== void 0)
    this.r = this._getRandomValue( params.rrandom ) ;
  if(params.trandom !== void 0)
    this.theta = this._getRandomValue( params.trandom ) ;
  if(params.wrandom !== void 0)
    this.w = this._getRandomValue( params.wrandom ) ;
} ;


/**
 * TODO: temporal
 * How to handle floating point...?
 */
MoveVector.prototype._getRandomValue = function( range ) {
  var differ = range.max - range.min ;
  return ((this.Randomizer.random() * differ) | 0) + range.min ;
} ;


MoveVector.prototype.setHomingElement = function( e ) {
  this.element = e ;
} ;


MoveVector.prototype.runStep = function( ) {
  this.theta += this.w ;
  this.r     += this.ra ;
  this.w     += this.wa ;
  this.ra    += this.raa ;
  this.wa    += this.waa ;
  this.theta = this._beInRange( this.theta, this.trange ) ;
  this.r     = this._beInRange( this.r,     this.rrange ) ;
  this.w     = this._beInRange( this.w,     this.wrange ) ;
  this.ra    = this._beInRange( this.ra,    this.rarange ) ;
  this.wa    = this._beInRange( this.wa,    this.warange ) ;
} ;


MoveVector.prototype._beInRange = function( value, range ) {
  if(range === null)
    return value;

  if(range.max !== void 0 && value > range.max)
    value = range.max ;
  if(range.min !== void 0 && value < range.min)
    value = range.min
  return value;
};


MoveVector.prototype._getRadian = function( ) {
  return this.theta / 180 * this.Math.PI ;
} ;


MoveVector.prototype.moveX = function( ) {
  return this.r * this.Math.cos( this._getRadian( ) ) ;
} ;


MoveVector.prototype.moveY = function( ) {
  return this.r * this.Math.sin( this._getRadian( ) ) ;
} ;


MoveVector.prototype.reflect = function( ) {
  this.theta += 180 ;
  this.reflectCount++ ;
} ;

MoveVector.prototype.reflectX = function( ) {
  this.theta = 180 - this.theta ;
  this.reflectCount++ ;
} ;


MoveVector.prototype.reflectY = function( ) {
  this.theta = 360 - this.theta ;
  this.reflectCount++ ;
} ;


MoveVector.prototype.getReflectCount = function( ) {
  return this.reflectCount ;
} ;


