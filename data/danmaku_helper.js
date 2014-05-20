function DanmakuHelper( ) {

}

DanmakuHelper.prototype._calculateRadian = function( theta ) {
  return theta * Math.PI / 180 ;
} ;


DanmakuHelper.prototype._calculateTheta = function( radian ) {
  return parseInt( radian * 180 / Math.PI ) ;
} ;


DanmakuHelper.prototype.daiYousei1 = function( ) {
  var array = [ ] ;
  var r = 30 ;
  for( var i = 0; i < 36; i++ ) {
    var count = i * 1 ;
    var t = ( ( i * 10 ) + 90 ) % 360 ;
    var v = { 'x': r * Math.cos( this._calculateRadian( t ) ),
              'y': r * Math.sin( this._calculateRadian( t ) ),
              'count': i * 1,
              'v': { 'r': 2 + ( i / 50 ), 'theta': t }
            } ;
    array.push( v ) ;
  }
  return array ;
} ;


DanmakuHelper.prototype.daiYousei2 = function( ) {
  var array = [ ] ;
  var r = 30 ;
  for( var i = 0; i < 36; i++ ) {
    var count = i * 1 ;
    var t = ( ( i * -10 ) + 450 ) % 360 ;
    var v = { 'x': r * Math.cos( this._calculateRadian( t ) ),
              'y': r * Math.sin( this._calculateRadian( t ) ),
              'count': count,
              'v': { 'r': 2 + ( i / 50 ), 'theta': t }
            } ;
    array.push( v ) ;
  }
  return array ;
} ;


DanmakuHelper.prototype.chilno1 = function( ) {
  var array = [ ] ;
  var r = 50 ;
  var r2 = 100 ;
  var points = [ ] ;
  var span = 10 ;
  for( var i = 0; i < 5; i++ ) {
    points[ i ] = ( 126 + 144 * i ) % 360 ;
  }
  for( var i = 0; i < 5; i++ ) {
    var t1 = points[ i ] ;
    var t2 = points[ ( i + 1 ) % 5 ] ;
    var x1 = r * Math.cos( this._calculateRadian( t1 ) ) ;
    var y1 = r * Math.sin( this._calculateRadian( t1 ) ) ;
    var x2 = r * Math.cos( this._calculateRadian( t2 ) ) ;
    var y2 = r * Math.sin( this._calculateRadian( t2 ) ) ;
    for( var j = 0; j < span; j++ ) {
      var count = ( j + i * span ) ;
      var x = x1 + ( x2 - x1 ) / span * j ;
      var y = y1 + ( y2 - y1 ) / span * j ;
      var t = this._calculateTheta( Math.atan2( y, x ) ) ;
      for( var k = 0; k < 5; k++ ) {
        var at = points[ k ] ;
        var ax = x + r2 * Math.cos( this._calculateRadian( at ) ) ;
        var ay = y + r2 * Math.sin( this._calculateRadian( at ) ) ;
        var v = { 'x': ax,
                  'y': ay,
                  'count': count,
                  'v': [
                    { 'count': 0,            'v': { 'r': 0, 'theta': t, } },
                    { 'count': span*6-count, 'v': { 'r': 2, 'w': 0 } }
                  ]
                } ;
        array.push( v ) ;
      }
    }
  }
  return array ;
} ;


DanmakuHelper.prototype.chilno2 = function( ) {
  var array = [ ] ;
  for( var i = 0; i < 200; i++ ) {
    var count = i * 1 ;
    var v = {
              'count': count,
              'v': [
                { 'count': 0,
                  'v': { 'r': 5, 'theta':   0, 'w': 0, 'ra': -0.01, 'wa': 0, 'rrandom': { 'min': 4, 'max': 5 }, 'rrange': { 'min': 2 }, 'trandom': { 'min': 0, 'max': 360 } },
                },
                { 'count': 200 - count,
                  'v': { 'r': 0 },
                },
                { 'count': 400 - count,
                  'v': { 'r': 1, 'theta':   0, 'w': 0, 'ra': 0.02, 'wa': 0, 'trandom': { 'min': 0, 'max': 360 } },
                },
              ]
            } ;
    array.push( v ) ;
  }
  return array ;
} ;
