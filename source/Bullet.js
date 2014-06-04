function BulletManager( gameState, params ) {
  this.parent = ElementManager ;
  this.parent.call( this, gameState ) ;
  this.params = params ;
  this.laserCount = 0 ; // TODO: temporal
} ;
__inherit( BulletManager, ElementManager ) ;

BulletManager._MAX_NUM = 500;

BulletManager.prototype._initMaxNum = function() {
  return BulletManager._MAX_NUM;
};


BulletManager.prototype._initFactory = function( ) {
  this.factory = new BulletFactory( this.gameState, this.gameState.getWidth( ), this.gameState.getHeight( ) ) ;
} ;


BulletManager.prototype.initDrawer = function(layer, image) {
  this.drawer = new BulletDrawer(this, layer,
                                 this.gameState.getImage(Game._IMG_SHOT));
};


BulletManager.prototype.reset = function( ) {
  this.parent.prototype.reset.call( this ) ;
  this.laserCount = 0 ;
} ;


/**
 * TODO: temporal. to make the logic straightforward.
 */
BulletManager.prototype.create = function( fighter ) {
  var params = this.params[ fighter.characterIndex ][ fighter.getBulletIndex( ) ][ fighter.getPowerLevel( ) ] ;
  var flag = false ;
  var count = 0 ;
  for( var i = 0; i < params.length; i++ ) {
    // TODO: temporal
    if( ( params[ i ].laser || params[ i ].homing ) && params[ i ].nextCount ) {
      if( this.count < this.laserCount + params[ i ].nextCount ) {
        continue ;
      }
      flag = true ;
      if( this.count > count )
        count = this.count ;
    }
    this.addElement( this.factory.create( params[ i ], fighter ) ) ;
  }
  if( flag )
    this.laserCount = count ;
} ;


BulletManager.prototype.checkCollisionWithEnemies = function( enemies ) {
  var self = this ;
  for( var i = 0; i < enemies.length; i++ ) {
    this.parent.prototype.checkCollisionWith.call( this, enemies[ i ],
      this._checkCollisionWithEnemiesCallBack.bind( this ) ) ;
  }
} ;


BulletManager.prototype._checkCollisionWithEnemiesCallBack = function( enemy, bullet ) {
  // TODO: temporal
  if( ! ( bullet instanceof Laser ) )
    bullet.die( ) ;
  // TODO: temporal
  enemy.vital -= bullet.power ;
  this.gameState.notifyBulletHit( bullet, enemy ) ;
  if( enemy.vital <= 0 ) {
    this.gameState.notifyEnemyVanished( bullet, enemy ) ;
    enemy.die( ) ;
  }
} ;


/**
 * TODO: temporal
 */
BulletManager.prototype.checkCollisionWithBoss = function( boss ) {
  if( boss.isFlagSet( Element._FLAG_UNHITTABLE ) )
    return ;

  var self = this ;
  this.parent.prototype.checkCollisionWith2.call( this, boss,
    this._checkCollisionWithBossCallBack.bind( this ) ) ;
} ;


BulletManager.prototype._checkCollisionWithBossCallBack = function( boss, bullet ) {
  // TODO: temporal
  if( ! ( bullet instanceof Laser ) )
    bullet.die( ) ;
  boss.vital -= bullet.power ;
  this.gameState.notifyBulletHit( bullet, boss ) ;
} ;



function BulletFactory( gameState, maxX, maxY ) {
  this.parent = ElementFactory ;

  this.homingFreelist = null ;
  this.laserFreelist = null ;

  this.parent.call( this, gameState, maxX, maxY ) ;
  this.types = __bulletTypes ;  // TODO: temporal
}
__inherit( BulletFactory, ElementFactory ) ;

BulletFactory._BULLET_NUM = 100 ;
BulletFactory._HOMING_NUM = 100 ;
BulletFactory._LASER_NUM  = 10 ;


BulletFactory.prototype._initFreelist = function( ) {
  this.freelist       = new BulletFreeList( BulletFactory._BULLET_NUM, this.gameState ) ; 
  this.homingFreelist = new HomingFreeList( BulletFactory._HOMING_NUM, this.gameState ) ; 
  this.laserFreelist  = new LaserFreeList(  BulletFactory._LASER_NUM,  this.gameState ) ; 
} ;


BulletFactory.prototype.create = function( params, fighter ) {
  if( params.laser ) {
    var laser = this.laserFreelist.get( ) ;
    laser.init( params, this._getImage( params ), 
                this.gameState.fighterOptionManager.elements[ params.option ], // TODO: temporal
                this.types[ 3 ] ) ; // TODO: temporal
    return laser ;
  }
  if( params.homing ) {
    var homing = this.homingFreelist.get( ) ;
    homing.init( params, this._getImage( params ),
                 this.gameState.fighterOptionManager.elements[ params.option ], // TODO: temporal
                 this.types[ 2 ] ) ; // TODO: temporal
    return homing ;
  }
  var key = fighter.characterIndex ;
  var bullet = this.freelist.get( ) ;
  bullet.init( params, this._getImage( params ), this.types[ key ] ) ;
  return bullet ;
} ;


BulletFactory.prototype.free = function( bullet ) {
  if( bullet instanceof Bullet )
    this.freelist.free( bullet ) ;
  else if( bullet instanceof Homing )
    this.homingFreelist.free( bullet ) ;
  else if( bullet instanceof Laser )
    this.laserFreelist.free( bullet ) ;
} ;


BulletFactory.prototype._getImage = function( params ) {
  return this.gameState.getImage( Game._IMG_SHOT ) ;
} ;



function BulletFreeList( num, gameState ) {
  this.parent = ElementFreeList ;
  this.parent.call( this, num, gameState ) ;
}
__inherit( BulletFreeList, ElementFreeList ) ;


BulletFreeList.prototype._generateElement = function( ) {
  return new Bullet( this.gameState, this.gameState.getWidth( ), this.gameState.getHeight( ) ) ;
} ;



function BulletDrawer(elementManager, layer, image) {
  this.parent = ElementDrawer;
  this.parent.call(this, elementManager, layer, image);
};
__inherit(BulletDrawer, ElementDrawer);


function BulletView(element) {
  this.parent = ElementView;
  this.parent.call(this, element);
  this.a = 0.8;
};
__inherit(BulletView, ElementView);



function Bullet( gameState, maxX, maxY ) {
  this.parent = Element ;
  this.parent.call( this, gameState, maxX, maxY ) ;
  this.rotate = null ;
  this.power = null ;
}
__inherit( Bullet, Element ) ;

Bullet._WIDTH = 16 ;
Bullet._HEIGHT = 32 ;


/**
 * TODO: temporal. params2 should be renamed.
 */
Bullet.prototype.init = function( params, image, params2 ) {
  this.parent.prototype.init.call( this, params, image ) ;
  this.setX( this.getX( ) + this.gameState.fighter.getX( ) ) ;
  this.setY( this.getY( ) + this.gameState.fighter.getY( ) ) ;

  // TODO: temporal. Wanna combine this logic with parent init( ).
  this.indexX = params2.indexX != undefined ? params2.indexX : 0 ;
  this.indexY = params2.indexY != undefined ? params2.indexY : 0 ;
  this.width  = params2.width  != undefined ? params2.width  : 0 ;
  this.height = params2.height != undefined ? params2.height : 0 ;
  this.collisionWidth  = params2.collisionWidth  != undefined ? params2.collisionWidth  : 0 ;
  this.collisionHeight = params2.collisionHeight != undefined ? params2.collisionHeight : 0 ;

  this.power  = params.power   != undefined ? params.power   : 1 ;
  this.rotate = params2.rotate != undefined ? params2.rotate : 0 ;
  this._initView();
} ;


Bullet.prototype._generateView = function() {
  return new BulletView(this);
};


/**
 * TODO: which is faster save&restore or doing by my hand?
 */
Bullet.prototype.display = function( surface ) {
//  surface.save( ) ;
  surface.globalAlpha = 0.8 ;
  this.parent.prototype.display.call( this, surface, true ) ;
  surface.globalAlpha = 1.0 ;
//  surface.restore( ) ;
} ;



function LaserFreeList( num, gameState ) {
  this.parent = ElementFreeList ;
  this.parent.call( this, num, gameState ) ;
}
__inherit( LaserFreeList, ElementFreeList ) ;


LaserFreeList.prototype._generateElement = function( ) {
  return new Laser( this.gameState, this.gameState.getWidth( ), this.gameState.getHeight( ) ) ;
} ;



/**
 * TODO: consider the option to use add blend.
 */
function LaserView(element) {
  this.parent = ElementView;
  this.parent.call(this, element);
};
__inherit(LaserView, ElementView);


LaserView.prototype._getElementX = function() {
  return this.element.option.getCenterX() + this.element.getX();
};


LaserView.prototype._getElementY = function() {
  return this.element.option.getCenterY() + this.element.getY();
};


LaserView.prototype._getElementZ = function() {
  return this.element.option.getZ();
};


/**
 * assumes that image height is 256 and master image size is 256.
 * TODO: temporal
 */
LaserView.prototype._initVertices = function() {
  this.parent.prototype._initVertices.call(this);
  this.vertices[1]   = 0;
  this.vertices[4]   = 0;
  this.vertices[7]  *= 4;
  this.vertices[10] *= 4;
};


/**
 * assumes that image height is 256 and master image size is 256.
 * TODO: temporal
 */
LaserView.prototype._initCoordinates = function() {
  this.parent.prototype._initCoordinates.call(this);
  this.coordinates[1] *= 2;
  this.coordinates[3] *= 2;
};


/**
 * TODO: should be in Laser?
 */
LaserView.prototype.animate = function() {
  if(this.element.count < this.element.waitCount ||
     this.element.count + 10 > this.element.keepAlive )
    this.a = 0.2;
  else
    this.a = 0.8;
};



/**
 * TODO: temporal
 */
function Laser( gameState, maxX, maxY ) {
  this.parent = Element ;
  this.parent.call( this, gameState, maxX, maxY ) ;
  this.rotate = null ;
  this.option = null ;
  this.power  = null ;
}
__inherit( Laser, Element ) ;

Laser._WIDTH = 16 ;
Laser._HEIGHT = 16 ;


Laser.prototype.init = function( params, image, option, params2 ) {
  this.parent.prototype.init.call( this, params, image ) ;
  this.option = option ;

  // TODO: temporal. Wanna combine this logic with parent init( ).
  this.keepAlive = this._getValueOrDefaultValue( params.keep, 0 ) ;
  this.indexX = params2.indexX != undefined ? params2.indexX : 0 ;
  this.indexY = params2.indexY != undefined ? params2.indexY : 0 ;
  this.width  = params2.width  != undefined ? params2.width  : 0 ;
  this.height = params2.height != undefined ? params2.height : 0 ;
  this.collisionWidth  = params2.collisionWidth  != undefined ? params2.collisionWidth  : 0 ;
  this.collisionHeight = params2.collisionHeight != undefined ? params2.collisionHeight : 0 ;

  this.power     = params.power     != undefined ? params.power     : 1 ;
  this.waitCount = params.waitCount != undefined ? params.waitCount : 50 ;
  this.rotate    = params2.rotate   != undefined ? params2.rotate   : 0 ;
  this._initView();
} ;


Laser.prototype._generateView = function() {
  return new LaserView(this);
};


/**
 * TODO: temporal
 */
Laser.prototype.display = function( surface ) {

  var x = Math.round( this.option.getCenterX( ) + this.getLeftX( ) ) ;
  var y = Math.round( this.option.getCenterY( ) + this.getCenterY( ) ) ;
//  surface.save( ) ;
  if( this.count < this.waitCount || this.count + 10 > this.keepAlive )
    surface.globalAlpha = 0.2 ;
  else
    surface.globalAlpha = 0.6 ;
  while( y > 0 ) {
    surface.drawImage( this.image,
                       this.width  * this.indexX, this.height * this.indexY,
                       this.width,                this.height,
                       x,                         y,
                       this.width,                -this.height ) ;
    y -= this.height ;
  }
  surface.globalAlpha = 1.0 ;
//  surface.restore( ) ;

} ;


/**
 * TODO: temporal
 */
Laser.prototype.checkCollision = function( enemy ) {
  if( this.count < this.waitCount )
    return false ;

  // TODO: temporal
  if( this.count % 3 != 0 )
    return false ;

  // TODO: temporal
  if( this.vector.theta != 270 )
    return false ;

  if( enemy.getCollisionUpY( ) > this.y + this.option.getCenterY( ) )
    return false ;

  if( enemy.getCollisionRightX( ) < this.x + this.option.getCenterX( ) - this.width/2 )
    return false ;

  if( enemy.getCollisionLeftX( ) > this.x + this.option.getCenterX( ) + this.width/2 )
    return false ;

  return true ;

} ;


/**
 * TODO: temporal
 */
Laser.prototype.checkLoss = function( ) {
  if( this.isDead( ) )
    return true ;
  if( this.keepAlive && this.count >= this.keepAlive )
    return true ;
  return false ;
} ;



function HomingFreeList( num, gameState ) {
  this.parent = ElementFreeList ;
  this.parent.call( this, num, gameState ) ;
}
__inherit( HomingFreeList, ElementFreeList ) ;


HomingFreeList.prototype._generateElement = function( ) {
  return new Homing( this.gameState, this.gameState.getWidth( ), this.gameState.getHeight( ) ) ;
} ;



/**
 * TODO: temporal
 */
function Homing( gameState, maxX, maxY ) {
  this.parent = Element ;
  this.parent.call( this, gameState, maxX, maxY ) ;
  this.rotate = null ;
  this.option = null ;
  this.power  = null ;
  this.target = null ;
  this.targetIsDead = false ;
}
__inherit( Homing, Element ) ;

Homing._SEARCH_SPAN = 1000 ;
Homing._HOMING_SPAN = 2 ;
Homing._HOMING_COUNT = 50 ;
Homing._HOMING_LAG = 5 ;
Homing._HOMING_REACH = 10 ;

Homing._OUT_RANGE = 30 ;


Homing.prototype.init = function( params, image, option, params2 ) {

  this.parent.prototype.init.call( this, params, image ) ;
  this.option = option ;
  this.setX( this.getX( ) + option.getCenterX( ) ) ;
  this.setY( this.getY( ) + option.getCenterY( ) ) ;

  // TODO: temporal. Wanna combine this logic with parent init( ).
  this.keepAlive = this._getValueOrDefaultValue( params.keep, 0 ) ;
  this.indexX = params2.indexX != undefined ? params2.indexX : 0 ;
  this.indexY = params2.indexY != undefined ? params2.indexY : 0 ;
  this.width  = params2.width  != undefined ? params2.width  : 0 ;
  this.height = params2.height != undefined ? params2.height : 0 ;
  this.collisionWidth  = params2.collisionWidth  != undefined ? params2.collisionWidth  : 0 ;
  this.collisionHeight = params2.collisionHeight != undefined ? params2.collisionHeight : 0 ;

  this.power     = params.power     != undefined ? params.power     : 1 ;
  this.waitCount = params.waitCount != undefined ? params.waitCount : 50 ;
  this.rotate    = params2.rotate   != undefined ? params2.rotate   : false ;

  this.target = null ;
  this.targetIsDead = false ;
  this._initView();
} ;


Homing.prototype._generateView = function() {
  return new BulletView(this);
};


Homing.prototype.display = function( surface ) {
//  surface.save( ) ;
  surface.globalAlpha = 0.8 ;
  this.parent.prototype.display.call( this, surface, true ) ;
  surface.globalAlpha = 1.0 ;
//  surface.restore( ) ;

} ;


/**
 * TODO: temporal
 */
Homing.prototype.runStep = function( ) {
  if( this.count % Homing._SEARCH_SPAN == 0 )
    this._searchNearestEnemy( ) ;
  if( this.count % Homing._HOMING_SPAN == 0 )
    this._calculateHomingPoint( ) ;
  this.parent.prototype.runStep.call( this ) ;
} ;


/**
 * TODO: temporal
 */
Homing.prototype._searchNearestEnemy = function( ) {
  // TODO: temporal
  if( this.targetIsDead )
    return ;

  var min = 1000 * 1000 ; // TODO: temporary
  var nearest = null ;
  for( var i = 0; i < this.gameState.enemyManager.elements.length; i++ ) {
    var e = this.gameState.enemyManager.elements[ i ] ;
    var d = Math.pow( this.getX( ) - e.getX( ), 2 ) + Math.pow( this.getY( ) - e.getY( ), 2 ) ;
    if( d < min ) {
      min = d ;
      nearest = e ;
    }
  }
  if( this.gameState.bossManager.existBoss( ) ) {
    var b = this.gameState.bossManager.getBoss( ) ;
    var d = Math.pow( this.getX( ) - b.getX( ), 2 ) + Math.pow( this.getY( ) - b.getY( ), 2 ) ;
    if( d < min ) {
      min = d ;
      nearest = b ;
    }
  }

  // TODO: temporary
  if( nearest )
    this.target = nearest ;
} ;


/**
 * TODO: temporal
 */
Homing.prototype._calculateHomingPoint = function( ) {
  if( ! this.target )
    return ;
  // TODO: how handles the case if target is used for the other alive element soon again?
  if( this.target.isDead( ) || this.target.isFlagSet( Element._FLAG_UNHITTABLE ) ) {
    this.targetIsDead = true ;
    return ;
  }
  var ax = this.target.getX( ) - this.getX( ) ;
  var ay = this.target.getY( ) - this.getY( ) ;
  var t = this._calculateTheta( Math.atan2( ay, ax ) ) ;
/*
  var diff = t - this.vector.theta ;
  if( Math.cos( this._calculateRadian( diff ) ) >
      Math.cos( this._calculateRadian( Homing._HOMING_REACH ) ) ) {
    this.vector.theta = t ;
  } else if( Math.sin( this._calculateRadian( diff ) ) > 0 ) {
    this.vector.theta += Homing._HOMING_REACH ;
  } else if( Math.sin( this._calculateRadian( diff ) ) < 0 ) {
    this.vector.theta -= Homing._HOMING_REACH ;
  } else {
*/
    this.vector.theta = t ;
/*
  }
*/
  return ;
} ;


Homing.prototype._outOfTheField = function( ) {
  if( this.getX( ) < -Homing._OUT_RANGE || this.getX( ) > this.maxX + Homing._OUT_RANGE ||
      this.getY( ) < -Homing._OUT_RANGE || this.getY( ) > this.maxY + Homing._OUT_RANGE )
    return true ;
  return false ;
} ;


