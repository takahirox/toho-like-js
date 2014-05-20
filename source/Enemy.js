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


EnemyManager.prototype._initFactory = function( ) {
  this.factory = new EnemyFactory( this.gameState, this.gameState.getWidth( ), this.gameState.getHeight( ) ) ;
} ;


EnemyManager.prototype.reset = function( ) {
  this.parent.prototype.reset.call( this ) ;
  this.index = 0 ;
  this.stageIndex = 0 ;
} ;


EnemyManager.prototype.goNextStage = function( ) {
  this.parent.prototype.reset.call( this ) ;
  this.index = 0 ;
  this.stageIndex++ ;
} ;


EnemyManager.prototype.runStep = function( ) {
  this._generateEnemy( ) ;
  this.parent.prototype.runStep.call( this ) ;
} ;


EnemyManager.prototype._generateEnemy = function( ) {
  if( this.gameState.isFlagSet( StageState._FLAG_BOSS_EXIST ) )
    return ;
  while( this.index < this.params[ this.stageIndex ].length &&
         this.params[ this.stageIndex ][ this.index ].count + this.gameState.pending <= this.gameState.count ) {
    if( ! this.gameState.isFlagSet( StageState._FLAG_BOMB ) ) // TODO: temporal
      this.addElement( this.factory.create( this.params[ this.stageIndex ][ this.index ] ) ) ;
    this.index++ ;
  }
} ;


EnemyManager.prototype.checkCollisionWith = function( fighter ) {
  if( fighter.isFlagSet( Element._FLAG_UNHITTABLE ) )
    return ;

  var self = this ;
  this.parent.prototype.checkCollisionWith.call( this, fighter,
    this._checkCollisionWithCallBack.bind( this ), true ) ;
} ;


EnemyManager.prototype._checkCollisionWithCallBack = function( fighter, enemy ) {
  fighter.die( ) ;
  this.gameState.notifyFighterDead( fighter, enemy ) ;
} ;


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
} ;
__inherit( EnemyFactory, ElementFactory ) ;

EnemyFactory._NUM = 200 ;


EnemyFactory.prototype._initFreelist = function( ) {
  this.freelist = new EnemyFreeList( EnemyFactory._NUM, this.gameState ) ;
} ;


/**
 *
 */
EnemyFactory.prototype.create = function( params ) {
  var enemy = this.freelist.get( ) ;
  enemy.init( params, this._getImage( params ) ) ;
  return enemy ;
} ;


EnemyFactory.prototype._getImage = function( params ) {
  return this.gameState.getImage( Game._IMG_ENEMY ) ;
} ;



function EnemyFreeList( num, gameState ) {
  this.parent = ElementFreeList ;
  this.parent.call( this, num, gameState ) ;
}
__inherit( EnemyFreeList, ElementFreeList ) ;


EnemyFreeList.prototype._generateElement = function( ) {
  return new Enemy( this.gameState, this.gameState.getWidth( ), this.gameState.getHeight( ) ) ;
} ;



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

Enemy._WIDTH = 32 ;
Enemy._HEIGHT = 32 ;


Enemy.prototype.init = function( params, image ) {
  this.parent.prototype.init.call( this, params, image ) ;

  // TODO: temporal
  this.shots.length = 0 ;
  if( params.s == undefined ) {
  } else if( params.s instanceof Array ) {
    for( var i = 0; i < params.s.length; i++ )
      this.shots.push( params.s[ i ] ) ;
 } else {
    this.shots.push( params.s ) ;
  }

  // TODO: temporal
  this.shotIndices.length = 0 ;
  this.baseShotCounts.length = 0 ;
  this.endShotCounts.length = 0 ;
  for( var i = 0; i < this.shots.length; i++ ) {
    this.shotIndices.push( 0 ) ;
    if( this.shots[ i ].baseCount )
      this.baseShotCounts.push( this.shots[ i ].baseCount ) ;
    else
      this.baseShotCounts.push( 0 ) ;
    if( this.shots[ i ].endCount )
      this.endShotCounts.push( this.shots[ i ].endCount ) ;
    else
      this.endShotCounts.push( 0 ) ;
  }

  this.width  = Enemy._WIDTH ;
  this.height = Enemy._HEIGHT ;
  this.collisionWidth  = this.width ;
  this.collisionHeight = this.height ;
  this.vital      = params.vital      != undefined ? params.vital      : 4 ; // TODO: temporal
  this.powerItem  = params.powerItem  != undefined ? params.powerItem  : 0 ;
  this.lpowerItem = params.lpowerItem != undefined ? params.lpowerItem : 0 ;
  this.scoreItem  = params.scoreItem  != undefined ? params.scoreItem  : 0 ;
} ;


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
Enemy.prototype.runStep = function( ) {
  this._shot( ) ;
  // for animation
  this.parent.prototype.runStep.call( this ) ;
  if( this.count % 5 == 0 ) {
    this.indexX++ ;
    if( this.indexX > 2 )
      this.indexX = 0 ;
  }
} ;
