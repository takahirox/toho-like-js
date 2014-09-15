function EnemyBulletManager( gameState, params ) {
  this.parent = ElementManager ;
  this.parent.call( this, gameState ) ;
  this.params = params ;
  this.index = 0 ;
  this.reservedLength = 0 ; // TODO: temporal
  this.reserved = [ ] ;     // TODO: temporal
  this._initReserved( ) ;
  this.beamDrawer = null; // TODO: temporal
} ;
__inherit( EnemyBulletManager, ElementManager ) ;

EnemyBulletManager.prototype._RESERVED_NUM = 50 ; // TODO: temporal
EnemyBulletManager.prototype._MAX_NUM = 1000 ; // TODO: temporal


EnemyBulletManager.prototype._initMaxNum = function() {
  return this._MAX_NUM;
};


EnemyBulletManager.prototype._initFactory = function( ) {
  this.factory = new EnemyBulletFactory( this.gameState, this.gameState.getWidth( ), this.gameState.getHeight( ) ) ;
} ;


EnemyBulletManager.prototype.initDrawer = function(layer, image) {
  this.drawer = new EnemyBulletDrawer(
                      this, layer,
                      this.gameState.getImage(Game._IMG_ENEMY_SHOT));
  this.beamDrawer = new EnemyBeamDrawer(
                      this, layer,
                      this.gameState.getImage(Game._IMG_BEAM));
};


/**
 * TODO: temporal. should implement reserved freelist?
 */
EnemyBulletManager.prototype._initReserved = function( ) {
  for( var i = 0; i < this._RESERVED_NUM; i++ ) {
    this.reserved.push( { 'enemy': null,
                          'index': 0,
                          'count': 0,
                          'shot' : null,
                          'array': null } ) ;
  }
} ;


__copyParentMethod(EnemyBulletManager, ElementManager, 'reset');
EnemyBulletManager.prototype.reset = function() {
  this.ElementManager_reset();
  this.reservedLength = 0;
  this.index = 0;
};


__copyParentMethod(EnemyBulletManager, ElementManager, 'runStep');
EnemyBulletManager.prototype.runStep = function() {
  this._shotReserved();
  for(var i = 0; i < this.reservedLength; i++)
    this.reserved[ i ].count++;
  this.ElementManager_runStep();
};


/**
 * TODO: temporal. to make the logic straightforward.
 */
EnemyBulletManager.prototype._shotReserved = function( ) {
  for( var i = 0; i < this.reservedLength; i++ ) {
    if( this.reserved[ i ].enemy.isDead( ) )
      continue ;
    while( this.reserved[ i ].index < this.reserved[ i ].array.length &&
           this.reserved[ i ].count >= this.reserved[ i ].array[ this.reserved[ i ].index ].count ) {
      // TODO: temporal
      if(! this.gameState.isBombExist()) {
        this.addElement(
          this.factory.create(
            this.reserved[ i ].enemy,
            this.reserved[ i ].array[ this.reserved[ i ].index ],
            this.reserved[ i ].shot ) ) ;
        this.gameState.notifyEnemyDidShot( this.reserved[ i ].enemy,
                                           this.reserved[ i ].shot ) ;
      }
      this.reserved[ i ].index++ ;
    }
  }
} ;


EnemyBulletManager.prototype.create = function( enemy, shot ) {
  // TODO: temporal. to make reserved manager?
  if(this.params[shot.bullet][0].count !== void 0) {
    var r = this.reserved[ this.reservedLength ] ;
    r.enemy = enemy ;
    r.index = 0 ;
    r.count = 0 ;
    r.shot  = shot ;
    r.array = this.params[ shot.bullet ] ;
    this.reservedLength++ ;
    return ;
  }

  for( var i = 0; i < this.params[ shot.bullet ].length; i++ ) {
    if(! this.gameState.isBombExist()) {
      this.addElement( this.factory.create( enemy, this.params[ shot.bullet ][ i ], shot ) ) ;
      this.gameState.notifyEnemyDidShot( enemy, shot ) ;
    }
  }
} ;


__copyParentMethod(EnemyBulletManager, ElementManager, 'checkLoss');
EnemyBulletManager.prototype.checkLoss = function( ) {
  this.ElementManager_checkLoss();

  // TODO: temporal. to use freelist?
  var j = 0 ;
  for( var i = 0; i < this.reservedLength; i++ ) {
    if( ! this.reserved[ i ].enemy.isDead( ) && this.reserved[ i ].index < this.reserved[ i ].array.length ) {
      var tmp = this.reserved[ i - j ] ;
      this.reserved[ i - j ] = this.reserved[ i ] ;
      this.reserved[ i ] = tmp ;
    } else {
      j++ ;
    }
  }
  this.reservedLength -= j ;

};


/**
 * TODO: temporal
 */
EnemyBulletManager.prototype.clearReserved = function( enemy ) {
  this.reservedLength = 0 ;
} ;


__copyParentMethod(EnemyBulletManager, ElementManager, 'checkCollisionWith');
EnemyBulletManager.prototype.checkCollisionWith = function(fighter) {
  if(fighter.isFlagSet(fighter._FLAG_UNHITTABLE))
    return;
  this.ElementManager_checkCollisionWith(null, fighter, this, true);
};


EnemyBulletManager.prototype.checkCollisionWithFighters = function(fighters) {
  for(var i = 0; i < fighters.length; i++) {
    this.checkCollisionWith(fighters[i]);
  }
};

EnemyBulletManager.prototype.notifyCollision = function(id, fighter, bullet) {
  fighter.die();
  this.gameState.notifyFighterDead(fighter, bullet);
};


__copyParentMethod(EnemyBulletManager, ElementManager, 'checkGrazeWith');
EnemyBulletManager.prototype.checkGrazeWith = function(fighter) {
  this.ElementManager_checkGrazeWith(null, fighter, this);
};


EnemyBulletManager.prototype.checkGrazeWithFighters = function(fighters) {
  for(var i = 0; i < fighters.length; i++) {
    this.checkGrazeWith(fighters[i]);
  }
};


EnemyBulletManager.prototype.notifyGraze = function(id, fighter,
    bullet) {
  this.gameState.notifyGraze(fighter, bullet);
};


/**
 * TODO: temporal
 */
EnemyBulletManager.prototype.bomb = function( fighter ) {
  for( var i = 0; i < this.elements.length; i++ ) {
    this.elements[ i ].die( ) ;
    this.gameState.notifyBeScoreItem(fighter, this.elements[i]);
  }
} ;


EnemyBulletManager.prototype.removeBulletsOfEnemy = function( enemy ) {
  for( var i = 0; i < this.elements.length; i++ ) {
    if( this.elements[ i ].enemy == enemy )
      this.elements[ i ].die( ) ;
  }
} ;


EnemyBulletManager.prototype.beItem = function(fighter) {
  for( var i = 0; i < this.elements.length; i++ ) {
    this.elements[ i ].die( ) ;
    this.gameState.notifyBeScoreItem(fighter, this.elements[i]);
  }
  // TODO: temporal
  this.clearReserved( ) ;
} ;


EnemyBulletManager.prototype.draw = function(layer) {
  this.drawer.draw(layer);
  this.beamDrawer.draw(layer);
};



function EnemyBulletFactory( gameState, maxX, maxY ) {
  this.parent = ElementFactory ;

  this.beamFreelist = null ;
  this.laserFreelist = null ;

  this.parent.call( this, gameState, maxX, maxY ) ;
  this.types = __enemyBulletTypes ; // TODO: temporal

  // TODO: temporal
  this.image = null;
  this.beamImage = null;
}
__inherit( EnemyBulletFactory, ElementFactory ) ;

EnemyBulletFactory.prototype._NUM = 1000 ;
EnemyBulletFactory.prototype._BEAM_NUM = 100 ;
EnemyBulletFactory.prototype._LASER_NUM = 50 ;


EnemyBulletFactory.prototype._initFreelist = function() {
  this.freelist      = new EnemyBulletFreeList(this._NUM, this.gameState);
  this.beamFreelist  = new EnemyBeamFreeList(this._BEAM_NUM, this.gameState);
  this.laserFreelist = new EnemyLaserFreeList(this._LASER_NUM, this.gameState);
};


// TODO: temporal
EnemyBulletFactory.prototype.create = function( enemy, params, shot ) {
  // TODO: temporal. How can I remove this save and restore.
  var preX = params.x ;
  var preY = params.y ;
  var preR = params.r ;
  var preBaseTheta = params.baseTheta ;

  params.r = shot.r ;
  params.baseTheta = shot.baseTheta ;

  params.x = ( params.x ? params.x : 0 ) + enemy.getX( ) + ( shot.x ? shot.x : 0 ) ;
  params.y = ( params.y ? params.y : 0 ) + enemy.getY( ) + ( shot.y ? shot.y : 0 ) ;
  var bullet ;
  if( params.beam ) {
    bullet = this.beamFreelist.get( ) ;
    bullet.init( params, this._getImage( params ), enemy ) ;
  } else if( params.laser ) {
    bullet = this.laserFreelist.get( ) ;
    bullet.init( params, this._getImage( params ), enemy ) ;
  } else {
    var key = shot.type ? shot.type : 0 ;
    bullet = this.freelist.get( ) ;
    bullet.init( params, this._getImage( params ), enemy, this.types[ key ] ) ;
  }
  params.x = preX ;
  params.y = preY ;
  params.r = preR ;
  params.baseTheta = preBaseTheta ;
  return bullet ;
} ;


EnemyBulletFactory.prototype.free = function(bullet) {
  switch(bullet._ID) {
    case this.EnemyBulletManager._ID_BULLET:
      this.freelist.free(bullet);
      return;
    case this.EnemyBulletManager._ID_LASER:
      this.laserFreelist.free(bullet);
      return;
    case this.EnemyBulletManager._ID_BEAM:
      this.beamFreelist.free(bullet);
      return;
    default:
      // throw exception?
  }
};


/**
 * TODO: temporal
 */
EnemyBulletFactory.prototype._getImage = function(params) {
  if(params.beam) {
    if(this.beamImage === null)
      this.beamImage = this.gameState.getImage(Game._IMG_BEAM);
    return this.beamImage;
  } else {
    if(this.image === null)
      this.image = this.gameState.getImage(Game._IMG_ENEMY_SHOT);
    return this.image;
  }
};



function EnemyBulletFreeList( num, gameState ) {
  this.parent = ElementFreeList ;
  this.parent.call( this, num, gameState ) ;
} ;
__inherit( EnemyBulletFreeList, ElementFreeList ) ;


EnemyBulletFreeList.prototype._generateElement = function( ) {
  return new EnemyBullet( this.gameState, this.gameState.getWidth( ), this.gameState.getHeight( ) ) ;
} ;



function EnemyBulletDrawer(elementManager, layer, image) {
  this.parent = ElementDrawer;
  this.parent.call(this, elementManager, layer, image);
};
__inherit(EnemyBulletDrawer, ElementDrawer);


EnemyBulletDrawer.prototype._doPour = function(e) {
  return (e._ID === this.elementManager._ID_BEAM) ? false : true;
};



function EnemyBulletView(element) {
  this.parent = ElementView;
  this.parent.call(this, element);
};
__inherit(EnemyBulletView, ElementView);



function EnemyBullet( gameState, maxX, maxY ) {
  this.parent = Element ;
  this.parent.call( this, gameState, maxX, maxY ) ;

  this.enemy = null ;
  this.rotate = false ;
}
__inherit( EnemyBullet, Element ) ;


__copyParentMethod(EnemyBullet, Element, 'init');
EnemyBullet.prototype.init = function(params, image, enemy, params2) {
  this.Element_init(params, image);
  this.enemy = enemy;

  this.width           = params2.width;
  this.height          = params2.height;
  this.collisionWidth  = params2.collisionWidth;
  this.collisionHeight = params2.collisionHeight;
  this.indexX          = params2.indexX;
  this.indexY          = params2.indexY;
  this.rotate          = params2.rotate;
  this.grazeWidth      = this.width;
  this.grazeHeight     = this.height;
  this._initView();
};


EnemyBullet.prototype._generateView = function() {
  return new EnemyBulletView(this);
};


EnemyBullet.prototype.display = function( surface ) {
  this.parent.prototype.display.call( this, surface, this.rotate ) ;
} ;



function EnemyLaserFreeList( num, gameState ) {
  this.parent = ElementFreeList ;
  this.parent.call( this, num, gameState ) ;
} ;
__inherit( EnemyLaserFreeList, ElementFreeList ) ;


EnemyLaserFreeList.prototype._generateElement = function( ) {
  return new EnemyLaser( this.gameState, this.gameState.getWidth( ), this.gameState.getHeight( ) ) ;
} ;



function EnemyLaserView(element) {
  this.parent = ElementView;
  this.parent.call(this, element);
};
__inherit(EnemyLaserView, ElementView);


__copyParentMethod(EnemyLaserView, ElementView, '_initVertices');
EnemyLaserView.prototype._initVertices = function() {
  this.ElementView_initVertices();
  this.vertices[1] = 0;
  this.vertices[4] = 0;
  this.vertices[7] *= 2;
  this.vertices[10] *= 2;
};


__copyParentMethod(EnemyLaserView, ElementView, '_initCoordinates');
EnemyLaserView.prototype._initCoordinates = function() {
  this.ElementView_initCoordinates();
  // TODO: temporal.
  var s = 0.01;
  var h = this.element.getWidth()/this.element.getImageHeight();
  var y1 = h * this.element.getImageIndexY();
  var y2 = y1 + h - s;

  this.coordinates[1] = y2;
  this.coordinates[3] = y2;
  this.coordinates[5] = y1;
  this.coordinates[7] = y1;
};


/**
 * TODO: should be in EnemyLaser?
 */
EnemyLaserView.prototype.animate = function() {
  var w = this.element.getWidth()/2;
  if(this.element.count < this.element.waitCount) {
    w = w * this.element.count / this.element.waitCount ;
    this.a = 0.2;
  } else if (this.element.inExtendTime()) {
    w = w * (this.element.keepAlive + this.element._EXTEND_COUNT
               - this.element.count)
            / this.element._EXTEND_COUNT;
    this.a = 0.2;
  } else {
    this.a = 0.8;
  }

  this.vertices[0] = -w;
  this.vertices[3] =  w;
  this.vertices[6] =  w;
  this.vertices[9] = -w;
};



/**
 * TODO: temporal
 */
function EnemyLaser( gameState, maxX, maxY ) {
  this.parent = Element ;
  this.parent.call( this, gameState, maxX, maxY ) ;
  this.baseX = 0 ;
  this.baseY = 0 ;
}
__inherit( EnemyLaser, Element ) ;

// only for reference
EnemyLaser.prototype.Math = Math;

// TODO: temporal
EnemyLaser.prototype._WIDTH = 16; 
EnemyLaser.prototype._HEIGHT = 400 * 2;
EnemyLaser.prototype._EXTEND_COUNT = 20;


__copyParentMethod(EnemyLaser, Element, 'init');
EnemyLaser.prototype.init = function(params, image, enemy) {
  this.Element_init(params, image);

  this.enemy = enemy;
  this.width = this._WIDTH;
  this.height = this._HEIGHT;
  this.collisionWidth = this.width;
  this.collisionHeight = this.height;

  this.waitCount = this._getValueOrDefaultValue(params.waitCount, 0);
  this.keepAlive = this._getValueOrDefaultValue(params.keep, 0);
  this.baseX = this.Math.round(enemy.getX());
  this.baseY = this.Math.round(enemy.getY());
  this.indexX = 15;
  this.indexY = 0;
  this._initView();
};


EnemyLaser.prototype._generateView = function() {
  return new EnemyLaserView(this);
};


/**
 * TODO: temporal
 */
EnemyLaser.prototype.display = function( surface ) {
  surface.save( ) ;
  var width = this.getWidth( ) ;
  if( this.count < this.waitCount ) {
    width = width * this.count / this.waitCount ;
    surface.globalAlpha = 0.2 ;
  } else if ( this.count + 10 > this.keepAlive ) {
    width = width * ( 10 - this.count + this.keepAlive ) / 10 ;
    surface.globalAlpha = 0.2 ;
  } else {
    surface.globalAlpha = 0.8 ;
  }
  var x = Math.round( this.getCenterX( ) ) ;
  var y = Math.round( this.getCenterY( ) - width / 2 ) ;
  surface.translate( this.baseX, this.baseY ) ;
  surface.rotate( this._calculateRadian( this.vector.theta ) ) ;
  surface.translate( -this.baseX, -this.baseY ) ;
  surface.drawImage( this.image,
                     this.getWidth( ) * this.indexX, this.height * this.indexY,
                     this.getWidth( ),               this.getWidth( ),
                     x,                              y,
                     this.height,                    width ) ;
  surface.restore( ) ;
//  surface.fillText( x + ':' + y, x, y ) ;
} ;


EnemyLaser.prototype._getTheta = function( ) {
  return this._calculateRadian( this.vector.theta ) ;
} ;


EnemyLaser.prototype.getUpLeftX = function( ) {
  return this.getCenterX( ) - ( this.getWidth( ) / 2 ) * this.Math.cos( this._getTheta( ) ) ;
} ;


EnemyLaser.prototype.getUpLeftY = function( ) {
  return this.getCenterY( ) - ( this.getWidth( ) / 2 ) * this.Math.sin( this._getTheta( ) ) ;
} ;


EnemyLaser.prototype.getUpRightX = function( ) {
  return this.getCenterX( ) + ( this.getWidth( ) / 2 ) * this.Math.cos( this._getTheta( ) ) ;
} ;


EnemyLaser.prototype.getUpRightY = function( ) {
  return this.getCenterY( ) + ( this.getWidth( ) / 2 ) * this.Math.sin( this._getTheta( ) ) ;
} ;


EnemyLaser.prototype.getBottomLeftX = function( ) {
  return this.getUpLeftX( ) + this.getHeight( ) * this.Math.cos( this._getTheta( ) ) ;
} ;


EnemyLaser.prototype.getBottomLeftY = function( ) {
  return this.getUpLeftY( ) + this.getHeight( ) * this.Math.sin( this._getTheta( ) ) ;
} ;


EnemyLaser.prototype.getBottomRightX = function( ) {
  return this.getUpRightX( ) + this.getHeight( ) * this.Math.cos( this._getTheta( ) ) ;
} ;


EnemyLaser.prototype.getBottomRightY = function( ) {
  return this.getUpRightY( ) + this.getHeight( ) * this.Math.sin( this._getTheta( ) ) ;
} ;


EnemyLaser.prototype.getCollisionUpLeftX = function( ) {
  return this.getCenterX( ) - ( this.collisionWidth / 2 ) * this.Math.sin( this._getTheta( ) ) ;
} ;


EnemyLaser.prototype.getCollisionUpLeftY = function( ) {
  return this.getCenterY( ) + ( this.collisionWidth / 2 ) * this.Math.cos( this._getTheta( ) ) ;
} ;


EnemyLaser.prototype.getCollisionUpRightX = function( ) {
  return this.getCenterX( ) + ( this.collisionWidth / 2 ) * this.Math.sin( this._getTheta( ) ) ;
} ;


EnemyLaser.prototype.getCollisionUpRightY = function( ) {
  return this.getCenterY( ) - ( this.collisionWidth / 2 ) * this.Math.cos( this._getTheta( ) ) ;
} ;


EnemyLaser.prototype.getCollisionBottomLeftX = function( ) {
  return this.getCollisionUpLeftX( ) + this.collisionHeight * this.Math.cos( this._getTheta( ) ) ;
} ;


EnemyLaser.prototype.getCollisionBottomLeftY = function( ) {
  return this.getCollisionUpLeftY( ) + this.collisionHeight * this.Math.sin( this._getTheta( ) ) ;
} ;


EnemyLaser.prototype.getCollisionBottomRightX = function( ) {
  return this.getCollisionUpRightX( ) + this.collisionHeight * this.Math.cos( this._getTheta( ) ) ;
} ;


EnemyLaser.prototype.getCollisionBottomRightY = function( ) {
  return this.getCollisionUpRightY( ) + this.collisionHeight * this.Math.sin( this._getTheta( ) ) ;
} ;


EnemyLaser.prototype.inCollisionArea = function( x, y ) {

  if(this.inExtendTime() || this.overExtendTime())
    return false;

  if(! this._inCollisionTheta(
         this.getCollisionUpRightX(), this.getCollisionUpRightY(),
         x,                           y,
         this.getCollisionUpLeftX(),  this.getCollisionUpLeftY()
     ))
    return false;

  if(! this._inCollisionTheta(
         this.getCollisionBottomLeftX(),   this.getCollisionBottomLeftY(),
         x,                                y,
         this.getCollisionBottomRightX(),  this.getCollisionBottomRightY()
     ))
    return false;

  return true;

};


EnemyLaser.prototype._inCollisionTheta = function( x1, y1, x2, y2, baseX, baseY ) {
  var ax1 = x1 - baseX ;
  var ax2 = x2 - baseX ;
  var ay1 = y1 - baseY ;
  var ay2 = y2 - baseY ;
  var t = this._calculateTheta( this.Math.atan2( ax1 * ay2 - ax2 * ay1, ax1 * ax2 + ay1 * ay2 ) ) ;
  if( t >= 0 && t <= 90 )
    return true ;
  return false ;  
} ;


EnemyLaser.prototype.inViewArea = function( x, y ) {
  return false ;
} ;


EnemyLaser.prototype.checkViewCollision = function( e ) {
  return false ;
} ;


/**
 * TODO: temporal
 */
EnemyLaser.prototype.checkLoss = function() {
  if(this.isDead())
    return true;
  if(this.overExtendTime())
    return true;
  return false;
};


EnemyLaser.prototype.inExtendTime = function() {
  if(this.keepAlive &&
     this.count >= this.keepAlive && 
     this.count < this.keepAlive + this._EXTEND_COUNT)
    return true;
  return false;
};


EnemyLaser.prototype.overExtendTime = function() {
  if(this.keepAlive &&
     this.count >= this.keepAlive + this._EXTEND_COUNT)
    return true;
  return false;
};


function EnemyBeamFreeList(num, gameState) {
  this.parent = ElementFreeList;
  this.hFreelist = new EnemyBeamHistoryFreeList(this._HISTORY_NUM);
  this.pFreelist = new EnemyBeamPositionFreeList(this._HISTORY_NUM);
  this.parent.call(this, num, gameState);
};
__inherit(EnemyBeamFreeList, ElementFreeList);

EnemyBeamFreeList.prototype._HISTORY_NUM = 1000; 


EnemyBeamFreeList.prototype._generateElement = function( ) {
  return new EnemyBeam( this.gameState,
                        this.gameState.getWidth( ),
                        this.gameState.getHeight( ),
                        this.hFreelist,
                        this.pFreelist ) ;
} ;



function EnemyBeamDrawer(elementManager, layer, image) {
  this.parent = ElementDrawer;
  this.parent.call(this, elementManager, layer, image);
};
__inherit(EnemyBeamDrawer, ElementDrawer);


EnemyBeamDrawer.prototype._doPour = function(e) {
  return (e._ID === this.elementManager._ID_BEAM) ? true : false;
};



function EnemyBeamView(element) {
  this.parent = ElementView;
  this.parent.call(this, element);

  // TODO: temporal
  this.vertices.length = this._V_SIZE * element.historyMax;
  this.coordinates.length = this._C_SIZE * element.historyMax;
  this.indices.length = this._I_SIZE * element.historyMax;
  this.colors.length = this._A_SIZE * element.historyMax;
  this.sVertices.length = this._V_SIZE * element.historyMax;
};
__inherit(EnemyBeamView, ElementView);


/**
 * TODO: temporal.
 */
EnemyBeamView.prototype.getNum = function() {
  return this.element.p.length;
};


EnemyBeamView.prototype._initVertices = function() {
  for(var i = 0; i < this.element.p.length; i++) {
    var p = this.element.p[i];
    var o = this._V_SIZE * i;
    this.vertices[o+0]  =  p.x0;
    this.vertices[o+1]  = -p.y0;
    this.vertices[o+2]  = -1.0;
    this.vertices[o+3]  =  p.x1;
    this.vertices[o+4]  = -p.y1;
    this.vertices[o+5]  = -1.0;
    this.vertices[o+6]  =  p.x3;
    this.vertices[o+7]  = -p.y3;
    this.vertices[o+8]  = -1.0;
    this.vertices[o+9]  =  p.x2;
    this.vertices[o+10] = -p.y2;
    this.vertices[o+11] = -1.0;
  }
};


EnemyBeamView.prototype._initCoordinates = function() {
  // TODO: temporal
  var w = this.element.imageWidth/this.element.getImageWidth();
  var h = this.element.imageHeight/this.element.getImageHeight();

  var x1 = w * this.element.getImageIndexX();
  var x2 = x1 + w;
  var y = h * this.element.getImageIndexY();
  var dy = h / this.element.p.length;

  for(var i = 0; i < this.element.p.length; i++) {
    var o = this._C_SIZE * i;
    var y1 = y + dy * i;
    var y2 = y + dy * (i+1);
    // y order is reversed from the normal one.
    this.coordinates[o+0] = x1;
    this.coordinates[o+1] = y1;
    this.coordinates[o+2] = x2;
    this.coordinates[o+3] = y1;
    this.coordinates[o+4] = x2;
    this.coordinates[o+5] = y2;
    this.coordinates[o+6] = x1;
    this.coordinates[o+7] = y2;
  }
};


EnemyBeamView.prototype._initIndices = function() {
  for(var i = 0; i < this.element.p.length; i++) {
    var o = this._I_SIZE * i;
    this.indices[o+0] = 0;
    this.indices[o+1] = 1;
    this.indices[o+2] = 2;

    this.indices[o+3] = 0;
    this.indices[o+4] = 2;
    this.indices[o+5] = 3;
  }
};


EnemyBeamView.prototype._initColors = function() {
  for(var i = 0; i < this.element.p.length; i++) {
    var o = this._A_SIZE * i;
    this.colors[o+0] = 1.0;
    this.colors[o+1] = 1.0;
    this.colors[o+2] = 1.0;
    this.colors[o+3] = 1.0;

    this.colors[o+4] = 1.0;
    this.colors[o+5] = 1.0;
    this.colors[o+6] = 1.0;
    this.colors[o+7] = 1.0;

    this.colors[o+8] = 1.0;
    this.colors[o+9] = 1.0;
    this.colors[o+10] = 1.0;
    this.colors[o+11] = 1.0;

    this.colors[o+12] = 1.0;
    this.colors[o+13] = 1.0;
    this.colors[o+14] = 1.0;
    this.colors[o+15] = 1.0;
  }
};


/**
 * unnecessary to translate cuz it's already done in EnemyBeam.
 */
EnemyBeamView.prototype.translate = function() {
};


/**
 * unnecessary to rotate cuz it's already done in EnemyBeam.
 */
EnemyBeamView.prototype.rotate = function() {
};


/**
 * unnecessary to save vertices cuz translate() and rotate() do nothing.
 */
EnemyBeamView.prototype.saveVertices = function() {
};


/**
 * unnecessary to restore vertices cuz translate() and rotate() do nothing.
 */
EnemyBeamView.prototype.restoreVertices = function() {
};


EnemyBeamView.prototype.animate = function() {
  this._initVertices();
  this._initCoordinates();
  this._initIndices();
  this._initColors();
  this.a = 0.9;
};


/**
 * TODO: temporal
 * TODO: add histories, p, hFreelist and pFreelist descriptions.
 * TODO: implement checkColision().
 */
function EnemyBeam(gameState, maxX, maxY, hFreelist, pFreelist) {
  this.histories = [];
  this.p = [];
  this.hFreelist = hFreelist;
  this.pFreelist = pFreelist;
  this.historyMax = this._HISTORY_MAX;

  this.parent = Element;
  this.parent.call(this, gameState, maxX, maxY);
  this.imageWidth = this._IMAGE_WIDTH;
  this.imageHeight = this._IMAGE_HEIGHT;
}
__inherit(EnemyBeam, Element);

// only for reference
EnemyBeam.prototype.Math = Math;

EnemyBeam.prototype._WIDTH  = 16;
EnemyBeam.prototype._HEIGHT = 16;

EnemyBeam.prototype._IMAGE_WIDTH  = 20;
EnemyBeam.prototype._IMAGE_HEIGHT = 256;

EnemyBeam.prototype._HISTORY_MAX = 16;

EnemyBeam.prototype._SPAN = 1;


EnemyBeam.prototype._generateView = function() {
  return new EnemyBeamView(this);
};


__copyParentMethod(EnemyBeam, Element, 'free');
EnemyBeam.prototype.free = function() {
  this._freeHistoriesUntil(0);
  this._freePositionsUntil(0);
  this.Element_free();
};


EnemyBeam.prototype._freeHistoriesUntil = function(num) {
  while(this.histories.length > num) {
    this.hFreelist.free(this.histories[this.histories.length-1]) ;
    this.histories.length--;
  }
};


EnemyBeam.prototype._freePositionsUntil = function(num) {
  while(this.p.length > num){
    this.pFreelist.free(this.p[this.p.length-1]);
    this.p.length--;
  }
};


__copyParentMethod(EnemyBeam, Element, 'init');
EnemyBeam.prototype.init = function(params, image, enemy) {
  this.Element_init(params, image);
  this.enemy = enemy;

  // TODO: temporal
  this.width = this._WIDTH;
  this.height = this._HEIGHT;
  this.collisionWidth = this.width;
  this.collisionHeight = this.height;

  this.indexX = 1;
  this.indexY = 0;
  this.histories.length = 0;
  this.p.length = 0;
  this._initView();
};


__copyParentMethod(EnemyBeam, Element, 'runStep');
EnemyBeam.prototype.runStep = function() {
  this.Element_runStep();
  if((this.count % this._SPAN) == 0) {
    this._addHistory();
    this._freeHistoriesUntil(this.historyMax);
    this._freePositionsUntil(this.historyMax);
  }
};


EnemyBeam.prototype._addHistory = function() {

  var h = this.hFreelist.get();
  h.x = this.getX();
  h.y = this.getY();
  if(this.histories.length > 0) {
    var x1 = h.x;
    var y1 = h.y;
    var x2 = this.histories[0].x;
    var y2 = this.histories[0].y;
    var dx = x1 - x2;
    var dy = y1 - y2; 
    var rad = this.Math.atan2(dy, dx);
    var p = this.pFreelist.get();

    p.x0 = x1 - this.width/2 * this.Math.sin(rad);
    p.y0 = y1 + this.width/2 * this.Math.cos(rad);
    p.x1 = x1 + this.width/2 * this.Math.sin(rad);
    p.y1 = y1 - this.width/2 * this.Math.cos(rad);
    p.x2 = x2 - this.width/2 * this.Math.sin(rad);
    p.y2 = y2 + this.width/2 * this.Math.cos(rad);
    p.x3 = x2 + this.width/2 * this.Math.sin(rad);
    p.y3 = y2 - this.width/2 * this.Math.cos(rad);

    if(this.p.length > 0) {
      this.p[0].x0 = p.x2;
      this.p[0].y0 = p.y2;
      this.p[0].x1 = p.x3;
      this.p[0].y1 = p.y3;
    }

    this.p.unshift(p);
  }
  this.histories.unshift(h);

};


/**
 * TODO: temporal, make this function fast.
 */
EnemyBeam.prototype.display = function( surface ) {

  var height = this.imageHeight / this.histories.length ;
  var width = this.imageWidth ;

  var p = this.p ;
  for( var i = 0; i < this.histories.length - 1; i++ ) {
    var by = height * i ;

    surface.save( ) ;
/*
    surface.beginPath( ) ;
    surface.strokeStyle = 'white' ;
    surface.moveTo( p[ i ].x0, p[ i ].y0 ) ;
    surface.lineTo( p[ i ].x1, p[ i ].y1 ) ;
    surface.lineTo( p[ i ].x3, p[ i ].y3 ) ;
    surface.lineTo( p[ i ].x2, p[ i ].y2 ) ;
    surface.closePath( ) ;
    surface.clip( ) ;
//    surface.stroke( ) ;
*/
    var t1 = ( p[ i ].x1 - p[ i ].x0 ) / width ;
    var t2 = ( p[ i ].y1 - p[ i ].y0 ) / width ;
    var t3 = ( p[ i ].x2 - p[ i ].x0 ) / height ;
    var t4 = ( p[ i ].y2 - p[ i ].y0 ) / height ;
    var t5 = p[ i ].x0 ;
    var t6 = p[ i ].y0 ;
    surface.setTransform( t1, t2, t3, t4, t5, t6 ) ;

    surface.globalAlpha = 0.5 ;
    surface.drawImage( this.image,
                       width,
                       by,
                       width,
                       height,
                       0,
                       0,
                       width,
                       height ) ;

    surface.restore( ) ;


    surface.save( ) ;
/*
    surface.beginPath( ) ;
    surface.strokeStyle = 'white' ;
    surface.moveTo( p[ i ].x1, p[ i ].y1 ) ;
    surface.lineTo( p[ i ].x2, p[ i ].y2 ) ;
    surface.lineTo( p[ i ].x3, p[ i ].y3 ) ;
    surface.closePath( ) ;
    surface.clip( ) ;
//    surface.stroke( ) ;
*/
    var t1 = ( p[ i ].x3 - p[ i ].x2 ) / width ;
    var t2 = ( p[ i ].y3 - p[ i ].y2 ) / width ;
    var t3 = ( p[ i ].x3 - p[ i ].x1 ) / height ;
    var t4 = ( p[ i ].y3 - p[ i ].y1 ) / height;
    var t5 = p[ i ].x2 ;
    var t6 = p[ i ].y2 ;
    surface.setTransform( t1, t2, t3, t4, t5, t6 ) ;

    surface.globalAlpha = 0.5 ;
    surface.drawImage( this.image,
                       width,
                       by,
                       width,
                       height,
                       0,
                       0,
                       width,
                       -height ) ;

    surface.restore( ) ;

  }

} ;


/**
 * TODO: temporal
 */
EnemyBeam.prototype._outOfTheField = function( ) {
  var x = this.histories[ this.histories.length - 1 ].x ;
  var y = this.histories[ this.histories.length - 1 ].y ;
  if( x < 0 || x > this.maxX ||
      y < 0 || y > this.maxY )
    return true ;
  return false ;
} ;



function EnemyBeamHistoryFreeList( num ) {
  FreeList.call( this, num ) ;
}
__inherit( EnemyBeamHistoryFreeList, FreeList ) ;


EnemyBeamHistoryFreeList.prototype._generateElement = function( ) {
  return {
    'x0': 0.0,
    'y0': 0.0,
    'x1': 0.0,
    'y1': 0.0,
    'x2': 0.0,
    'y2': 0.0,
    'x3': 0.0,
    'y3': 0.0
  } ;
} ;



function EnemyBeamPositionFreeList( num ) {
  FreeList.call( this, num ) ;
}
__inherit( EnemyBeamPositionFreeList, FreeList ) ;


EnemyBeamPositionFreeList.prototype._generateElement = function( ) {
  return { 'x': 0.0, 'y': 0.0 } ;
} ;



// TODO: remove the followings because they complicate the design.
EnemyBulletManager.prototype._ID_BULLET = 0;
EnemyBulletManager.prototype._ID_LASER  = 1;
EnemyBulletManager.prototype._ID_BEAM   = 2;

EnemyBulletFactory.prototype.EnemyBulletManager = EnemyBulletManager.prototype;

EnemyBullet.prototype._ID = EnemyBulletManager.prototype._ID_BULLET;
EnemyLaser.prototype._ID  = EnemyBulletManager.prototype._ID_LASER;
EnemyBeam.prototype._ID   = EnemyBulletManager.prototype._ID_BEAM;

