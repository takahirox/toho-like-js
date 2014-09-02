/**
 * Be careful that this overrides Math.random.
 * Should make individual randomize class.
 */

Math.__xors = {
  x: 123456789,
  y: 362436069,
  z: 521288629,
  w: 88675123
} ;

Math.__effective = 0x7fffffff ;


Math.seed = function(seed) {
  Math.__count = 0;
  Math.__xors.x = 123456789 ;
  Math.__xors.y = 362436069 ;
  Math.__xors.z = 521288629 ;
  Math.__xors.w = seed ;
} ;


Math.random = function( ) {
  var m = Math;
  var xors = m.__xors;

  var t  = xors.x ^ (xors.x << 11);
  xors.x = xors.y;
  xors.y = xors.z;
  xors.z = xors.w;
  xors.w = (xors.w ^ (xors.w >> 19)) ^ (t ^ (t >> 8));
  return (xors.w % m.__effective) / m.__effective;
};



function Randomizer() {
};

Randomizer.prototype._xors = {
  x: 123456789,
  y: 362436069,
  z: 521288629,
  w: 88675123
};

Randomizer.prototype._effective = 0x7fffffff ;


Randomizer.prototype.seed = function(seed) {
  this._xors.x = 123456789;
  this._xors.y = 362436069;
  this._xors.z = 521288629;
  this._xors.w = seed;
};


Randomizer.prototype.random = function() {
  var xors = this._xors;
  var effective = this._effective;

  var t  = xors.x ^ (xors.x << 11);
  xors.x = xors.y;
  xors.y = xors.z;
  xors.z = xors.w;
  xors.w = (xors.w ^ (xors.w >> 19)) ^ (t ^ (t >> 8));
  return (xors.w % effective) / effective;
};

var __randomizer = new Randomizer();


