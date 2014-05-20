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


Math.seed = function( seed ) {
  Math.__xors.x = 123456789 ;
  Math.__xors.y = 362436069 ;
  Math.__xors.z = 521288629 ;
  Math.__xors.w = seed ;
} ;

Math.random = function( ) {
  var t ;
  t = Math.__xors.x ^ ( Math.__xors.x << 11 ) ;
  Math.__xors.x = Math.__xors.y ;
  Math.__xors.y = Math.__xors.z ;
  Math.__xors.z = Math.__xors.w ;
  Math.__xors.w = ( Math.__xors.w ^ ( Math.__xors.w >> 19 ) ) ^ ( t ^ ( t >> 8 ) ) ;
  return ( Math.__xors.w % Math.__effective ) / Math.__effective ;
}