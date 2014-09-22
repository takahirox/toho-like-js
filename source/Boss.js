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
  this.drawers = null;
  this.activeType = null;
} ;
__inherit( BossManager, ElementManager ) ;

BossManager.prototype._MAX_NUM = 4;

BossManager.prototype._initMaxNum = function() {
  return this._MAX_NUM;
};


BossManager.prototype._initFactory = function( ) {
  this.factory = new BossFactory( this.gameState, this.gameState.getWidth( ), this.gameState.getHeight( ) ) ;
} ;


/**
 * TODO: consider the design. To use drawers is easy to handle,
 *       but not smart. To extend BossDrawer is smarter.
 */
BossManager.prototype.initDrawer = function(layer, image) {
  this.drawers = [];
  this._generateDrawer(this.Boss._TYPE_RUMIA, layer);
  this._generateDrawer(this.Boss._TYPE_DAIYOUSEI, layer);
  this._generateDrawer(this.Boss._TYPE_CHIRNO, layer);
};


BossManager.prototype._generateDrawer = function(key, layer) {
  this.drawers[key] = new BossDrawer(this, layer, this._getImage(key));
};


/**
 * TODO: consider who should manage image.
 */
BossManager.prototype._getImage = function(type) {
  var key;
  switch(type) {
    case this.Boss._TYPE_RUMIA:
      key = Game._IMG_ENEMY_RUMIA;
      break;
    case this.Boss._TYPE_DAIYOUSEI:
      key = Game._IMG_ENEMY_DAIYOUSEI;
      break;
    case this.Boss._TYPE_CHIRNO:
      key = Game._IMG_ENEMY_CHILNO;
      break;
    // TODO: temporal
    default:
      key = Game._IMG_ENEMY_MOKOU;
      break;
  }
  return this.gameState.getImage(key);
};


__copyParentMethod(BossManager, ElementManager, 'reset');
BossManager.prototype.reset = function() {
  this.ElementManager_reset();
  this.index = 0;
  this.stageIndex = 0;
  this.activeType = null;
};


/**
 * assumes only one boss in a display.
 */
BossManager.prototype.draw = function(layer) {
  if(! this.existBoss())
    return;

  this.drawers[this.activeType].draw(layer);
};


BossManager.prototype.goNextStage = function() {
  this.ElementManager_reset(this);
  this.index = 0;
  this.stageIndex++;
};


__copyParentMethod(BossManager, ElementManager, 'runStep');
BossManager.prototype.runStep = function() {
  this._generateBoss();
  this.ElementManager_runStep();
};


BossManager.prototype._generateBoss = function() {
  if(this.gameState.isBossExist())
    return;

  while(this.index < this.params[this.stageIndex].length &&
        this.params[this.stageIndex][this.index].count
          + this.gameState.pending <= this.gameState.count) {
    var params = this.params[this.stageIndex][this.index];
    var boss = this.factory.create(params);
    this.activeType = this._str2type(params.character);
    this.gameState.notifyBossAppeared(boss);
    this.addElement(boss);
    this.index++;
  }
};


BossManager.prototype._str2type = function(str) {
  switch(str) {
    case 'rumia':
      return this.Boss._TYPE_RUMIA;
    case 'daiyousei':
      return this.Boss._TYPE_DAIYOUSEI;
    case 'chilno':
      return this.Boss._TYPE_CHIRNO;
    // TODO: temporal
    default:
      return null;
  }
};


/**
 * TODO: temporal
 */
__copyParentMethod(BossManager, ElementManager, 'checkLoss');
BossManager.prototype.checkLoss = function() {
  this.ElementManager_checkLoss(this);
};


/**
 * TODO: temporal
 */
BossManager.prototype.notifyCheckLoss = function(element) {
  if(element.dead != 'escape')
    this.gameState.notifyBossVanishEnd(element);
};


/**
 * TODO: temporal. implement multi bosses?
 */
BossManager.prototype.getBoss = function() {
  return (this.existBoss()) > 0 ? this.elements[0] : null;
};


BossManager.prototype.existBoss = function() {
  return this.getNum( ) > 0 ? true : false;
};


/**
 * TODO: temporal. I wanna use the parent method but bigger one should be the argument of this method.
 */
__copyParentMethod(BossManager, ElementManager, 'checkCollisionWith');
BossManager.prototype.checkCollisionWith = function(fighter) {
  this.ElementManager_checkCollisionWith(null, fighter, this);
};


BossManager.prototype.checkCollisionWithFighters = function(fighters) {
  for(var i = 0; i < fighters.length; i++) {
    this.checkCollisionWith(fighters[i]);
  }
};


BossManager.prototype.notifyCollision = function(id, fighter, boss) {
  fighter.die();
  this.gameState.notifyFighterDead(fighter, boss);
};



function BossFactory( gameState, maxX, maxY ) {
  this.parent = ElementFactory ;
  this.parent.call( this, gameState, maxX, maxY ) ;
} ;
__inherit( BossFactory, ElementFactory ) ;

BossFactory.prototype._NUM = 2 ;


BossFactory.prototype._initFreelist = function() {
  this.freelist = new BossFreeList(this._NUM, this.gameState);
};


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


function BossDrawer(elementManager, layer, image) {
  this.parent = ElementDrawer;
  this.parent.call(this, elementManager, layer, image);
};
__inherit(BossDrawer, ElementDrawer);



function BossView(element) {
  this.parent = ElementView;
  this.parent.call(this, element);
};
__inherit(BossView, ElementView);


/**
 * no rotate.
 * TODO: no rotate impl should be in parent class?
 */
BossView.prototype.rotate = function() {
};


BossView.prototype.doRotateForViewpoint = function() {
  return true;
};


BossView.prototype.animate = function() {
  this._initCoordinates();

  if(this.element.inVanishing()) {
    this.a = this._inVanishingEffect();
  } else if(this.element.effects && this.element.effects['vanish']) {
    this.a = this._vanishEffect(this.element.effects['vanish']);
  } else {
    this.a = 1.0;
  }
};


/**
 * TODO: temporal. especially name.
 */
BossView.prototype._inVanishingEffect = function() {
  return (this.element._VANISH_COUNT -
          this.element.vanishingCount + 1) * 0.01;
};


/**
 * TODO: temporal. especially name.
 */
BossView.prototype._vanishEffect = function(params) {
  var count = this.element._getCountFromBase(params, -1);

  if(count >= params['count'] &&
     count <  params['count'] + params['length']) {
    return 1.0 - ((count - params['count']) / params['length']) ;
  }
  return 1.0;
};



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

  this.escaping = false;

  this.vanishing = false;
  this.vanishingCount = 0;

/*
  this.powerItem  = powerItem  ? powerItem : 0 ;
  this.lpowerItem = lpowerItem ? lpowerItem : 0 ;
  this.scoreItem  = scoreItem  ? scoreItem : 0 ;
*/

  this.shots = [ ] ;
  this.shotIndices = [ ] ;

}
__inherit( Boss, Element ) ;

Boss.prototype._WIDTH = 128 ;
Boss.prototype._HEIGHT = 128 ;

Boss.prototype._APPEAR_COUNT = 100 ;
Boss.prototype._APPEAR_WAIT_COUNT = 50 ;

Boss.prototype._VANISH_COUNT = 100;

Boss.prototype._TYPE_RUMIA     = 0;
Boss.prototype._TYPE_DAIYOUSEI = 1;
Boss.prototype._TYPE_CHIRNO    = 2;

Boss.prototype._ESCAPE_VECTOR = {'r': 0, 'theta': 225, 'ra': 0.1};


__copyParentMethod(Boss, Element, 'init');
Boss.prototype.init = function(params, image) {
  this.Element_init(params, image);

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

  this.escaping = false;

  this.vanishing = false;
  this.vanishingCount = 0;

/*
  this.powerItem  = powerItem  ? powerItem : 0 ;
  this.lpowerItem = lpowerItem ? lpowerItem : 0 ;
  this.scoreItem  = scoreItem  ? scoreItem : 0 ;
*/

  this.shots.length = 0 ;
  this.shotIndices.length = 0 ;

  this._initState( ) ;
  this._initView();
} ;


Boss.prototype._generateView = function() {
  return new BossView(this);
};


Boss.prototype._shot = function( ) {
  if( this.shots.length == 0 )
    return ;

  if(this.vanishing || this.escaping)
    return;

  var offset = this._APPEAR_COUNT + this._APPEAR_WAIT_COUNT ;
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
__copyParentMethod(Boss, Element, 'runStep');
Boss.prototype.runStep = function() {
  if(this.isFlagSet(this._FLAG_UNHITTABLE) &&
     this.count + 1 >= this._APPEAR_COUNT + this._APPEAR_WAIT_COUNT) {
    this.clearFlag(this._FLAG_UNHITTABLE);
    if(this.index == 0)
      this.gameState.notifyBossBeginTalk(this);
    else
      this.gameState.notifyBossBecameActive(this);
  }
  this._shot();
  this._doEffect();

  this.Element_runStep();

  // for animation
  this._checkState();
  // TODO: temporal
  if(this.getXDirection() == 1) {
    this.indexX = 2;
    this.indexY = 3;
  } else if(this.getXDirection() == -1) {
    this.indexX = 2;
    this.indexY = 1;
  } else {
    this.indexX = 0;
    if(this.count % 4 == 0) {
      this.indexY++;
      if(this.indexY > this.animation)
        this.indexY = 0;
    }
  }

  if(this.vanishing)
    this.vanishingCount++;
};


/**
 * TODO: temporal
 */
Boss.prototype._getCountFromBase = function(params, o) {
  var o = o ? o : 0;
  var offset = this._APPEAR_COUNT + this._APPEAR_WAIT_COUNT;
  return (this.count - offset + o) % params['baseCount'];
};


Boss.prototype._doEffect = function() {
  if(this.effects && this.effects['shockwave'] !== void 0) {
    // TODO: temporal
    for(var i = 0; i < this.effects['shockwave'].length; i++) {
      var params = this.effects['shockwave'][i];
      var count = this._getCountFromBase(params);
      if(count == params['count'])
        this.gameState.notifyDoEffect(this, 'shockwave', params.params);
    }
  }
};


/**
 * TODO: temporal
 */
Boss.prototype._checkState = function() {
  if(this.vanishing || this.escaping)
    return;
  if(this.vital <= 0) {
    this.index++;
    if(this.index >= this.params.length) {
      this.die();
      this.gameState.notifyBossVanished(this);
      if(this.dead == 'escape')
        this._beginEscape();
      else
        this._beginVanish();
    } else {
      this.gameState.notifyBossMovedNextStage(this);
      this._initState();
    }
  }
};


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
    'count': -this._APPEAR_WAIT_COUNT,
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
                  'count': this._APPEAR_COUNT }
    }
  } ) ;
  this.baseVectorCount = this._APPEAR_COUNT + this._APPEAR_WAIT_COUNT ;

  this._initVector( ) ;

  this.shots.length = 0;
  if(shots === void 0) {
  } else if(shots instanceof Array) {
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
  this.setFlag( this._FLAG_UNHITTABLE ) ;
  this.gameState.notifyBossStageChanged( this ) ;

} ;


__copyParentMethod(Boss, Element, 'getXDirection');
Boss.prototype.getXDirection = function() {
  if(this.vector && this.vector.r == 0)
    return 0;
  return this.Element_getXDirection();
};


__copyParentMethod(Boss, Element, '_outOfTheField');
Boss.prototype._outOfTheField = function() {
  if(this.Element_outOfTheField())
    this._beInTheField();
  return false;
};


/**
 * TODO: temporal function name
 */
Boss.prototype.outOfTheField = function() {
  return this.Element_outOfTheField();
};


Boss.prototype._beginEscape = function() {
  this.escaping = true;
  this.gravity = null;
  // TODO: temporal
  this.vector = this.moveVectorManager.create(this._ESCAPE_VECTOR);

  // TODO: these parameters should move to EffectFactory.
  this.gameState.notifyDoEffect(this, 'shockwave', {
    'w': 5,
    'g': 5,
    'a': 0.1,
    'b': 20,
    'endCount': 100
  });
};


Boss.prototype._beginVanish = function() {
  this.vanishing = true;
  this.vanishingCount = 0;

  this.gravity = null;
  this.vector = null;

  // TODO: these parameters should move to EffectFactory.
  this.gameState.notifyDoEffect(this, 'shockwave', {
    'w': 5,
    'g': 5,
    'a': 0.1,
    'b': 10,
    'endCount': 100
  });
  this.gameState.effectManager.createBigExplosion(this);


  // TODO: who manages this logic? Boss? StageState?
  if(this.dead == 'escape' && this.vanishedTalk) {
    this.gameState.notifyBeginTalk();
  }

};


Boss.prototype.inVanishing = function() {
  return (this.vanishing && this.vanishingCount < this._VANISH_COUNT);
};


Boss.prototype.overVanishing = function() {
  return (this.vanishing && this.vanishingCount >= this._VANISH_COUNT);
};


/**
 * TODO: temporal workaround.
 */
__copyParentMethod(Boss, Element, '_checkVectorChange');
Boss.prototype._checkVectorChange = function() {
  if(this.escaping || this.vanishing)
    return false;
  return this.Element_checkVectorChange();
};


/**
 * TODO: temporal logic.
 */
__copyParentMethod(Boss, Element, 'checkLoss');
Boss.prototype.checkLoss = function() {
  if(this.escaping)
    return this.Element_outOfTheField();

  if(! this.vanishing)
    return this.Element_checkLoss();

  var tmp = this.state;
  this.state = this._STATE_ALIVE;
  var value = this.Element_checkLoss();
  this.state = tmp;

  if(value)
    return value;

  return this.overVanishing();
};


// TODO: temporal
Boss.prototype.isVanishingOrEscaping = function() {
  return (this.vanishing || this.escaping);
};



// TODO: remove the followings because they complicate the design.

// only for reference
// TODO: temporal
BossManager.prototype.Boss = Boss.prototype;

