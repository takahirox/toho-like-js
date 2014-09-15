function BulletManager( gameState, params ) {
  this.parent = ElementManager ;
  this.parent.call( this, gameState ) ;
  this.params = params ;
  this.laserCounts = [0, 0]; // TODO: temporal
} ;
__inherit( BulletManager, ElementManager ) ;

BulletManager.prototype._MAX_NUM = 500;

BulletManager.prototype._initMaxNum = function() {
  return this._MAX_NUM;
};


BulletManager.prototype._initFactory = function( ) {
  this.factory = new BulletFactory( this.gameState, this.gameState.getWidth( ), this.gameState.getHeight( ) ) ;
} ;


BulletManager.prototype.initDrawer = function(layer, image) {
  this.drawer = new BulletDrawer(this, layer,
                                 this.gameState.getImage(Game._IMG_SHOT));
};


__copyParentMethod(BulletManager, ElementManager, 'reset');
BulletManager.prototype.reset = function() {
  this.ElementManager_reset();
  for(var i = 0; i < this.laserCounts.length; i++) {
    this.laserCounts[i] = 0;
  }
};


/**
 * TODO: temporal. to make the logic straightforward.
 */
BulletManager.prototype.create = function( fighter ) {
  var params = this.params[ fighter.characterIndex ][ fighter.getBulletIndex( ) ][ fighter.getPowerLevel( ) ] ;
  var flag = false ;
  var count = 0 ;
  var id = fighter.getID();
  for( var i = 0; i < params.length; i++ ) {
    // TODO: temporal
    if( ( params[ i ].laser || params[ i ].homing ) && params[ i ].nextCount ) {
      if( this.count < this.laserCounts[id] + params[ i ].nextCount ) {
        continue ;
      }
      flag = true ;
      if( this.count > count )
        count = this.count ;
    }
    this.addElement( this.factory.create( params[ i ], fighter ) ) ;
  }
  if( flag )
    this.laserCounts[id] = count ;
} ;


__copyParentMethod(BulletManager, ElementManager, 'checkCollisionWith');
BulletManager.prototype.checkCollisionWithEnemies = function(enemies) {
  var self = this;
  for(var i = 0; i < enemies.length; i++) {
    this.ElementManager_checkCollisionWith(null, enemies[i], this);
  }
};


BulletManager.prototype.notifyCollision = function(id, enemy, bullet) {
  // TODO: temporal
  if(bullet._ID !== this._ID_LASER)
    bullet.die();
  // TODO: temporal
  enemy.vital -= bullet.power;
  this.gameState.notifyBulletHit(bullet, enemy);
  if(enemy.vital <= 0) {
    this.gameState.notifyEnemyVanished(bullet, enemy);
    enemy.die();
  }
};


/**
 * TODO: temporal
 */
__copyParentMethod(BulletManager, ElementManager, 'checkCollisionWith2');
BulletManager.prototype.checkCollisionWithBoss = function(boss) {
  if(boss.isFlagSet(boss._FLAG_UNHITTABLE))
    return;

  var self = this;
  this.ElementManager_checkCollisionWith2(null, boss, this);
};


BulletManager.prototype.notifyCollision2 = function(id, boss, bullet) {
  // TODO: temporal
  if(bullet._ID !== this._ID_LASER)
    bullet.die();
  boss.vital -= bullet.power;
  this.gameState.notifyBulletHit(bullet, boss);
};



function BulletFactory( gameState, maxX, maxY ) {
  this.parent = ElementFactory ;

  this.homingFreelist = null ;
  this.laserFreelist = null ;

  this.parent.call( this, gameState, maxX, maxY ) ;
  this.types = __bulletTypes ;  // TODO: temporal
  this.image = null; // TODO: temporal
}
__inherit( BulletFactory, ElementFactory ) ;

BulletFactory.prototype._BULLET_NUM = 100 ;
BulletFactory.prototype._HOMING_NUM = 100 ;
BulletFactory.prototype._LASER_NUM  = 10 ;


BulletFactory.prototype._initFreelist = function() {
  this.freelist       = new BulletFreeList(this._BULLET_NUM, this.gameState);
  this.homingFreelist = new HomingFreeList(this._HOMING_NUM, this.gameState);
  this.laserFreelist  = new LaserFreeList( this._LASER_NUM,  this.gameState);
};


BulletFactory.prototype.create = function( params, fighter ) {
  if( params.laser ) {
    var laser = this.laserFreelist.get( ) ;
    laser.init( params, this._getImage( params ), 
                fighter.getOption(params.option), // TODO: temporal
                this.types[ 3 ]) ; // TODO: temporal
    return laser ;
  }
  if( params.homing ) {
    var homing = this.homingFreelist.get( ) ;
    homing.init( params, this._getImage( params ),
                 fighter.getOption(params.option), // TODO: temporal
                 this.types[ 2 ]) ; // TODO: temporal
    return homing ;
  }
  var key = fighter.characterIndex ;
  var bullet = this.freelist.get( ) ;
  bullet.init( params, this._getImage( params ), this.types[ key ], fighter ) ;
  return bullet ;
} ;


BulletFactory.prototype.free = function( bullet ) {
  switch(bullet._ID) {
    case this.BulletManager._ID_BULLET:
      this.freelist.free( bullet ) ;
      return;
    case this.BulletManager._ID_LASER:
      this.laserFreelist.free( bullet ) ;
      return;
    case this.BulletManager._ID_HOMING:
      this.homingFreelist.free( bullet ) ;
      return;
    default:
      // throw exception?
  }
};


/**
 * TODO: temporal
 */
BulletFactory.prototype._getImage = function(params) {
  if(this.image === null)
    this.image = this.gameState.getImage(Game._IMG_SHOT);
  return this.image;
};



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
  this.fighter = null;
}
__inherit( Bullet, Element ) ;

Bullet.prototype._WIDTH = 16 ;
Bullet.prototype._HEIGHT = 32 ;


/**
 * TODO: temporal. params2 should be renamed.
 */
__copyParentMethod(Bullet, Element, 'init');
Bullet.prototype.init = function(params, image, params2, fighter) {

  this.fighter = fighter;
  this.Element_init(params, image);

  this.setX(this.getX() + this.fighter.getX());
  this.setY(this.getY() + this.fighter.getY());

  // TODO: temporal. Wanna combine this logic with parent init( ).
  this.indexX = params2.indexX !== void 0 ? params2.indexX : 0;
  this.indexY = params2.indexY !== void 0 ? params2.indexY : 0;
  this.width  = params2.width  !== void 0 ? params2.width  : 0;
  this.height = params2.height !== void 0 ? params2.height : 0;
  this.collisionWidth  = params2.collisionWidth  !== void 0 ? params2.collisionWidth  : 0;
  this.collisionHeight = params2.collisionHeight !== void 0 ? params2.collisionHeight : 0;

  this.power  = params.power   !== void 0 ? params.power   : 1;
  this.rotate = params2.rotate !== void 0 ? params2.rotate : 0;
  this._initView();
};


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
__copyParentMethod(LaserView, ElementView, '_initVertices');
LaserView.prototype._initVertices = function() {
  this.ElementView_initVertices();
  this.vertices[1]   = 0;
  this.vertices[4]   = 0;
  this.vertices[7]  *= 4;
  this.vertices[10] *= 4;
};


/**
 * assumes that image height is 256 and master image size is 256.
 * TODO: temporal
 */
__copyParentMethod(LaserView, ElementView, '_initCoordinates');
LaserView.prototype._initCoordinates = function() {
  this.ElementView_initCoordinates();
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

Laser.prototype._WIDTH = 16 ;
Laser.prototype._HEIGHT = 16 ;


__copyParentMethod(Laser, Element, 'init');
Laser.prototype.init = function(params, image, option, params2) {

  this.Element_init(params, image);

  this.option = option;

  // TODO: temporal. Wanna combine this logic with parent init( ).
  this.keepAlive = this._getValueOrDefaultValue(params.keep, 0);
  this.indexX = params2.indexX !== void 0 ? params2.indexX : 0;
  this.indexY = params2.indexY !== void 0 ? params2.indexY : 0;
  this.width  = params2.width  !== void 0 ? params2.width  : 0;
  this.height = params2.height !== void 0 ? params2.height : 0;
  this.collisionWidth  = params2.collisionWidth  !== void 0 ? params2.collisionWidth  : 0;
  this.collisionHeight = params2.collisionHeight !== void 0 ? params2.collisionHeight : 0;

  this.power     = params.power     !== void 0 ? params.power     : 1;
  this.waitCount = params.waitCount !== void 0 ? params.waitCount : 50;
  this.rotate    = params2.rotate   !== void 0 ? params2.rotate   : 0;
  this._initView();
};


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

Homing.prototype.Math = Math;

Homing.prototype._SEARCH_SPAN = 1000;
Homing.prototype._HOMING_SPAN = 2;
Homing.prototype._HOMING_COUNT = 50;
Homing.prototype._HOMING_LAG = 5;
Homing.prototype._HOMING_REACH = 10;

Homing.prototype._OUT_RANGE = 30;


__copyParentMethod(Homing, Element, 'init');
Homing.prototype.init = function(params, image, option, params2) {

  this.Element_init(params, image);

  this.option = option;
  this.setX(this.getX() + option.getCenterX());
  this.setY(this.getY() + option.getCenterY());

  // TODO: temporal. Wanna combine this logic with parent init( ).
  this.keepAlive = this._getValueOrDefaultValue(params.keep, 0);
  this.indexX = params2.indexX !== void 0 ? params2.indexX : 0;
  this.indexY = params2.indexY !== void 0 ? params2.indexY : 0;
  this.width  = params2.width  !== void 0 ? params2.width  : 0;
  this.height = params2.height !== void 0 ? params2.height : 0;
  this.collisionWidth  = params2.collisionWidth  !== void 0 ? params2.collisionWidth  : 0;
  this.collisionHeight = params2.collisionHeight !== void 0 ? params2.collisionHeight : 0;

  this.power     = params.power     !== void 0 ? params.power     : 1;
  this.waitCount = params.waitCount !== void 0 ? params.waitCount : 50;
  this.rotate    = params2.rotate   !== void 0 ? params2.rotate   : false;

  this.target = null;
  this.targetIsDead = false;
  this._initView();
};


/**
 * unnecessary to have Homing special view.
 */
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
__copyParentMethod(Homing, Element, 'runStep');
Homing.prototype.runStep = function() {
  if(this.count % this._SEARCH_SPAN == 0)
    this._searchNearestEnemy();
  if(this.count % this._HOMING_SPAN == 0)
    this._calculateHomingPoint();

  this.Element_runStep(this);
};


/**
 * TODO: temporal
 */
Homing.prototype._searchNearestEnemy = function( ) {
  // TODO: temporal
  if( this.targetIsDead)
    return ;

  var min = 1000 * 1000 ; // TODO: temporary
  var nearest = null ;
  for( var i = 0; i < this.gameState.enemyManager.elements.length; i++ ) {
    var e = this.gameState.enemyManager.elements[ i ] ;
    var d = this.Math.pow( this.getX( ) - e.getX( ), 2 ) + this.Math.pow( this.getY( ) - e.getY( ), 2 ) ;
    if( d < min ) {
      min = d ;
      nearest = e ;
    }
  }
  if( this.gameState.bossManager.existBoss( ) ) {
    var b = this.gameState.bossManager.getBoss( ) ;
    if(! b.vanishing && ! b.escaping) {
      var d = this.Math.pow( this.getX( ) - b.getX( ), 2 ) + this.Math.pow( this.getY( ) - b.getY( ), 2 ) ;
      if( d < min ) {
        min = d ;
        nearest = b ;
      }
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
  if(this.target.isDead() || this.target.isFlagSet(this._FLAG_UNHITTABLE) ||
      this.target.isVanishingOrEscaping()) {
    this.targetIsDead = true ;
    return ;
  }
  var ax = this.target.getX( ) - this.getX( ) ;
  var ay = this.target.getY( ) - this.getY( ) ;
  var t = this._calculateTheta( this.Math.atan2( ay, ax ) ) ;
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
  if( this.getX( ) < -this._OUT_RANGE || this.getX( ) > this.maxX + this._OUT_RANGE ||
      this.getY( ) < -this._OUT_RANGE || this.getY( ) > this.maxY + this._OUT_RANGE )
    return true ;
  return false ;
} ;



// TODO: remove the followings because they complicate the design.

BulletManager.prototype._ID_BULLET = 0;
BulletManager.prototype._ID_LASER  = 1;
BulletManager.prototype._ID_HOMING = 2;

BulletFactory.prototype.BulletManager = BulletManager.prototype;

Bullet.prototype._ID = BulletManager.prototype._ID_BULLET;
Laser.prototype._ID  = BulletManager.prototype._ID_LASER;
Homing.prototype._ID = BulletManager.prototype._ID_HOMING;
