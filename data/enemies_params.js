var __stage1EnemiesParams = [ ] ;


/*
__stage1EnemiesParams.push(
  { 'count': 100,
    'x': 240,
    'y': 100,
    'vital': 3,
    's': [
      { 'bullet': 20, 'type': 6, 'shotCount': [ 10 ], 'loop': true },
//      { 'bullet': 11, 'type': 6, 'shotCount': [ 100 ], 'loop': true },
//      { 'bullet': 8, 'type': 7, 'shotCount': [ 0 ], 'loop': true, 'r': 20 },
    ],
    'v': { 'r': 0,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 },
  }
) ;
*/

for( var i = 0; i < 6 ; i++ ) {
  __stage1EnemiesParams.push(
    { 'count': 100 + i * 15,
      'x': 50 + i * 20,
      'vital': 1,
      'powerItem': i % 2 == 0 ? 1 : 0,
      'scoreItem': i % 2 == 1 ? 1 : 0,
      'v': [
        { 'count':   0,  'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':    0 } },
        { 'count':  50,  'v': { 'r': 2,               'w':    0, 'ra': 0, 'wa': 0.01, 'trange': { 'max': 135 }, 'wrange': { 'max': 0.5 } } },
      ]
    }
  ) ;
}

for( var i = 0; i < 6 ; i++ ) {
  __stage1EnemiesParams.push(
    { 'count': 300 + i * 15,
      'x': 380 - i * 20,
      'vital': 1,
      'powerItem': i % 2 == 0 ? 1 : 0,
      'scoreItem': i % 2 == 1 ? 1 : 0,
      'v': [
        { 'count':   0,  'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
        { 'count':  50,  'v': { 'r': 2,               'w':    0, 'ra': 0, 'wa': -0.01, 'trange': { 'min': 45 }, 'wrange': { 'min': -0.5 } } },
      ]
    }
  ) ;
}


for( var i = 0; i < 6 ; i++ ) {
  __stage1EnemiesParams.push(
    { 'count': 500 + i * 15,
      'x': 50 + i * 20,
      'vital': 1,
      'powerItem': i % 2 == 0 ? 1 : 0,
      'scoreItem': i % 2 == 1 ? 1 : 0,
      'v': [
        { 'count':   0,  'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':    0 } },
        { 'count':  50,  'v': { 'r': 2,               'w':    0, 'ra': 0, 'wa': 0.01, 'trange': { 'max': 135 }, 'wrange': { 'max': 0.5 } } },
      ]
    }
  ) ;
}

for( var i = 0; i < 6 ; i++ ) {
  __stage1EnemiesParams.push(
    { 'count': 700 + i * 15,
      'x': 380 - i * 20,
      'vital': 1,
      'powerItem': i % 2 == 0 ? 1 : 0,
      'v': [
        { 'count':   0,  'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
        { 'count':  50,  'v': { 'r': 2,               'w':    0, 'ra': 0, 'wa': -0.01, 'trange': { 'min': 45 }, 'wrange': { 'min': -0.5 } } },
      ]
    }
  ) ;
}

for( var i = 0; i < 8 ; i++ ) {
  __stage1EnemiesParams.push(
    { 'count': 900 + i * ( 80 - i * 5 ),
      'x': 25 + (i%4) * 50,
      'vital': 3,
      'powerItem': i % 2 == 0 ? 1 : 0,
      's': { 'bullet': 0, 'shotCount': [ 40+(i%2)*20 ] },
      'v': [
        { 'count':   0,      'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
        { 'count':  30+(i%2)*20, 'v': { 'r': 0,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
        { 'count': 130+(i%2)*20, 'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':   0.1, 'trange': { 'max': 190 } } },
      ]
    }
  ) ;
}

for( var i = 0; i < 8 ; i++ ) {
  __stage1EnemiesParams.push(
    { 'count': 950 + i * ( 80 - i * 5 ),
      'x': 455 - (i%4) * 50,
      'vital': 3,
      'powerItem': i % 2 == 0 ? 1 : 0,
      's': { 'bullet': 0, 'shotCount': [ 40+(i%2)*20 ] },
      'v': [
        { 'count':   0,      'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
        { 'count':  30+(i%2)*20, 'v': { 'r': 0,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
        { 'count': 130+(i%2)*20, 'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':  -0.1, 'trange': { 'min': -10 } } },
      ]
    }
  ) ;
}

for( var i = 0; i < 4 ; i++ ) {
  __stage1EnemiesParams.push(
    { 'count': 1400 + i * 20,
      'x': 50 + i * 50,
      'vital': 1,
      'powerItem': i % 4 == 0 ? 1 : 0,
      'scoreItem': i % 4 == 2 ? 1 : 0,
      's': { 'bullet': 1, 'shotCount': [ 40 ] },
      'v': [
        { 'count':   0,  'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':    0 } },
        { 'count':  30,  'v': { 'r': 2,               'w':    0, 'ra': 0, 'wa': -0.01, 'trange': { 'min': -30 }, 'wrange': { 'min': -1 } } },
      ]
    }
  ) ;
}

for( var i = 0; i < 4 ; i++ ) {
  __stage1EnemiesParams.push(
    { 'count': 1410 + i * 10,
      'x': 25 + i * 50,
      'vital': 1,
      'powerItem': i % 4 == 0 ? 1 : 0,
      'scoreItem': i % 4 == 2 ? 1 : 0,
      's': { 'bullet': 1, 'shotCount': [ 40 ] },
      'v': [
        { 'count':   0,  'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':    0 } },
        { 'count':  30,  'v': { 'r': 2,               'w':    0, 'ra': 0, 'wa': -0.01, 'trange': { 'min': -30 }, 'wrange': { 'min': -1 } } },
      ]
    }
  ) ;
}

for( var i = 0; i < 4 ; i++ ) {
  __stage1EnemiesParams.push(
    { 'count': 1420 + i * 20,
      'x': 430 - i * 50,
      'vital': 1,
      'powerItem': i % 4 == 0 ? 1 : 0,
      'scoreItem': i % 4 == 2 ? 1 : 0,
      's': { 'bullet': 1, 'shotCount': [ 40 ] },
      'v': [
        { 'count':   0,  'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
        { 'count':  30,  'v': { 'r': 2,               'w':    0, 'ra': 0, 'wa': 0.01, 'trange': { 'max': 210 }, 'wrange': { 'max': 1 } } },
      ]
    }
  ) ;
}

for( var i = 0; i < 4 ; i++ ) {
  __stage1EnemiesParams.push(
    { 'count': 1430 + i * 10,
      'x': 455 - i * 50,
      'vital': 1,
      'powerItem': i % 4 == 0 ? 1 : 0,
      'scoreItem': i % 4 == 2 ? 1 : 0,
      's': { 'bullet': 1, 'shotCount': [ 40 ] },
      'v': [
        { 'count':   0,  'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
        { 'count':  30,  'v': { 'r': 2,               'w':    0, 'ra': 0, 'wa': 0.01, 'trange': { 'max': 210 }, 'wrange': { 'max': 1 } } },
      ]
    }
  ) ;
}


for( var i = 0; i < 20 ; i++ ) {
  __stage1EnemiesParams.push(
    { 'count':1700 + parseInt( i/2 ) * 10,
      'x': ( i%2 == 0 ? 50 : 80 ) + i * 10,
      'vital': 1,
      'powerItem': i % 4 == 0 ? 1 : 0,
      'scoreItem': i % 4 == 2 ? 1 : 0,
      'v': [
        { 'count':   0,  'v': { 'r': 3,  'theta': 90, 'w':    0, 'ra': 0, 'wa':    0 } },
        { 'count':  30,  'v': { 'r': 3,               'w':    0, 'ra': 0, 'wa':-0.02, 'trange': { 'min': -45 }, 'wrange': { 'min': -1 } } },
        { 'count': 180,  'v': { 'r': 3,               'w':    0, 'ra': 0, 'wa': 0.02, 'trange': { 'max':  45 }, 'wrange': { 'max':  1 } } },
      ]
    }
  ) ;
}

for( var i = 0; i < 20 ; i++ ) {
  __stage1EnemiesParams.push(
    { 'count': 1900 + parseInt( i/2 ) * 10,
      'x': ( i%2 == 0 ? 430 : 400 ) - i * 10,
      'vital': 1,
      'powerItem': i % 4 == 0 ? 1 : 0,
      'scoreItem': i % 4 == 2 ? 1 : 0,
      'v': [
        { 'count':   0,  'v': { 'r': 3,  'theta': 90, 'w':    0, 'ra': 0, 'wa':    0 } },
        { 'count':  30,  'v': { 'r': 3,               'w':    0, 'ra': 0, 'wa': 0.02, 'trange': { 'max': 225 }, 'wrange': { 'max':  1 } } },
        { 'count': 180,  'v': { 'r': 3,               'w':    0, 'ra': 0, 'wa':-0.02, 'trange': { 'min': 135 }, 'wrange': { 'min': -1 } } },
      ]
    }
  ) ;
}

for( var i = 0; i < 8 ; i++ ) {
  __stage1EnemiesParams.push(
    { 'count': 2300 + i * ( 80 - i * 5 ),
      'x': 25 + (i%4) * 50,
      'vital': 3,
      'powerItem': i % 2 == 0 ? 1 : 0,
      'scoreItem': i % 2 == 1 ? 1 : 0,
      's': { 'bullet': 0, 'shotCount': [ 40+(i%2)*20 ] },
      'v': [
        { 'count':   0,      'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
        { 'count':  30+(i%2)*20, 'v': { 'r': 0,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
        { 'count': 130+(i%2)*20, 'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':   0.1, 'trange': { 'max': 190 } } },
      ]
    }
  ) ;
}

for( var i = 0; i < 8 ; i++ ) {
  __stage1EnemiesParams.push(
    { 'count': 2350 + i * ( 80 - i * 5 ),
      'x': 455 - (i%4) * 50,
      'vital': 3,
      'powerItem': i % 2 == 0 ? 1 : 0,
      'scoreItem': i % 2 == 1 ? 1 : 0,
      's': { 'bullet': 0, 'shotCount': [ 40+(i%2)*20 ] },
      'v': [
        { 'count':   0,      'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
        { 'count':  30+(i%2)*20, 'v': { 'r': 0,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
        { 'count': 130+(i%2)*20, 'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':  -0.1, 'trange': { 'min': -10 } } },
      ]
    }
  ) ;
}

for( var i = 0; i < 8 ; i++ ) {
  __stage1EnemiesParams.push(
    { 'count': 2500 + i * ( 80 - i * 5 ),
      'x': 25 + (i%4) * 50,
      'vital': 3,
      'powerItem': i % 2 == 0 ? 1 : 0,
      'scoreItem': i % 2 == 1 ? 1 : 0,
      's': { 'bullet': 0, 'shotCount': [ 40+(i%2)*20 ] },
      'v': [
        { 'count':   0,      'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
        { 'count':  30+(i%2)*20, 'v': { 'r': 0,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
        { 'count': 130+(i%2)*20, 'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':   0.1, 'trange': { 'max': 190 } } },
      ]
    }
  ) ;
}

for( var i = 0; i < 8 ; i++ ) {
  __stage1EnemiesParams.push(
    { 'count': 2550 + i * ( 80 - i * 5 ),
      'x': 455 - (i%4) * 50,
      'vital': 3,
      'powerItem': i % 2 == 0 ? 1 : 0,
      'scoreItem': i % 2 == 1 ? 1 : 0,
      's': { 'bullet': 0, 'shotCount': [ 40+(i%2)*20 ] },
      'v': [
        { 'count':   0,      'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
        { 'count':  30+(i%2)*20, 'v': { 'r': 0,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
        { 'count': 130+(i%2)*20, 'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':  -0.1, 'trange': { 'min': -10 } } },
      ]
    }
  ) ;
}

for( var i = 0; i < 8 ; i++ ) {
  __stage1EnemiesParams.push(
    { 'count': 2700 + i * ( 80 - i * 5 ),
      'x': 25 + (i%4) * 50,
      'vital': 3,
      'powerItem': i % 2 == 0 ? 1 : 0,
      'scoreItem': i % 2 == 1 ? 1 : 0,
      's': { 'bullet': 0, 'shotCount': [ 40+(i%2)*20 ] },
      'v': [
        { 'count':   0,      'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
        { 'count':  30+(i%2)*20, 'v': { 'r': 0,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
        { 'count': 130+(i%2)*20, 'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':   0.1, 'trange': { 'max': 190 } } },
      ]
    }
  ) ;
}

for( var i = 0; i < 8 ; i++ ) {
  __stage1EnemiesParams.push(
    { 'count': 2750 + i * ( 80 - i * 5 ),
      'x': 455 - (i%4) * 50,
      'vital': 3,
      'powerItem': i % 2 == 0 ? 1 : 0,
      'scoreItem': i % 2 == 1 ? 1 : 0,
      's': { 'bullet': 0, 'shotCount': [ 40+(i%2)*20 ] },
      'v': [
        { 'count':   0,      'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
        { 'count':  30+(i%2)*20, 'v': { 'r': 0,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
        { 'count': 130+(i%2)*20, 'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':  -0.1, 'trange': { 'min': -10 } } },
      ]
    }
  ) ;
}


var __stage2EnemiesParams = [ ] ;

for( var i = 0; i < 100 ; i++ ) {
  __stage2EnemiesParams.push(
    { 'count': 100 + i * 5,
      'x': parseInt(__randomizer.random() * 480),
      'vital': 1,
      'powerItem': i % 2 == 0 ? 1 : 0,
      'scoreItem': i % 2 == 1 ? 1 : 0,
      's': { 'bullet': 13, 'shotCount': [ 10 ] },
      'v': [
        { 'count':   0,  'v': { 'r': 3,  'theta': 90, 'w':    0, 'ra': 0, 'wa':    0 } },
      ]
    }
  ) ;
}

for( var i = 0; i < 6 ; i++ ) {
  __stage2EnemiesParams.push(
    { 'count': 500 + i * 15,
      'x': 50 + i * 20,
      'vital': 1,
      'powerItem': i % 2 == 0 ? 1 : 0,
      'scoreItem': i % 2 == 1 ? 1 : 0,
      'v': [
        { 'count':   0,  'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':    0 } },
        { 'count':  50,  'v': { 'r': 2,               'w':    0, 'ra': 0, 'wa': 0.01, 'trange': { 'max': 135 }, 'wrange': { 'max': 0.5 } } },
      ]
    }
  ) ;
}

for( var i = 0; i < 6 ; i++ ) {
  __stage2EnemiesParams.push(
    { 'count': 700 + i * 15,
      'x': 380 - i * 20,
      'vital': 1,
      'powerItem': i % 2 == 0 ? 1 : 0,
      'v': [
        { 'count':   0,  'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
        { 'count':  50,  'v': { 'r': 2,               'w':    0, 'ra': 0, 'wa': -0.01, 'trange': { 'min': 45 }, 'wrange': { 'min': -0.5 } } },
      ]
    }
  ) ;
}

for( var i = 0; i < 8 ; i++ ) {
  __stage2EnemiesParams.push(
    { 'count': 900 + i * ( 80 - i * 5 ),
      'x': 25 + (i%4) * 50,
      'vital': 3,
      'powerItem': i % 2 == 0 ? 1 : 0,
      's': { 'bullet': 0, 'shotCount': [ 40+(i%2)*20 ] },
      'v': [
        { 'count':   0,      'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
        { 'count':  30+(i%2)*20, 'v': { 'r': 0,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
        { 'count': 130+(i%2)*20, 'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':   0.1, 'trange': { 'max': 190 } } },
      ]
    }
  ) ;
}

for( var i = 0; i < 8 ; i++ ) {
  __stage2EnemiesParams.push(
    { 'count': 950 + i * ( 80 - i * 5 ),
      'x': 455 - (i%4) * 50,
      'vital': 3,
      'powerItem': i % 2 == 0 ? 1 : 0,
      's': { 'bullet': 0, 'shotCount': [ 40+(i%2)*20 ] },
      'v': [
        { 'count':   0,      'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
        { 'count':  30+(i%2)*20, 'v': { 'r': 0,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
        { 'count': 130+(i%2)*20, 'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':  -0.1, 'trange': { 'min': -10 } } },
      ]
    }
  ) ;
}

for( var i = 0; i < 4 ; i++ ) {
  __stage2EnemiesParams.push(
    { 'count': 1400 + i * 20,
      'x': 50 + i * 50,
      'vital': 1,
      'powerItem': i % 4 == 0 ? 1 : 0,
      'scoreItem': i % 4 == 2 ? 1 : 0,
      's': { 'bullet': 1, 'shotCount': [ 40 ] },
      'v': [
        { 'count':   0,  'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':    0 } },
        { 'count':  30,  'v': { 'r': 2,               'w':    0, 'ra': 0, 'wa': -0.01, 'trange': { 'min': -30 }, 'wrange': { 'min': -1 } } },
      ]
    }
  ) ;
}

for( var i = 0; i < 4 ; i++ ) {
  __stage2EnemiesParams.push(
    { 'count': 1410 + i * 10,
      'x': 25 + i * 50,
      'vital': 1,
      'powerItem': i % 4 == 0 ? 1 : 0,
      'scoreItem': i % 4 == 2 ? 1 : 0,
      's': { 'bullet': 1, 'shotCount': [ 40 ] },
      'v': [
        { 'count':   0,  'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':    0 } },
        { 'count':  30,  'v': { 'r': 2,               'w':    0, 'ra': 0, 'wa': -0.01, 'trange': { 'min': -30 }, 'wrange': { 'min': -1 } } },
      ]
    }
  ) ;
}

for( var i = 0; i < 4 ; i++ ) {
  __stage2EnemiesParams.push(
    { 'count': 1420 + i * 20,
      'x': 430 - i * 50,
      'vital': 1,
      'powerItem': i % 4 == 0 ? 1 : 0,
      'scoreItem': i % 4 == 2 ? 1 : 0,
      's': { 'bullet': 1, 'shotCount': [ 40 ] },
      'v': [
        { 'count':   0,  'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
        { 'count':  30,  'v': { 'r': 2,               'w':    0, 'ra': 0, 'wa': 0.01, 'trange': { 'max': 210 }, 'wrange': { 'max': 1 } } },
      ]
    }
  ) ;
}

for( var i = 0; i < 4 ; i++ ) {
  __stage2EnemiesParams.push(
    { 'count': 1430 + i * 10,
      'x': 455 - i * 50,
      'vital': 1,
      'powerItem': i % 4 == 0 ? 1 : 0,
      'scoreItem': i % 4 == 2 ? 1 : 0,
      's': { 'bullet': 1, 'shotCount': [ 40 ] },
      'v': [
        { 'count':   0,  'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
        { 'count':  30,  'v': { 'r': 2,               'w':    0, 'ra': 0, 'wa': 0.01, 'trange': { 'max': 210 }, 'wrange': { 'max': 1 } } },
      ]
    }
  ) ;
}


for( var i = 0; i < 20 ; i++ ) {
  __stage2EnemiesParams.push(
    { 'count':1700 + parseInt( i/2 ) * 10,
      'x': ( i%2 == 0 ? 50 : 80 ) + i * 10,
      'vital': 1,
      'powerItem': i % 4 == 0 ? 1 : 0,
      'scoreItem': i % 4 == 2 ? 1 : 0,
      'v': [
        { 'count':   0,  'v': { 'r': 3,  'theta': 90, 'w':    0, 'ra': 0, 'wa':    0 } },
        { 'count':  30,  'v': { 'r': 3,               'w':    0, 'ra': 0, 'wa':-0.02, 'trange': { 'min': -45 }, 'wrange': { 'min': -1 } } },
        { 'count': 180,  'v': { 'r': 3,               'w':    0, 'ra': 0, 'wa': 0.02, 'trange': { 'max':  45 }, 'wrange': { 'max':  1 } } },
      ]
    }
  ) ;
}

for( var i = 0; i < 20 ; i++ ) {
  __stage2EnemiesParams.push(
    { 'count': 1900 + parseInt( i/2 ) * 10,
      'x': ( i%2 == 0 ? 430 : 400 ) - i * 10,
      'vital': 1,
      'powerItem': i % 4 == 0 ? 1 : 0,
      'scoreItem': i % 4 == 2 ? 1 : 0,
      'v': [
        { 'count':   0,  'v': { 'r': 3,  'theta': 90, 'w':    0, 'ra': 0, 'wa':    0 } },
        { 'count':  30,  'v': { 'r': 3,               'w':    0, 'ra': 0, 'wa': 0.02, 'trange': { 'max': 225 }, 'wrange': { 'max':  1 } } },
        { 'count': 180,  'v': { 'r': 3,               'w':    0, 'ra': 0, 'wa':-0.02, 'trange': { 'min': 135 }, 'wrange': { 'min': -1 } } },
      ]
    }
  ) ;
}

for( var i = 0; i < 8 ; i++ ) {
  __stage2EnemiesParams.push(
    { 'count': 2300 + i * ( 80 - i * 5 ),
      'x': 25 + (i%4) * 50,
      'vital': 3,
      'powerItem': i % 2 == 0 ? 1 : 0,
      'scoreItem': i % 2 == 1 ? 1 : 0,
      's': { 'bullet': 0, 'shotCount': [ 40+(i%2)*20 ] },
      'v': [
        { 'count':   0,      'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
        { 'count':  30+(i%2)*20, 'v': { 'r': 0,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
        { 'count': 130+(i%2)*20, 'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':   0.1, 'trange': { 'max': 190 } } },
      ]
    }
  ) ;
}

for( var i = 0; i < 8 ; i++ ) {
  __stage2EnemiesParams.push(
    { 'count': 2350 + i * ( 80 - i * 5 ),
      'x': 455 - (i%4) * 50,
      'vital': 3,
      'powerItem': i % 2 == 0 ? 1 : 0,
      'scoreItem': i % 2 == 1 ? 1 : 0,
      's': { 'bullet': 0, 'shotCount': [ 40+(i%2)*20 ] },
      'v': [
        { 'count':   0,      'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
        { 'count':  30+(i%2)*20, 'v': { 'r': 0,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
        { 'count': 130+(i%2)*20, 'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':  -0.1, 'trange': { 'min': -10 } } },
      ]
    }
  ) ;
}

for( var i = 0; i < 8 ; i++ ) {
  __stage2EnemiesParams.push(
    { 'count': 2500 + i * ( 80 - i * 5 ),
      'x': 25 + (i%4) * 50,
      'vital': 3,
      'powerItem': i % 2 == 0 ? 1 : 0,
      'scoreItem': i % 2 == 1 ? 1 : 0,
      's': { 'bullet': 0, 'shotCount': [ 40+(i%2)*20 ] },
      'v': [
        { 'count':   0,      'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
        { 'count':  30+(i%2)*20, 'v': { 'r': 0,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
        { 'count': 130+(i%2)*20, 'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':   0.1, 'trange': { 'max': 190 } } },
      ]
    }
  ) ;
}

for( var i = 0; i < 8 ; i++ ) {
  __stage2EnemiesParams.push(
    { 'count': 2550 + i * ( 80 - i * 5 ),
      'x': 455 - (i%4) * 50,
      'vital': 3,
      'powerItem': i % 2 == 0 ? 1 : 0,
      'scoreItem': i % 2 == 1 ? 1 : 0,
      's': { 'bullet': 0, 'shotCount': [ 40+(i%2)*20 ] },
      'v': [
        { 'count':   0,      'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
        { 'count':  30+(i%2)*20, 'v': { 'r': 0,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
        { 'count': 130+(i%2)*20, 'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':  -0.1, 'trange': { 'min': -10 } } },
      ]
    }
  ) ;
}

for( var i = 0; i < 8 ; i++ ) {
  __stage2EnemiesParams.push(
    { 'count': 2700 + i * ( 80 - i * 5 ),
      'x': 25 + (i%4) * 50,
      'vital': 3,
      'powerItem': i % 2 == 0 ? 1 : 0,
      'scoreItem': i % 2 == 1 ? 1 : 0,
      's': { 'bullet': 0, 'shotCount': [ 40+(i%2)*20 ] },
      'v': [
        { 'count':   0,      'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
        { 'count':  30+(i%2)*20, 'v': { 'r': 0,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
        { 'count': 130+(i%2)*20, 'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':   0.1, 'trange': { 'max': 190 } } },
      ]
    }
  ) ;
}

for( var i = 0; i < 8 ; i++ ) {
  __stage2EnemiesParams.push(
    { 'count': 2750 + i * ( 80 - i * 5 ),
      'x': 455 - (i%4) * 50,
      'vital': 3,
      'powerItem': i % 2 == 0 ? 1 : 0,
      'scoreItem': i % 2 == 1 ? 1 : 0,
      's': { 'bullet': 0, 'shotCount': [ 40+(i%2)*20 ] },
      'v': [
        { 'count':   0,      'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
        { 'count':  30+(i%2)*20, 'v': { 'r': 0,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
        { 'count': 130+(i%2)*20, 'v': { 'r': 2,  'theta': 90, 'w':    0, 'ra': 0, 'wa':  -0.1, 'trange': { 'min': -10 } } },
      ]
    }
  ) ;
}


var __enemiesParams = [ ] ;
__enemiesParams.push( __stage1EnemiesParams ) ;
__enemiesParams.push( __stage2EnemiesParams ) ;

