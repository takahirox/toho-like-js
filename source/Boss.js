function BossManager( gameState, params ) {
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
__inherit( BossManager, ElementManager ) ;


BossManager.prototype._initFactory = function( ) {
  this.factory = new BossFactory( this.gameState, this.gameState.getWidth( ), this.gameState.getHeight( ) ) ;
} ;


BossManager.prototype.reset = function( ) {
  this.parent.prototype.reset.call( this ) ;
  this.index = 0 ;
  this.stageIndex = 0 ;
} ;


BossManager.prototype.goNextStage = function( ) {
  this.parent.prototype.reset.call( this ) ;
  this.index = 0 ;
  this.stageIndex++ ;
} ;


BossManager.prototype.runStep = function( ) {
  this._generateBoss( ) ;
  this.parent.prototype.runStep.call( this ) ;
} ;


BossManager.prototype._generateBoss = function( ) {
  if( this.gameState.isFlagSet( StageState._FLAG_BOSS_EXIST ) )
    return ;

  while( this.index < this.params[ this.stageIndex ].length &&
         this.params[ this.stageIndex ][ this.index ].count + this.gameState.pending <= this.gameState.count ) {
    var boss = this.factory.create( this.params[ this.stageIndex ][ this.index ] ) ;
    this.gameState.notifyBossAppeared( boss ) ;
    this.addElement( boss ) ;
    this.index++ ;
  }
} ;


/**
 * TODO: temporal. implement multi bosses?
 */
BossManager.prototype.getBoss = function( ) {
  return this.getNum( ) > 0 ? this.elements[ 0 ] : null ;
} ;


BossManager.prototype.existBoss = function( ) {
  return this.getNum( ) > 0 ? true : false ;
} ;


/**
 * TODO: temporal. I wanna use the parent method but bigger one should be the argument of this method.
 */
BossManager.prototype.checkCollisionWith = function( fighter ) {
  var self = this ;
  this.parent.prototype.checkCollisionWith.call( this, fighter,
    this._checkCollisionWithCallBack.bind( this )  ) ;
} ;


BossManager.prototype._checkCollisionWithCallBack = function( fighter, boss ) {
  fighter.die( ) ;
  this.gameState.notifyFighterDead( fighter, boss ) ;
} ;



function BossFactory( gameState, maxX, maxY ) {
  this.parent = ElementFactory ;
  this.parent.call( this, gameState, maxX, maxY ) ;
} ;
__inherit( BossFactory, ElementFactory ) ;

BossFactory._NUM = 2 ;


BossFactory.prototype._initFreelist = function( ) {
  this.freelist = new BossFreeList( BossFactory._NUM, this.gameState ) ;
} ;


BossFactory.prototype._getImage = function( params ) {
  switch( params.character ) {
    case 'rumia':
      return this.gameState.getImage( Game._IMG_ENEMY_RUMIA ) ;
    case 'chilno':
      return this.gameState.getImage( Game._IMG_ENEMY_CHILNO ) ;
    case 'daiyousei':
      return this.gameState.getImage( Game._IMG_ENEMY_DAIYOUSEI ) ;
    // TODO: temporal
    default:
      return this.gameState.getImage( Game._IMG_ENEMY_MOKOU ) ;
  }
} ;



function BossFreeList( num, gameState ) {
  this.parent = ElementFreeList ;
  this.parent.call( this, num, gameState ) ;
}
__inherit( BossFreeList, ElementFreeList ) ;


BossFreeList.prototype._generateElement = function( ) {
  return new Boss( this.gameState, this.gameState.getWidth( ), this.gameState.getHeight( ) ) ;
} ;



function Boss( gameState, maxX, maxY ) {
  this.parent = Element ;
  this.parent.call( this, gameState, maxX, maxY ) ;

  this.params = null ;
  this.index = 0 ;
  this.maxVital = 0 ;

  this.appearedTalk = null ;
  this.vanishedTalk = null ;
  this.character = null ;
  this.score = null ;
  this.dead = null ;
  this.animation = null ;
  this.spellCard = false ;
  this.effect = null ;
/*
  this.powerItem  = powerItem  ? powerItem : 0 ;
  this.lpowerItem = lpowerItem ? lpowerItem : 0 ;
  this.scoreItem  = scoreItem  ? scoreItem : 0 ;
*/

  this.shots = [ ] ;
  this.shotIndices = [ ] ;

}
__inherit( Boss, Element ) ;

Boss._WIDTH = 128 ;
Boss._HEIGHT = 128 ;

Boss._APPEAR_COUNT = 100 ;
Boss._APPEAR_WAIT_COUNT = 50 ;


Boss.prototype.init = function( params, image ) {
  this.parent.prototype.init.call( this, params, image ) ;

  this.params = params.params ;
  this.index = 0 ;
  this.maxVital = 0 ;

  this.appearedTalk = params.appearedTalk ;
  this.vanishedTalk = params.vanishedTalk ;
  this.character = params.character ;
  this.score = params.score ;
  this.dead = params.dead ;
  this.animation = params.animation ; // TODO: temporal
  this.spellCard = false ;
  this.effect = null ;

/*
  this.powerItem  = powerItem  ? powerItem : 0 ;
  this.lpowerItem = lpowerItem ? lpowerItem : 0 ;
  this.scoreItem  = scoreItem  ? scoreItem : 0 ;
*/

  this.shots.length = 0 ;
  this.shotIndices.length = 0 ;

  this._initState( ) ;
} ;


Boss.prototype.display = function( surface ) {
  surface.save( ) ;
  // TODO: temporal
  if( this.effects && this.effects[ 'vanish' ] )
    this._vanishEffect( surface, this.effects[ 'vanish' ] ) ;
  this.parent.prototype.display.call( this, surface ) ;
  surface.restore( ) ;
} ;


/**
 * TODO: temporal
 */
Boss.prototype._vanishEffect = function( surface, params ) {
//  var offset = Boss._APPEAR_COUNT + Boss._APPEAR_WAIT_COUNT ;
//  var count = ( this.count - offset - 1 ) % params[ 'baseCount' ] ;
  var count = this._getCountFromBase( params, -1 ) ;

  if( count >= params[ 'count' ] &&
      count <  params[ 'count' ] + params[ 'length' ] ) {
    surface.globalAlpha = 1.0 - ( ( count - params[ 'count' ] ) / params[ 'length' ] ) ;
  }
} ;


Boss.prototype._shot = function( ) {
  if( this.shots.length == 0 )
    return ;

  var offset = Boss._APPEAR_COUNT + Boss._APPEAR_WAIT_COUNT ;
  if( this.count < offset )
    return ;
  for( var i = 0; i < this.shots.length; i++ ) {
    var count = this.count - offset ;
    if( this.shots[ i ].baseCount )
      count = count % this.shots[ i ].baseCount ;
    if( count == 0 ) {
      this.shotIndices[ i ] = 0 ;
    }
    if( this.shotIndices[ i ] >= this.shots[ i ].shotCount.length ) {
      continue ;
    }
    if( count >= this.shots[ i ].shotCount[ this.shotIndices[ i ] ] ) {
      // TODO: temporal
      this.gameState.notifyEnemyDoShot( this, this.shots[ i ] ) ;
      this.shotIndices[ i ]++ ;
    }
  }
} ;


// TODO: temporal
Boss.prototype.runStep = function( ) {
  if( this.isFlagSet( Element._FLAG_UNHITTABLE ) && this.count + 1 >= Boss._APPEAR_COUNT + Boss._APPEAR_WAIT_COUNT ) {
    this.clearFlag( Element._FLAG_UNHITTABLE )
    if( this.index == 0 )
      this.gameState.notifyBossBeginTalk( this ) ;
    else
      this.gameState.notifyBossBecameActive( this ) ;
  }
  this._shot( ) ;
  this._doEffect( ) ;
  this.parent.prototype.runStep.call( this ) ;
  // for animation
  this._checkState( ) ;
  // TODO: temporal
  if( this.getXDirection( ) == 1 ) {
    this.indexX = 2 ;
    this.indexY = 3 ;
  } else if( this.getXDirection( ) == -1 ) {
    this.indexX = 2 ;
    this.indexY = 1 ;
  } else {
    this.indexX = 0 ;
    if( this.count % 4 == 0 ) {
      this.indexY++ ;
      if( this.indexY > this.animation )
        this.indexY = 0 ;
    }
  }
} ;


/**
 * TODO: temporal
 */
Boss.prototype._getCountFromBase = function( params, o ) {
  var o = o ? o : 0 ;
  var offset = Boss._APPEAR_COUNT + Boss._APPEAR_WAIT_COUNT ;
  return ( this.count - offset + o ) % params[ 'baseCount' ] ;
} ;


Boss.prototype._doEffect = function( ) {
  if( this.effects && this.effects[ 'shockwave' ] ) {
    // TODO: temporal
    for( var i = 0; i < this.effects[ 'shockwave' ].length; i++ ) {
      var params = this.effects[ 'shockwave' ][ i ] ;
      var count = this._getCountFromBase( params ) ;
      if( count == params[ 'count' ] )
        this.gameState.notifyDoEffect( this, 'shockwave', params.params ) ;
    }
  }
} ;


/**
 * TODO: temporal
 */
Boss.prototype._checkState = function( ) {
  if( this.vital <= 0 ) {
    this.index++ ;
    if( this.index >= this.params.length ) {
      this.die( ) ;
      this.gameState.notifyBossVanished( this ) ;
    } else {
      this.gameState.notifyBossMovedNextStage( this ) ;
      this._initState( ) ;
    }
  }
} ;


Boss.prototype._initState = function( ) {

  // TODO: temporal
  this.count = 0 ;

  // TODO: temporal
  var shots = this.params[ this.index ].s ;

  // TODO: temporal
  this.vectorIndex = 0 ;
  this.vectors.length = 0 ;
  for( var i = 0; i < this.params[ this.index ].v.length; i++ ) {
    this.vectors.push( this.params[ this.index ].v[ i ] ) ;
  }
//  this.vectors = this.params[ this.index ].v ;
  this.vectors.unshift( {
    'count': -Boss._APPEAR_WAIT_COUNT,
    'v': {
      'r':     0,
      'theta': 0,
      'w':     0,
      'ra':    0,
      'wa':    0,
      'raa':   0,
    }
  } ) ;
  this.vectors.unshift( {
    'count': 0,
    'v': {
      'r':     0,
      'theta': 0,
      'w':     0,
      'ra':    0,
      'wa':    0,
      'raa':   0,
      'target': { 'x': this.params[ this.index ].x,
                  'y': this.params[ this.index ].y,
                  'count': Boss._APPEAR_COUNT }
    }
  } ) ;
  this.baseVectorCount = Boss._APPEAR_COUNT + Boss._APPEAR_WAIT_COUNT ;

  this._initVector( ) ;

  this.shots.length = 0 ;
  if( shots == undefined ) {
  } else if( shots instanceof Array ) {
    for( var i = 0; i < shots.length; i++ )
      this.shots.push( shots[ i ] ) ;
  } else {
    shots = [ shots ] ;
    this.shots.push( shots[ 0 ] ) ;
  }

  // TODO: temporal
  this.shotIndices.length = 0 ;
  for( var i = 0; i < this.shots.length; i++ ) {
    this.shotIndices.push( 0 ) ;
  }

  this.vital = this.params[ this.index ].vital ;
  this.maxVital = this.vital ;
  this.spellCard = this.params[ this.index ].spellCard ;
  this.effects = this.params[ this.index ].e ;
  this.setFlag( Element._FLAG_UNHITTABLE ) ;
  this.gameState.notifyBossStageChanged( this ) ;

} ;


Boss.prototype.getXDirection = function( ) {
  if( this.vector && this.vector.r == 0 )
    return 0 ;
  return this.parent.prototype.getXDirection.call( this ) ;
} ;


Boss.prototype._outOfTheField = function( ) {
  if( this.parent.prototype._outOfTheField.call( this ) )
    this._beInTheField( ) ;
  return false ;
} ;



/**
 * TODO: temporal function name
 */
Boss.prototype.outOfTheField = function( ) {
  return this.parent.prototype._outOfTheField.call( this ) ;
} ;

