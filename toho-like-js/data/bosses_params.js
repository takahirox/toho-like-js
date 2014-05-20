var __stage1BossParams = [ ] ;

__stage1BossParams.push(
  {
    'count': 2100,
    'character': 'rumia',
    'width': 128,
    'height': 128,
    'collisionWidth': 50,
    'collisionHeight': 50,
    'appearedTalk': false,
    'vanishedTalk': false,
    'dead': 'escape',
    'x': 240,
    'y': 0,
    'animation': 3,
    'powerItem': 1,
    'score': 1000,
    'params':
    [
      {
        'spellCard': false,
        'x': 400,
        'y': 150,
        'vital': 200,
        's': [
          { 'bullet': 2, 'type':  5, 'r': 20, 'shotCount': [  10,  20,  30, 280, 290, 300 ], 'baseCount': 600 },
          { 'bullet': 3, 'type':  2,          'shotCount': [ 120, 420 ],                     'baseCount': 600 },
          { 'bullet': 4, 'type':  7, 'r': 20, 'shotCount': [ 310, 320, 330 ],                'baseCount': 600 },
          { 'bullet':20, 'type':  6,          'shotCount': [ 130, 430 ],                     'baseCount': 600 },
        ],
        'v': [
          { 'count':   0, 'v': { 'r':  0, 'theta':180, 'w': 0, 'ra':    0, 'wa': 0, 'raa':  0, 'rrange': { min: 0 } } },
          { 'count':  50, 'v': { 'r':  4, 'theta':200, 'w': 0, 'ra':-0.05, 'wa': 0, 'raa':  0, 'rrange': { min: 0 } } },
          { 'count': 200, 'v': { 'r':  4, 'theta':160, 'w': 0, 'ra':-0.05, 'wa': 0, 'raa':  0, 'rrange': { min: 0 } } },
          { 'count': 350, 'v': { 'r':  4, 'theta':340, 'w': 0, 'ra':-0.05, 'wa': 0, 'raa':  0, 'rrange': { min: 0 } } },
          { 'count': 500, 'v': { 'r':  4, 'theta': 20, 'w': 0, 'ra':-0.05, 'wa': 0, 'raa':  0, 'rrange': { min: 0 } } },
          { 'count': 600, 'v': 2 }
        ],
      },
    ]
  }
) ;


__stage1BossParams.push(
  {
    'count': 3200,
//    'count': 0,
    'character': 'rumia',
    'width': 128,
    'height': 128,
    'collisionWidth': 50,
    'collisionHeight': 50,
    'appearedTalk': true,
    'vanishedTalk': true,
    'x': 240,
    'y': 0,
    'animation': 3,
    'powerItem': 1,
    'score': 5000,
    'params':
    [
      {
        'x': 240,
        'y': 150,
        'vital': 200,
        's': [
          { 'bullet': 2, 'type': 3, 'shotCount': [ 250, 260, 270, 280, 290 ],                'baseCount': 400 },
          { 'bullet': 3, 'type': 3, 'shotCount': [ 340, 360 ],                               'baseCount': 400 },
          { 'bullet': 4, 'type': 3, 'shotCount': [ 255, 265, 275, 285, 295 ],                'baseCount': 400 },
          { 'bullet': 5, 'type': 4, 'shotCount': [ 35, 37, 39, 41, 43, 45, 47, 49, 51, 53 ], 'baseCount': 400 },
          { 'bullet': 6, 'type': 4, 'shotCount': [ 37, 39, 41, 43, 45, 47, 49, 51, 53, 55 ], 'baseCount': 400 },
          { 'bullet': 7, 'type': 4, 'shotCount': [ 39, 41, 43, 45, 47, 49, 51, 53, 55, 57 ], 'baseCount': 400 },
          { 'bullet': 8, 'type': 1, 'shotCount': [ 135 ],                                    'baseCount': 400 },
        ],
        'v': [
          { 'count':   0,   'v': { 'r':  0, 'theta': 90, 'w': 0, 'ra':    0, 'wa': 0, 'raa':  0 } },
          { 'count':  30,   'v': { 'r':  3, 'theta':290, 'w': 0, 'ra':-0.05, 'wa': 0, 'raa':  0, 'rrange': { min: 0 } } },
          { 'count': 130,   'v': { 'r':  3, 'theta': 70, 'w': 0, 'ra':-0.05, 'wa': 0, 'raa':  0, 'rrange': { min: 0 } } },
          { 'count': 230,   'v': { 'r':  3, 'theta':250, 'w': 0, 'ra':-0.05, 'wa': 0, 'raa':  0, 'rrange': { min: 0 } } },
          { 'count': 330,   'v': { 'r':  3, 'theta':110, 'w': 0, 'ra':-0.05, 'wa': 0, 'raa':  0, 'rrange': { min: 0 } } },
          { 'count': 400,   'v': 2 }
        ]
      },
      {
        'spellCard': 'Rumia\'s Spell 1',
        'x': 240,
        'y': 100,
        'vital': 300,
        's': [
          { 'bullet': 9, 'type': 2, 'r': 20, 'shotCount': [ 50, 100, 150, 200 ], 'baseCount': 250 },
          { 'bullet':10, 'type': 4, 'r': 20, 'shotCount': [ 25,  75, 125, 170 ], 'baseCount': 250 },
          { 'bullet':11,                     'shotCount': [ 50 ],                'baseCount': 250 },
        ],
        'v': [
          { 'count':   0,   'v': { 'r':  0, 'theta': 90, 'w': 0, 'ra':   0, 'wa': 0, 'raa':  0, 'rrange': { min: 0 } } },
          { 'count': 250,   'v': { 'r':  3, 'theta': 80, 'w': 0, 'ra':-0.05, 'wa': 0, 'raa':  0, 'rrange': { min: 0 } } },
          { 'count': 500,   'v': { 'r':  3, 'theta':240, 'w': 0, 'ra':-0.05, 'wa': 0, 'raa':  0, 'rrange': { min: 0 } } },
          { 'count': 750,   'v': { 'r':  3, 'theta':110, 'w': 0, 'ra':-0.05, 'wa': 0, 'raa':  0, 'rrange': { min: 0 } } },
          { 'count':1000,   'v': { 'r':  3, 'theta':310 , 'w': 0, 'ra':-0.05, 'wa': 0, 'raa':  0, 'rrange': { min: 0 } } },
          { 'count':1250,   'v': 2 }
        ]
      },
      {
        'spellCard': 'Rumia\'s Spell 2',
        'x': 240,
        'y': 100,
        'vital': 300,
        's': [
          { 'bullet':12, 'type': 5, 'r': 20, 'shotCount': [ 0 ], 'baseCount': 1 },
          { 'bullet':12, 'type': 6, 'r': 20, 'shotCount': [ 0 ], 'baseCount': 1 },
        ],
        'v': [
          { 'count':   0,   'v': { 'r':  0, 'theta': 90, 'w': 0, 'ra':   0, 'wa': 0, 'raa':  0, 'rrange': { min: 0 } } },
        ]
      },
    ]
  }
) ;


var __stage2BossParams = [ ] ;

__stage2BossParams.push(
  {
    'count': 2100,
    'character': 'daiyousei',
    'width': 128,
    'height': 128,
    'collisionWidth': 50,
    'collisionHeight': 50,
    'appearedTalk': false,
    'vanishedTalk': false,
    'x': 240,
    'y': 0,
    'animation': 3,
    'powerItem': 1,
    'score': 1000,
    'params':
    [
      {
        'spellCard': false,
        'x': 240,
        'y': 150,
        'vital': 250,
        's': [
          { 'bullet': 14, 'type': 8, 'shotCount': [  10,  20,  30,  40 ], 'baseCount': 300 },
          { 'bullet': 15, 'type': 9, 'shotCount': [ 160, 170, 180, 190 ], 'baseCount': 300 },
        ],
        'v': [
          { 'count':   0, 'v': { 'r':  0, 'theta': 90 } },
          { 'count': 149, 'v': { 'target': { 'x': { 'min':  50, 'max': 240 }, 'y': { 'min':100, 'max': 200 }, 'count': 1 } } },
          { 'count': 150, 'v': { 'r':  0, 'theta': 90 } },
          { 'count': 299, 'v': { 'target': { 'x': { 'min': 240, 'max': 430 }, 'y': { 'min':100, 'max': 200 }, 'count': 1 } } },
          { 'count': 300, 'v': { 'r':  0, 'theta': 90 } },
          { 'count': 449, 'v': { 'target': { 'x': { 'min': 190, 'max': 290 }, 'y': { 'min': 50, 'max': 150 }, 'count': 1 } } },
          { 'count': 450, 'v': 2 }
        ],
        'e': {
          'vanish': { 'count': 100, 'length': 50, 'baseCount': 150 }
        }
      },
    ]
  }
) ;


__stage2BossParams.push(
  {
    'count': 3200,
//    'count': 0,
    'character': 'chilno',
    'width': 128,
    'height': 128,
    'collisionWidth': 50,
    'collisionHeight': 50,
    'appearedTalk': true,
    'vanishedTalk': true,
    'x': 240,
    'y': 0,
    'animation': 3,
    'powerItem': 1,
    'score': 5000,
    'params':
    [
      {
        'spellCard': 'The star of Chilno',
        'x': 240,
        'y': 150,
        'vital': 300,
        's': [
          { 'bullet':16, 'type': 4, 'shotCount': [ 20 ], 'baseCount': 100 },
        ],
        'v': [
          { 'count':   0,   'v': { 'r':  0, 'theta': 90, 'w': 0, 'ra':    0, 'wa': 0, 'raa':  0 } },
        ]
      },
      {
        'spellCard': 'Something freeze',
        'x': 240,
        'y': 100,
        'vital': 300,
        's': [
          { 'bullet': 18, 'type': 2, 'r': 20, 'shotCount': [ 0 ],                                 'baseCount': 500 },
          { 'bullet': 19, 'type': 3, 'r': 20, 'shotCount': [ 350, 355, 360, 365, 370, 375, 380 ], 'baseCount': 500 },
        ],
        'v': [ 
          { 'count':   0, 'v': { 'r':   0,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
          { 'count':  10,   'v': { 'target': { 'x': { 'min': 100, 'max': 340 }, 'y': { 'min': 80, 'max': 120 }, 'count':100 } } },
          { 'count': 110, 'v': { 'r':   0,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
          { 'count': 335,   'v': { 'target': { 'x': { 'min': 200, 'max': 280 }, 'y': { 'min': 80, 'max': 120 }, 'count': 35 } } },
          { 'count': 370, 'v': { 'r':   0,  'theta': 90, 'w':    0, 'ra': 0, 'wa':     0 } },
          { 'count': 500, 'v': 2 }
        ],
        'e': {
          'shockwave': [
            { 'count': 175, 'baseCount': 500, 'params': { 'w': 10, 'g': 5, 'b': 7, 'a': 0.5, 'endCount': 100 } },
            { 'count': 375, 'baseCount': 500, 'params': { 'w': 10, 'g': 5, 'b': 7, 'a': 0.5, 'endCount': 100 } }
          ]
        }
      },
      {
        'spellCard': 'Falling icicle',
        'x': 240,
        'y': 100,
        'vital': 300,
        's': [
          { 'bullet':17, 'type': 7, 'r': 20, 'shotCount': [ 0 ], 'baseCount': 1 },
        ],
        'v': [
          { 'count':   0,   'v': { 'r':  0, 'theta': 90, 'w': 0, 'ra':   0, 'wa': 0, 'raa':  0, 'rrange': { min: 0 } } },
          { 'count':  50,   'v': { 'target': { 'x': { 'min': 190, 'max': 290 }, 'y': { 'min': 80, 'max': 120 }, 'count': 100 } } },
          { 'count': 150,   'v': 2 },
        ]
      },
    ]
  }
) ;


var __bossesParams = [ ] ;
__bossesParams.push( __stage1BossParams ) ;
__bossesParams.push( __stage2BossParams ) ;


