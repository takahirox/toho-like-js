function EnemyManager( gameState, params ) {
  this.parent = ElementManager ;
  this.parent.call( this, gameState ) ;
  for( var i = 0; i < params.length; i++ ) {
    params[ i ].sort( function( a, b ) {
      return a.count - b.count ;
    } ) ;
  }
  this.params = params ;
  this.index = 0 ;
  this.stageIndex = 0 ; // TODO: temporal
} ;
__inherit( EnemyManager, ElementManager ) ;

EnemyManager.prototype._MAX_NUM = 200;


EnemyManager.prototype._initMaxNum = function() {
  return this._MAX_NUM;
};


EnemyManager.prototype._initFactory = function( ) {
  this.factory = new EnemyFactory( this.gameState, this.gameState.getWidth( ), this.gameState.getHeight( ) ) ;
} ;


EnemyManager.prototype.initDrawer = function(layer, image) {
  this.drawer = new EnemyDrawer(this, layer,
                                this.gameState.getImage(Game._IMG_ENEMY));
};


__copyParentMethod(EnemyManager, ElementManager, 'reset');
EnemyManager.prototype.reset = function() {
  this.ElementManager_reset();
  this.index = 0;
  this.stageIndex = 0;
};


EnemyManager.prototype.goNextStage = function() {
  this.ElementManager_reset();
  this.index = 0;
  this.stageIndex++;
};


__copyParentMethod(EnemyManager, ElementManager, 'runStep');
EnemyManager.prototype.runStep = function() {
  this._generateEnemy();
  this.ElementManager_runStep();
};


EnemyManager.prototype._generateEnemy = function( ) {
  if(this.gameState.isBossExist())
    return;
  while( this.index < this.params[ this.stageIndex ].length &&
         this.params[ this.stageIndex ][ this.index ].count + this.gameState.pending <= this.gameState.count ) {
    if(! this.gameState.isBombExist())
      this.addElement( this.factory.create( this.params[ this.stageIndex ][ this.index ] ) ) ;
    this.index++ ;
  }
} ;


__copyParentMethod(EnemyManager, ElementManager, 'checkCollisionWith');
EnemyManager.prototype.checkCollisionWith = function(fighter) {
  if(fighter.isFlagSet(fighter._FLAG_UNHITTABLE))
    return;
  this.ElementManager_checkCollisionWith(null, fighter, this)
};


EnemyManager.prototype.checkCollisionWithFighters = function(fighters) {
  for(var i = 0; i < fighters.length; i++) {
    this.checkCollisionWith(fighters[i]);
  }
};


EnemyManager.prototype.notifyCollision = function(id, fighter, enemy) {
  fighter.die();
  this.gameState.notifyFighterDead(fighter, enemy);
};


/**
 * TODO: temporal
 */
EnemyManager.prototype.bomb = function( fighter ) {
  for( var i = 0; i < this.elements.length; i++ ) {
    this.elements[ i ].die( ) ;
    this.gameState.notifyEnemyVanished( null, this.elements[ i ] ) ; // TODO: null is ok?
  }
} ;



function EnemyFactory( gameState, maxX, maxY ) {
  this.parent = ElementFactory ;
  this.parent.call( this, gameState, maxX, maxY ) ;
  this.image = null; // TODO: temporal
} ;
__inherit( EnemyFactory, ElementFactory ) ;

EnemyFactory.prototype._NUM = 200 ;


EnemyFactory.prototype._initFreelist = function() {
  this.freelist = new EnemyFreeList(this._NUM, this.gameState);
};


/**
 *
 */
EnemyFactory.prototype.create = function( params ) {
  var enemy = this.freelist.get( ) ;
  enemy.init( params, this._getImage( params ) ) ;
  return enemy ;
} ;


/**
 * TODO: temporal
 */
EnemyFactory.prototype._getImage = function(params) {
  if(this.image === null)
    this.image = this.gameState.getImage(Game._IMG_ENEMY);
  return this.image;
};



function EnemyFreeList( num, gameState ) {
  this.parent = ElementFreeList ;
  this.parent.call( this, num, gameState ) ;
}
__inherit( EnemyFreeList, ElementFreeList ) ;


EnemyFreeList.prototype._generateElement = function( ) {
  return new Enemy( this.gameState, this.gameState.getWidth( ), this.gameState.getHeight( ) ) ;
} ;



function EnemyDrawer(elementManager, layer, image) {
  this.parent = ElementDrawer;
  this.parent.call(this, elementManager, layer, image);
};
__inherit(EnemyDrawer, ElementDrawer);



function EnemyView(element) {
  this.parent = ElementView;
  this.parent.call(this, element);
};
__inherit(EnemyView, ElementView);


/**
 * no rotate.
 * TODO: no rotate impl should be in parent class?
 */
EnemyView.prototype.rotate = function() {
};


EnemyView.prototype.doRotateForViewpoint = function() {
  return true;
};


EnemyView.prototype.animate = function() {
  this._initCoordinates();
};



function Enemy( gameState, maxX, maxY ) {
  this.parent = Element ;
  this.parent.call( this, gameState, maxX, maxY ) ;

  this.shots = [ ] ;

  // TODO: temporal
  this.shotIndices = [ ] ;
  this.baseShotCounts = [ ] ;
  this.endShotCounts = [ ] ;

  this.vital = null ;
  this.powerItem  = null ;
  this.lpowerItem = null ;
  this.scoreItem  = null ;
}
__inherit( Enemy, Element ) ;

Enemy.prototype._WIDTH = 32 ;
Enemy.prototype._HEIGHT = 32 ;


__copyParentMethod(Enemy, Element, 'init');
Enemy.prototype.init = function(params, image) {
  this.Element_init(params, image);

  // TODO: temporal
  this.shots.length = 0;
  if(params.s === void 0) {
//  } else if(params.s instanceof Array) {
  } else if(params.s.length !== void 0) {
    for(var i = 0; i < params.s.length; i++)
      this.shots[this.shots.length] = params.s[i];
 } else {
    this.shots[this.shots.length] = params.s;
  }

  // TODO: temporal
  this.shotIndices.length = 0;
  this.baseShotCounts.length = 0;
  this.endShotCounts.length = 0;
  for(var i = 0; i < this.shots.length; i++) {
    this.shotIndices[this.shotIndices.length] = 0;

    if(this.shots[i].baseCount !== void 0)
      this.baseShotCounts[this.baseShotCounts.length] = this.shots[i].baseCount;
    else
      this.baseShotCounts[this.baseShotCounts.length] = 0;

    if(this.shots[i].endCount !== void 0)
      this.endShotCounts[this.endShotCounts.length] = this.shots[i].endCount;
    else
      this.endShotCounts[this.endShotCounts.length] = 0;
  }

  this.width  = this._WIDTH;
  this.height = this._HEIGHT;
  this.collisionWidth  = this.width;
  this.collisionHeight = this.height;
  this.vital      = params.vital      !== void 0 ? params.vital      : 4; // TODO: temporal
  this.powerItem  = params.powerItem  !== void 0 ? params.powerItem  : 0;
  this.lpowerItem = params.lpowerItem !== void 0 ? params.lpowerItem : 0;
  this.scoreItem  = params.scoreItem  !== void 0 ? params.scoreItem  : 0;
  this._initView();
};


Enemy.prototype._generateView = function() {
  return new EnemyView(this);
};


Enemy.prototype._shot = function( ) {
  if( this.shots.length == 0 )
    return ;

  for( var i = 0; i < this.shots.length; i++ ) {
    if( this.shotIndices[ i ] >= this.shots[ i ].shotCount.length )
      continue ;
    if( this.endShotCounts[ i ] && this.count >= this.endShotCounts[ i ] )
      continue ;
    if( this.count >= this.shots[ i ].shotCount[ this.shotIndices[ i ] ] + this.baseShotCounts[ i ] ) {
      // TODO: temporal
      this.gameState.notifyEnemyDoShot( this, this.shots[ i ] ) ;
      this.shotIndices[ i ]++ ;
      if( this.shots[ i ].loop && this.shotIndices[ i ] >= this.shots[ i ].shotCount.length ) {
        this.shotIndices[ i ] = 0 ;
        this.baseShotCounts[ i ] = this.count ;
      }
    }
  }
} ;


// TODO: temporal
__copyParentMethod(Enemy, Element, 'runStep');
Enemy.prototype.runStep = function() {
  this._shot();

  this.Element_runStep();

  // for animation
  if(this.count % 5 == 0) {
    this.indexX++;
    if(this.indexX > 2)
      this.indexX = 0;
  }
};


// TODO: temporal
Enemy.prototype.isVanishingOrEscaping = function() {
  return false;
};
