var __danmakuHelper = new DanmakuHelper( ) ;

var __bulletTypes = [
  {
    'image':            0,
    'indexX':           3,
    'indexY':           4,
    'width':           16,
    'height':          32,
    'collisionWidth':  16,
    'collisionHeight': 32,
    'rotate':          true
  },
  {
    'image':            0,
    'indexX':           3,
    'indexY':           3,
    'width':           16,
    'height':          32,
    'collisionWidth':  16,
    'collisionHeight': 32,
    'rotate':          true
  },
  {
    'image':            0,
    'indexX':           1,
    'indexY':          15,
    'width':           16,
    'height':          16,
    'collisionWidth':  16,
    'collisionHeight': 16,
    'rotate':          true
  },
  {
    'image':            0,
    'indexX':           5,
    'indexY':           0,
    'width':           16,
//    'height':          32,
    'height':          256,
    'collisionWidth':  16,
    'collisionHeight': 32,
    'rotate':          true
  },
] ;


var __bulletsParams = [
  [
    [
      [
        {
          'power': 1,
          'x':   0,
          'y': -20,
          'v': { 'r':12, 'theta': 270, 'w': 0, 'ra': 0, 'wa': 0 },
        },
      ],
      [
        {
          'power': 0.6,
          'x':  -1,
          'y': -20,
          'v': { 'r':12, 'theta': 266, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 0.6,
          'x':   1,
          'y': -20,
          'v': { 'r':12, 'theta': 274, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 0.50,
          'option': 0,
          'homing': true,
          'nextCount': 50,
          'v': { 'r':12, 'theta':210, 'w': 0, 'ra': 0.01, 'wa': 0, 'rrange': { 'max': 10 } },
        },
        {
          'power': 0.50,
          'option': 1,
          'homing': true,
          'nextCount': 50,
          'v': { 'r':12, 'theta':330, 'w': 0, 'ra': 0.01, 'wa': 0, 'rrange': { 'max': 10 } },
        },
      ],
      [
        {
          'power': 0.46,
          'x':  -1,
          'y': -20,
          'v': { 'r':12, 'theta': 262, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 0.46,
          'x':   0,
          'y': -20,
          'v': { 'r':12, 'theta': 270, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 0.46,
          'x':   1,
          'y': -20,
          'v': { 'r':12, 'theta': 278, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 0.40,
          'option': 0,
          'homing': true,
          'nextCount': 20,
          'v': { 'r':12, 'theta':210, 'w': 0, 'ra': 0.01, 'wa': 0, 'rrange': { 'max': 10 } },
        },
        {
          'power': 0.40,
          'option': 1,
          'homing': true,
          'nextCount': 20,
          'v': { 'r':12, 'theta':330, 'w': 0, 'ra': 0.01, 'wa': 0, 'rrange': { 'max': 10 } },
        },
      ],
      [
        {
          'power': 0.4,
          'x':  -3,
          'y': -20,
          'v': { 'r':12, 'theta': 258, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 0.4,
          'x':  -1,
          'y': -20,
          'v': { 'r':12, 'theta': 266, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 0.4,
          'x':   1,
          'y': -20,
          'v': { 'r':12, 'theta': 274, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 0.4,
          'x':   3,
          'y': -20,
          'v': { 'r':12, 'theta': 282, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 0.30,
          'option': 0,
          'homing': true,
          'nextCount': 10,
          'v': { 'r':12, 'theta':210, 'w': 0, 'ra': 0.01, 'wa': 0, 'rrange': { 'max': 10 } },
        },
        {
          'power': 0.30,
          'option': 1,
          'homing': true,
          'nextCount': 10,
          'v': { 'r':12, 'theta':330, 'w': 0, 'ra': 0.01, 'wa': 0, 'rrange': { 'max': 10 } },
        },
      ],
    ],
    [
      [
        {
          'power': 1,
          'x':   0,
          'y': -20,
          'v': { 'r':12, 'theta': 270, 'w': 0, 'ra': 0, 'wa': 0 },
        },
      ],
      [
        {
          'power': 0.6,
          'x':  -1,
          'y': -20,
          'v': { 'r':12, 'theta': 269, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 0.6,
          'x':   1,
          'y': -20,
          'v': { 'r':12, 'theta': 271, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 0.5,
          'option': 0,
          'homing': true,
          'nextCount': 50,
          'v': { 'r':12, 'theta':260, 'w': 0, 'ra': 0.01, 'wa': 0, 'rrange': { 'max': 10 } },
        },
        {
          'power': 0.5,
          'option': 1,
          'homing': true,
          'nextCount': 50,
          'v': { 'r':12, 'theta':280, 'w': 0, 'ra': 0.01, 'wa': 0, 'rrange': { 'max': 10 } },
        },
      ],
      [
        {
          'power': 0.46,
          'x':  -1,
          'y': -20,
          'v': { 'r':12, 'theta': 268, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 0.46,
          'x':   0,
          'y': -20,
          'v': { 'r':12, 'theta': 270, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 0.46,
          'x':   1,
          'y': -20,
          'v': { 'r':12, 'theta': 272, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 0.4,
          'option': 0,
          'homing': true,
          'nextCount': 20,
          'v': { 'r':12, 'theta':260, 'w': 0, 'ra': 0.01, 'wa': 0, 'rrange': { 'max': 10 } },
        },
        {
          'power': 0.4,
          'option': 1,
          'homing': true,
          'nextCount': 20,
          'v': { 'r':12, 'theta':280, 'w': 0, 'ra': 0.01, 'wa': 0, 'rrange': { 'max': 10 } },
        },
      ],
      [
        {
          'power': 0.4,
          'x':  -3,
          'y': -20,
          'v': { 'r':12, 'theta': 267, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 0.4,
          'x':  -1,
          'y': -20,
          'v': { 'r':12, 'theta': 269, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 0.4,
          'x':   1,
          'y': -20,
          'v': { 'r':12, 'theta': 271, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 0.4,
          'x':   3,
          'y': -20,
          'v': { 'r':12, 'theta': 273, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 0.3,
          'option': 0,
          'homing': true,
          'nextCount': 10,
          'v': { 'r':12, 'theta':260, 'w': 0, 'ra': 0.01, 'wa': 0, 'rrange': { 'max': 10 } },
        },
        {
          'power': 0.3,
          'option': 1,
          'homing': true,
          'nextCount': 10,
          'v': { 'r':12, 'theta':280, 'w': 0, 'ra': 0.01, 'wa': 0, 'rrange': { 'max': 10 } },
        },
      ]
    ]
  ],
  [
    [
      [
        {
          'power': 1,
          'x':   0,
          'y': -20,
          'v': { 'r':12, 'theta': 270, 'w': 0, 'ra': 0, 'wa': 0 },
        },
      ],
      [
        {
          'power': 0.6,
          'x':  -1,
          'y': -20,
          'v': { 'r':12, 'theta': 266, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 0.6,
          'x':   1,
          'y': -20,
          'v': { 'r':12, 'theta': 274, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 1,
          'laser': true,
          'option': 0,
          'keep': 80,
          'waitCount': 50,
          'nextCount': 220,
          'v': { 'r': 0, 'theta': 270, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 1,
          'laser': true,
          'option': 1,
          'keep': 80,
          'waitCount': 50,
          'nextCount': 220,
          'v': { 'r': 0, 'theta': 270, 'w': 0, 'ra': 0, 'wa': 0 },
        },
      ],
      [
        {
          'power': 0.46,
          'x':  -1,
          'y': -20,
          'v': { 'r':12, 'theta': 262, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 0.46,
          'x':   0,
          'y': -20,
          'v': { 'r':12, 'theta': 270, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 0.46,
          'x':   1,
          'y': -20,
          'v': { 'r':12, 'theta': 278, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 1,
          'option': 0,
          'laser': true,
          'keep': 80,
          'waitCount': 40,
          'nextCount': 210,
          'v': { 'r': 0, 'theta': 270, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 1,
          'option': 1,
          'laser': true,
          'keep': 80,
          'waitCount': 40,
          'nextCount': 210,
          'v': { 'r': 0, 'theta': 270, 'w': 0, 'ra': 0, 'wa': 0 },
        },
      ],
      [
        {
          'power': 0.4,
          'x':  -3,
          'y': -20,
          'v': { 'r':12, 'theta': 258, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 0.4,
          'x':  -1,
          'y': -20,
          'v': { 'r':12, 'theta': 266, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 0.4,
          'x':   1,
          'y': -20,
          'v': { 'r':12, 'theta': 274, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 0.4,
          'x':   3,
          'y': -20,
          'v': { 'r':12, 'theta': 282, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 1,
          'option': 0,
          'laser': true,
          'keep': 80,
          'waitCount': 30,
          'nextCount': 200,
          'v': { 'r': 0, 'theta': 270, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 1,
          'option': 1,
          'laser': true,
          'keep': 80,
          'waitCount': 30,
          'nextCount': 200,
          'v': { 'r': 0, 'theta': 270, 'w': 0, 'ra': 0, 'wa': 0 },
        },
      ],
    ],
    [
      [
        {
          'power': 1,
          'x':   0,
          'y': -20,
          'v': { 'r':12, 'theta': 270, 'w': 0, 'ra': 0, 'wa': 0 },
        },
      ],
      [
        {
          'power': 0.6,
          'x':  -1,
          'y': -20,
          'v': { 'r':12, 'theta': 269, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 0.6,
          'x':   1,
          'y': -20,
          'v': { 'r':12, 'theta': 271, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 1,
          'option': 0,
          'laser': true,
          'keep': 80,
          'waitCount': 50,
          'nextCount': 120,
          'v': { 'r': 0, 'theta': 270, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 1,
          'option': 1,
          'laser': true,
          'keep': 80,
          'waitCount': 50,
          'nextCount': 120,
          'v': { 'r': 0, 'theta': 270, 'w': 0, 'ra': 0, 'wa': 0 },
        },
      ],
      [
        {
          'power': 0.46,
          'x':  -1,
          'y': -20,
          'v': { 'r':12, 'theta': 268, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 0.46,
          'x':   0,
          'y': -20,
          'v': { 'r':12, 'theta': 270, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 0.46,
          'x':   1,
          'y': -20,
          'v': { 'r':12, 'theta': 272, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 1,
          'option': 0,
          'laser': true,
          'keep': 80,
          'waitCount': 40,
          'nextCount': 110,
          'v': { 'r': 0, 'theta': 270, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 1,
          'option': 1,
          'laser': true,
          'keep': 80,
          'waitCount': 40,
          'nextCount': 110,
          'v': { 'r': 0, 'theta': 270, 'w': 0, 'ra': 0, 'wa': 0 },
        },
      ],
      [
        {
          'power': 0.4,
          'x':  -3,
          'y': -20,
          'v': { 'r':12, 'theta': 267, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 0.4,
          'x':  -1,
          'y': -20,
          'v': { 'r':12, 'theta': 269, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 0.4,
          'x':   1,
          'y': -20,
          'v': { 'r':12, 'theta': 271, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 0.4,
          'x':   3,
          'y': -20,
          'v': { 'r':12, 'theta': 273, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 1,
          'option': 0,
          'laser': true,
          'keep': 80,
          'waitCount': 30,
          'nextCount': 100,
          'v': { 'r': 0, 'theta': 270, 'w': 0, 'ra': 0, 'wa': 0 },
        },
        {
          'power': 1,
          'option': 1,
          'laser': true,
          'keep': 80,
          'waitCount': 30,
          'nextCount': 100,
          'v': { 'r': 0, 'theta': 270, 'w': 0, 'ra': 0, 'wa': 0 },
        },
      ]
    ],
  ]
] ;


var __enemyBulletsParams = [
  [
    {
      'v': { 'r': 5, 'theta': 165, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 2 } },
    },
    {
      'v': { 'r': 5, 'theta': 135, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 2 } },
    },
    {
      'v': { 'r': 5, 'theta': 105, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 2 } },
    },
    {
      'v': { 'r': 5, 'theta':  75, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 2 } },
    },
    {
      'v': { 'r': 5, 'theta':  45, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 2 } },
    },
    {
      'v': { 'r': 5, 'theta':  15, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 2 } },
    },
  ],
  [
    {
      'v': { 'aimed': true, 'r': 5, 'theta':  0, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 3 } },
    },
  ],
  [
    {
      'v': { 'r': 5, 'theta':   0, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 2 } },
    },
    {
      'v': { 'r': 5, 'theta':  23, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 2 } },
    },
    {
      'v': { 'r': 5, 'theta':  45, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 2 } },
    },
    {
      'v': { 'r': 5, 'theta':  68, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 2 } },
    },
    {
      'v': { 'r': 5, 'theta':  90, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 2 } },
    },
    {
      'v': { 'r': 5, 'theta': 113, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 2 } },
    },
    {
      'v': { 'r': 5, 'theta': 135, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 2 } },
    },
    {
      'v': { 'r': 5, 'theta': 158, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 2 } },
    },
    {
      'v': { 'r': 5, 'theta': 180, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 2 } },
    },
    {
      'v': { 'r': 5, 'theta': 203, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 2 } },
    },
    {
      'v': { 'r': 5, 'theta': 225, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 2 } },
    },
    {
      'v': { 'r': 5, 'theta': 248, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 2 } },
    },
    {
      'v': { 'r': 5, 'theta': 270, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 2 } },
    },
    {
      'v': { 'r': 5, 'theta': 293, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 2 } },
    },
    {
      'v': { 'r': 5, 'theta': 315, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 2 } },
    },
    {
      'v': { 'r': 5, 'theta': 338, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 2 } },
    },
  ],
  // TODO: simplify
  [
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':   0, 'w': 0, 'ra':  0, 'wa': 0 } },
        { 'count':  5, 'v': { 'r': 0,               'w': 0, 'ra':0.1, 'wa': 0, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':   5, 'w': 0, 'ra':  0, 'wa': 0 } },
        { 'count': 10, 'v': { 'r': 0,               'w': 0, 'ra':0.1, 'wa': 0, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':  10, 'w': 0, 'ra':  0, 'wa': 0 } },
        { 'count': 15, 'v': { 'r': 0,               'w': 0, 'ra':0.1, 'wa': 0, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':  15, 'w': 0, 'ra':  0, 'wa': 0 } },
        { 'count': 20, 'v': { 'r': 0,               'w': 0, 'ra':0.1, 'wa': 0, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':  20, 'w': 0, 'ra':  0, 'wa': 0 } },
        { 'count': 25, 'v': { 'r': 0,               'w': 0, 'ra':0.1, 'wa': 0, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':  45, 'w': 0, 'ra':  0, 'wa': 0 } },
        { 'count':  5, 'v': { 'r': 0,               'w': 0, 'ra':0.1, 'wa': 0, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':  50, 'w': 0, 'ra':  0, 'wa': 0 } },
        { 'count': 10, 'v': { 'r': 0,               'w': 0, 'ra':0.1, 'wa': 0, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':  55, 'w': 0, 'ra':  0, 'wa': 0 } },
        { 'count': 15, 'v': { 'r': 0,               'w': 0, 'ra':0.1, 'wa': 0, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':  60, 'w': 0, 'ra':  0, 'wa': 0 } },
        { 'count': 20, 'v': { 'r': 0,               'w': 0, 'ra':0.1, 'wa': 0, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':  65, 'w': 0, 'ra':  0, 'wa': 0 } },
        { 'count': 25, 'v': { 'r': 0,               'w': 0, 'ra':0.1, 'wa': 0, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':  90, 'w': 0, 'ra':  0, 'wa': 0 } },
        { 'count':  5, 'v': { 'r': 0,               'w': 0, 'ra':0.1, 'wa': 0, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':  95, 'w': 0, 'ra':  0, 'wa': 0 } },
        { 'count': 10, 'v': { 'r': 0,               'w': 0, 'ra':0.1, 'wa': 0, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 100, 'w': 0, 'ra':  0, 'wa': 0 } },
        { 'count': 15, 'v': { 'r': 0,               'w': 0, 'ra':0.1, 'wa': 0, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 105, 'w': 0, 'ra':  0, 'wa': 0 } },
        { 'count': 20, 'v': { 'r': 0,               'w': 0, 'ra':0.1, 'wa': 0, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 110, 'w': 0, 'ra':  0, 'wa': 0 } },
        { 'count': 25, 'v': { 'r': 0,               'w': 0, 'ra':0.1, 'wa': 0, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 135, 'w': 0, 'ra':  0, 'wa': 0 } },
        { 'count':  5, 'v': { 'r': 0,               'w': 0, 'ra':0.1, 'wa': 0, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 140, 'w': 0, 'ra':  0, 'wa': 0 } },
        { 'count': 10, 'v': { 'r': 0,               'w': 0, 'ra':0.1, 'wa': 0, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 145, 'w': 0, 'ra':  0, 'wa': 0 } },
        { 'count': 15, 'v': { 'r': 0,               'w': 0, 'ra':0.1, 'wa': 0, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 150, 'w': 0, 'ra':  0, 'wa': 0 } },
        { 'count': 20, 'v': { 'r': 0,               'w': 0, 'ra':0.1, 'wa': 0, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 155, 'w': 0, 'ra':  0, 'wa': 0 } },
        { 'count': 25, 'v': { 'r': 0,               'w': 0, 'ra':0.1, 'wa': 0, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 180, 'w': 0, 'ra':  0, 'wa': 0 } },
        { 'count':  5, 'v': { 'r': 0,               'w': 0, 'ra':0.1, 'wa': 0, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 185, 'w': 0, 'ra':  0, 'wa': 0 } },
        { 'count': 10, 'v': { 'r': 0,               'w': 0, 'ra':0.1, 'wa': 0, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 190, 'w': 0, 'ra':  0, 'wa': 0 } },
        { 'count': 15, 'v': { 'r': 0,               'w': 0, 'ra':0.1, 'wa': 0, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 195, 'w': 0, 'ra':  0, 'wa': 0 } },
        { 'count': 20, 'v': { 'r': 0,               'w': 0, 'ra':0.1, 'wa': 0, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 200, 'w': 0, 'ra':  0, 'wa': 0 } },
        { 'count': 25, 'v': { 'r': 0,               'w': 0, 'ra':0.1, 'wa': 0, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 225, 'w': 0, 'ra':  0, 'wa': 0 } },
        { 'count':  5, 'v': { 'r': 0,               'w': 0, 'ra':0.1, 'wa': 0, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 230, 'w': 0, 'ra':  0, 'wa': 0 } },
        { 'count': 10, 'v': { 'r': 0,               'w': 0, 'ra':0.1, 'wa': 0, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 235, 'w': 0, 'ra':  0, 'wa': 0 } },
        { 'count': 15, 'v': { 'r': 0,               'w': 0, 'ra':0.1, 'wa': 0, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 240, 'w': 0, 'ra':  0, 'wa': 0 } },
        { 'count': 20, 'v': { 'r': 0,               'w': 0, 'ra':0.1, 'wa': 0, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 245, 'w': 0, 'ra':  0, 'wa': 0 } },
        { 'count': 25, 'v': { 'r': 0,               'w': 0, 'ra':0.1, 'wa': 0, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 270, 'w': 0, 'ra':  0, 'wa': 0 } },
        { 'count':  5, 'v': { 'r': 0,               'w': 0, 'ra':0.1, 'wa': 0, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 275, 'w': 0, 'ra':  0, 'wa': 0 } },
        { 'count': 10, 'v': { 'r': 0,               'w': 0, 'ra':0.1, 'wa': 0, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 280, 'w': 0, 'ra':  0, 'wa': 0 } },
        { 'count': 15, 'v': { 'r': 0,               'w': 0, 'ra':0.1, 'wa': 0, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 285, 'w': 0, 'ra':  0, 'wa': 0 } },
        { 'count': 20, 'v': { 'r': 0,               'w': 0, 'ra':0.1, 'wa': 0, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 290, 'w': 0, 'ra':  0, 'wa': 0 } },
        { 'count': 25, 'v': { 'r': 0,               'w': 0, 'ra':0.1, 'wa': 0, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 315, 'w': 0, 'ra':  0, 'wa': 0 } },
        { 'count':  5, 'v': { 'r': 0,               'w': 0, 'ra':0.1, 'wa': 0, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 320, 'w': 0, 'ra':  0, 'wa': 0 } },
        { 'count': 10, 'v': { 'r': 0,               'w': 0, 'ra':0.1, 'wa': 0, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 325, 'w': 0, 'ra':  0, 'wa': 0 } },
        { 'count': 15, 'v': { 'r': 0,               'w': 0, 'ra':0.1, 'wa': 0, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 330, 'w': 0, 'ra':  0, 'wa': 0 } },
        { 'count': 20, 'v': { 'r': 0,               'w': 0, 'ra':0.1, 'wa': 0, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 335, 'w': 0, 'ra':  0, 'wa': 0 } },
        { 'count': 25, 'v': { 'r': 0,               'w': 0, 'ra':0.1, 'wa': 0, 'rrange': { 'max': 3 } } },
      ]
    },
  ],
  [
    {
      'v': { 'r': 5, 'theta':  12, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 2 } },
    },
    {
      'v': { 'r': 5, 'theta':  35, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 2 } },
    },
    {
      'v': { 'r': 5, 'theta':  57, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 2 } },
    },
    {
      'v': { 'r': 5, 'theta':  80, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 2 } },
    },
    {
      'v': { 'r': 5, 'theta': 102, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 2 } },
    },
    {
      'v': { 'r': 5, 'theta': 125, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 2 } },
    },
    {
      'v': { 'r': 5, 'theta': 147, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 2 } },
    },
    {
      'v': { 'r': 5, 'theta': 170, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 2 } },
    },
    {
      'v': { 'r': 5, 'theta': 192, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 2 } },
    },
    {
      'v': { 'r': 5, 'theta': 215, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 2 } },
    },
    {
      'v': { 'r': 5, 'theta': 237, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 2 } },
    },
    {
      'v': { 'r': 5, 'theta': 260, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 2 } },
    },
    {
      'v': { 'r': 5, 'theta': 282, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 2 } },
    },
    {
      'v': { 'r': 5, 'theta': 305, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 2 } },
    },
    {
      'v': { 'r': 5, 'theta': 327, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 2 } },
    },
    {
      'v': { 'r': 5, 'theta': 350, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 2 } },
    },
  ],
  [
    {
      'v': { 'aimed': true, 'r': 5, 'theta':-10, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 3 } },
    },
  ],
  [
    {
      'v': { 'aimed': true, 'r': 5, 'theta':  0, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 3 } },
    },
  ],
  [
    {
      'v': { 'aimed': true, 'r': 5, 'theta': 10, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': -0.01, 'rrange': { 'min': 3 } },
    },
  ],
  [
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':  30, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':  35, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 3.1 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':  40, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 3.2 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':  45, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 3.3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':  50, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 3.4 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':  55, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 3.5 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':  60, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 3.6 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':  65, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 3.7 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':  70, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 3.8 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':  75, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 3.9 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':  80, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 4.0 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':  85, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 4.1 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':  90, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 4.2 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':  95, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 4.3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 100, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 4.4 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 105, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 4.5 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 110, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 4.6 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 115, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 4.7 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 120, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 4.8 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 125, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 4.9 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 130, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 5.0 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 135, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 5.1 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 140, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 5.2 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 145, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 5.3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 150, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 5.4 } } },
      ]
    },
  ],
  [
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':   0, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':  10, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 3.2 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':  20, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 3.4 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':  30, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 3.6 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':  40, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 3.8 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':  50, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 4.0 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':  60, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 4.2 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':  70, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 4.4 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':  80, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 4.6 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':  90, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 4.8 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 100, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 5.0 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 110, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 5.2 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 120, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 5.4 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 130, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 5.6 } } },
      ]
    },
  ],
  [
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 175, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 3.1 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 165, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 3.3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 155, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 3.5 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 145, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 3.7 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 135, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 3.9 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 125, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 4.1 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 115, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 4.3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta': 105, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 4.5 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':  95, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 4.7 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':  85, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 4.9 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':  75, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 5.1 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':  65, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 5.3 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':  55, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 5.5 } } },
      ]
    },
    {
      'v': [
        { 'count':  0, 'v': { 'r': 0, 'theta':  45, 'w': 0, 'ra': 0.1, 'wa': 0, 'raa': 0.01, 'rrange': { 'max': 5.7 } } },
      ]
    },
  ],
  [
    {
      'laser': true,
      'waitCount': 40,
      'keep': 150,
      'v': { 'r': 0, 'theta': 180, 'w': -0.01, 'ra':0, 'wa': -0.01, 'trange': { 'min': 110 } },
    },
    {
      'laser': true,
      'waitCount': 40,
      'keep': 150,
      'v': { 'r': 0, 'theta':   0, 'w':  0.01, 'ra':0, 'wa':  0.01, 'trange': { 'max':  70 } },
    },
  ],
  [
    {
      'v': { 'r': 5, 'theta':   0, 'w': 0, 'ra': 0, 'wa': 0, 'rrandom': { 'min': 4, 'max': 5 }, 'trandom': { 'min': 0, 'max': 360 } },
    },
  ],
  [
    {
      'v': { 'r': 3, 'theta':  45, 'w': 0, 'ra': 0, 'wa': 0, 'raa': 0 },
    },
    {
      'v': { 'r': 3, 'theta': 135, 'w': 0, 'ra': 0, 'wa': 0, 'raa': 0 },
    },
    {
      'v': { 'r': 3, 'theta': 225, 'w': 0, 'ra': 0, 'wa': 0, 'raa': 0 },
    },
    {
      'v': { 'r': 3, 'theta': 315, 'w': 0, 'ra': 0, 'wa': 0, 'raa': 0 },
    },
  ],
  __danmakuHelper.daiYousei1( ),
  __danmakuHelper.daiYousei2( ),
  __danmakuHelper.chilno1( ),
  [
    {
      'v': { 'r': 2, 'theta':   0, 'w': 0, 'ra': 0, 'wa': 0, 'rrandom': { 'min': 2, 'max': 3 }, 'trandom': { 'min': 0, 'max': 360 },
             'g': { 'r': 0, 'theta': 90, 'ra': 0.05 }
           },
    },
  ],
  __danmakuHelper.chilno2( ),
  [
    {
      'v': { 'aimed': true, 'r': 5, 'theta':-15, 'w': 0 },
    },
    {
      'v': { 'aimed': true, 'r': 5, 'theta': -5, 'w': 0 },
    },
    {
      'v': { 'aimed': true, 'r': 5, 'theta':  5, 'w': 0 },
    },
    {
      'v': { 'aimed': true, 'r': 5, 'theta': 15, 'w': 0 },
    },
  ],
  [
    {
      'beam': true,
      'v': { 'rrandom': { 'min': 4, 'max': 6 }, 'trandom': { 'min': 180, 'max': 200 },
             'g': { 'r': 0, 'theta': 90, 'ra': 0.3 }
           },
    },
    {
      'beam': true,
      'v': { 'rrandom': { 'min': 4, 'max': 6 }, 'trandom': { 'min': 225, 'max': 245 },
             'g': { 'r': 0, 'theta': 90, 'ra': 0.3 }
           },
    },
    {
      'beam': true,
      'v': { 'rrandom': { 'min': 4, 'max': 6 }, 'trandom': { 'min': 270, 'max': 290 },
             'g': { 'r': 0, 'theta': 90, 'ra': 0.3 }
           },
    },
    {
      'beam': true,
      'v': { 'rrandom': { 'min': 4, 'max': 6 }, 'trandom': { 'min': 340, 'max': 360 },
             'g': { 'r': 0, 'theta': 90, 'ra': 0.3 }
           },
    },
  ],
] ;


var __enemyBulletTypes = [
  {
    'indexX':          15,
    'indexY':           3,
    'width':           16,
    'height':          16,
    'collisionWidth':  10,
    'collisionHeight': 10
  },
  {
    'indexX':           2,
    'indexY':           3,
    'width':           16,
    'height':          16,
    'collisionWidth':  10,
    'collisionHeight': 10
  },
  {
    'indexX':           8,
    'indexY':           3,
    'width':           16,
    'height':          16,
    'collisionWidth':  10,
    'collisionHeight': 10
  },
  {
    'indexX':           6,
    'indexY':           3,
    'width':           16,
    'height':          16,
    'collisionWidth':  10,
    'collisionHeight': 10
  },
  {
    'indexX':           7,
    'indexY':           3,
    'width':           16,
    'height':          16,
    'collisionWidth':  10,
    'collisionHeight': 10
  },
  {
    'indexX':          13,
    'indexY':           4,
    'width':           16,
    'height':          16,
    'collisionWidth':   5,
    'collisionHeight':  5,
    'rotate':        true,
  },
  {
    'indexX':          10,
    'indexY':           4,
    'width':           16,
    'height':          16,
    'collisionWidth':   5,
    'collisionHeight':  5,
    'rotate':        true,
  },
  {
    'indexX':           7,
    'indexY':           4,
    'width':           16,
    'height':          16,
    'collisionWidth':   5,
    'collisionHeight':  5,
    'rotate':        true,
  },
  {
    'indexX':           1,
    'indexY':           5,
    'width':           16,
    'height':          16,
    'collisionWidth':   5,
    'collisionHeight':  5,
    'rotate':        true,
  },
  {
    'indexX':           9,
    'indexY':           5,
    'width':           16,
    'height':          16,
    'collisionWidth':   5,
    'collisionHeight':  5,
    'rotate':        true,
  },
] ;
