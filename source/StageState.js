function StageState( game ) {
  this.parent = GameState ;
  this.parent.call( this, game ) ;

  this.fighter              = null ;
  this.fighterManager       = null;
  this.fighterOptionManager = null ;
  this.bulletManager        = null ;
  this.bombManager          = null ;
  this.enemyManager         = null ;
  this.enemyBulletManager   = null ;
  this.vanishedEnemyManager = null ;
  this.effectManager        = null ;
  this.bossManager          = null ;
  this.itemManager          = null ;
  this.spellCardManager     = null ;
  this.spellCard            = null ;
  this.backgroundManager    = null;

  this.params = __stageParams ; // TODO: temporal
  this.stageIndex = 0 ;
  this.count = 0 ;
  this.animationCount = 0 ;
  this.replayCount = 0 ;
  this.oldTime = 0 ;
  this.graze = 0;
  this.score = 0 ;
  this.viewScore = 0 ;
  this.players = 3 ;
  this.bombs = 2 ;
  this.bombCount = 0 ;
  this.bossSpellCount = 0 ;
  this.pending = 0 ;
  this.bgScale = 1 ;
  this.didContinue = false ;

  this.initialized = false ; // TODO: temporal
  this.playRecords = [ ] ;
  this.autoplayIndex = 0 ;
  this.autoplayParams = [ ] ;
  this.baseCharacterIndex = 0 ;
  this.seed = null ;

  this.state = StageState._STATE_SHOOTING ;
//  this.state = StageState._STATE_TALK ;
//  this.state = StageState._STATE_CLEAR ;

  this.states = [ ] ;
  this.states[ StageState._STATE_SHOOTING ]  = new ShootingState( this ) ;
  this.states[ StageState._STATE_TALK ]      = new TalkState( this ) ;
  this.states[ StageState._STATE_CLEAR ]     = new ClearState( this ) ;
  this.states[ StageState._STATE_GAME_OVER ] = new GameOverState( this ) ;

}
__inherit( StageState, GameState ) ;


StageState._FLAG_FIGHTER_DEAD    =    0x1 ;
StageState._FLAG_BOSS_EXIST      =    0x2 ;
StageState._FLAG_BOSS_SPELLCARD  =    0x4 ;
StageState._FLAG_BOMB            =    0x8 ;
StageState._FLAG_STAGE_TITLE     =   0x10 ;
StageState._FLAG_SE_ENEMY_DAMAGE =   0x20 ;
StageState._FLAG_SE_ENEMY_VANISH =   0x40 ;
StageState._FLAG_SE_SHOT         =   0x80 ;
StageState._FLAG_SE_ENEMY_SHOT   =  0x100 ;
StageState._FLAG_SE_DEAD         =  0x200 ;
StageState._FLAG_SE_GRAZE        =  0x400 ;
StageState._FLAG_SE_POWERUP      =  0x800 ;
StageState._FLAG_SE_POWER_EFFECT = 0x1000 ;
StageState._FLAG_AUTO_PLAY       = 0x2000 ;

StageState._BOMB_SPAN = 100 ;
StageState._BOSS_SPELL_SPAN = 100 ;
StageState._STAGE_TITLE_SPAN = 300 ;

StageState._STATE_SHOOTING  = 0x1 ;
StageState._STATE_TALK      = 0x2 ;
StageState._STATE_CLEAR     = 0x3 ;
StageState._STATE_GAME_OVER = 0x4 ;


StageState.prototype.init = function( params ) {
  this.state = StageState._STATE_SHOOTING ;
  if( ! this.initialized ) {
    this._initBackground();
    this._initFighter( ) ;
    this._initEnemies( ) ;
    this._initBullets( ) ;
    this._initBomb( ) ;
    this._initEnemyBullets( ) ;
    this._initItems( ) ;
    this._initSpellCards( ) ;
    this.initialized = true ;
  } else {
    this.reset( ) ;
  }
  if( params.autoplay ) {
    this.setFlag( StageState._FLAG_AUTO_PLAY ) ;
    this.autoplayParams = params.autoplayParams.params ;
    this.seed = params.autoplayParams.seed ;
    this.baseCharacterIndex = params.autoplayParams.characterIndex ;
  } else {
    this.clearFlag( StageState._FLAG_AUTO_PLAY ) ;
    this.seed = ( new Date( ) ).getTime( ) & 0xffff ;
    this.baseCharacterIndex = params.characterIndex ;
  }
  this.fighter.setCharacterIndex( this.baseCharacterIndex ) ;
  Math.seed( this.seed ) ;
  this._soundBGM( Game._BGM_1 ) ;
} ;


StageState.prototype._initBackground = function() {
  this.backgroundManager = new BackgroundManager(this);
  this.backgroundManager.initDrawer(this.game.bgLayer, null);
};

/**
 * TODO: temporal
 */
StageState.prototype._initFighter = function() {
  this.fighterManager = new FighterManager(this);
  this.fighterManager.initDrawer(this.game.bgLayer, null);

 // TODO: temporal
  this.fighter = this.fighterManager.getFighter();

  this.fighterOptionManager = new FighterOptionManager(this, this.fighter);
  this.fighterOptionManager.initDrawer(this.game.bgLayer, null);
};


StageState.prototype._initEnemies = function( ) {
  this.enemyManager         = new EnemyManager( this, __enemiesParams ) ;
  this.vanishedEnemyManager = new VanishedEnemyManager( this ) ;
  this.bossManager          = new BossManager( this, __bossesParams ) ;
  this.effectManager        = new EffectManager( this ) ;

  this.enemyManager.initDrawer(this.game.bgLayer, null);
  this.bossManager.initDrawer(this.game.bgLayer, null);
} ;


StageState.prototype._initBullets = function() {
  this.bulletManager = new BulletManager(this, __bulletsParams);
  this.bulletManager.initDrawer(this.game.bgLayer, null);
};


StageState.prototype._initBomb = function( ) {
  this.bombManager = new BombManager( this ) ;
} ;


StageState.prototype._initEnemyBullets = function() {
  this.enemyBulletManager = new EnemyBulletManager(this, __enemyBulletsParams);
  this.enemyBulletManager.initDrawer(this.game.bgLayer, null);
};


StageState.prototype._initItems = function() {
  this.itemManager = new ItemManager(this);
  this.itemManager.initDrawer(this.game.bgLayer, null);
};


StageState.prototype._initSpellCards = function( ) {
  this.spellCardManager = new SpellCardManager( this ) ;
} ;


StageState.prototype.runStep = function( ) {
  if( this.isFlagSet( StageState._FLAG_AUTO_PLAY ) &&
      this.autoplayIndex < this.autoplayParams.length ) {
    this._actAsRecord( ) ;
  }
  this.replayCount++ ;

  // TODO: temporal
  if( this.state == StageState._STATE_SHOOTING ) {
    this._updateBGScale( ) ;

    this.enemyManager.runStep( ) ;
    this.vanishedEnemyManager.runStep( ) ;
    this.effectManager.runStep( ) ;
    this.bossManager.runStep( ) ;
    this.enemyBulletManager.runStep( ) ;
    this.itemManager.runStep( ) ;
    this.fighter.runStep( ) ;
    this.fighterOptionManager.runStep( ) ;
    this.bulletManager.runStep( ) ;
    this.bombManager.runStep( ) ;
    this.spellCardManager.runStep( ) ;

    this.enemyBulletManager.checkGrazeWith(this.fighter);

    this.bulletManager.checkCollisionWithEnemies( this.enemyManager.elements ) ;
    this.enemyManager.checkCollisionWith( this.fighter ) ;
    this.enemyBulletManager.checkCollisionWith( this.fighter ) ;
    this.itemManager.checkCollisionWith( this.fighter ) ;
    if( this.bossManager.existBoss( ) ) {
      this.bulletManager.checkCollisionWithBoss( this.bossManager.getBoss( ) ) ;
      this.bossManager.checkCollisionWith( this.fighter ) ;
    }

    this.enemyManager.checkLoss( ) ;
    this.vanishedEnemyManager.checkLoss( ) ;
    this.effectManager.checkLoss( ) ;
    this.bulletManager.checkLoss( ) ;
    this.bombManager.checkLoss( ) ;
    this.enemyBulletManager.checkLoss( ) ;
    this.itemManager.checkLoss( ) ;
    this.bossManager.checkLoss( ) ;
    this.spellCardManager.checkLoss( ) ;

    this._soundEffectDependsOnFlag( ) ;

    // TODO: temporal
    if( this.isFlagSet( StageState._FLAG_FIGHTER_DEAD ) &&
        ! this.fighter.isFlagSet( Element._FLAG_UNHITTABLE ) )
      this.clearFlag( StageState._FLAG_FIGHTER_DEAD ) ;
    if( this.isFlagSet( StageState._FLAG_BOMB ) &&
        this.count > this.bombCount + StageState._BOMB_SPAN )
      this.clearFlag( StageState._FLAG_BOMB ) ;

    // TODO: temporal
    if( this.isFlagSet( StageState._FLAG_BOSS_SPELLCARD ) &&
        this.count > this.bossSpellCount + StageState._BOSS_SPELL_SPAN )
      this.clearFlag( StageState._FLAG_BOSS_SPELLCARD ) ;

    if( this.isFlagSet( StageState._FLAG_BOSS_EXIST ) )
      this.pending++ ;

    if( this.count < StageState._STAGE_TITLE_SPAN ) {
      this.setFlag( StageState._FLAG_STAGE_TITLE ) ;
    } else {
      this.clearFlag( StageState._FLAG_STAGE_TITLE ) ;
    }
  }

  if(this.score > this.viewScore) {
    this.viewScore += 1000;
    if(this.viewScore > this.score)
      this.viewScore = this.score;
  }
  this.states[ this.state ].runStep( ) ;
  this.backgroundManager.runStep();

  this.animationCount++ ;

  // TODO: temporal
  // this member should be moved to ShootingState?
  if( this.state == StageState._STATE_SHOOTING ) {
    this.count++ ;
  }

} ;


/**
 * TODO: temporal. Should be in Background?
 */
StageState.prototype._updateBGScale = function( ) {
  if( ! this.params[ this.stageIndex ].bgScale )
    return ;
  if( this.isFlagSet( StageState._FLAG_BOSS_EXIST ) )
    return ;

  for( var i = 0; i < this.params[ this.stageIndex ].bgScale.length; i++ ) {
    var value = this.params[ this.stageIndex ].bgScale[ i ] ;
    if( this.count >= value.beginCount + this.pending &&
        this.count <  value.endCount   + this.pending ) {
      if( value.a )
        this.bgScale = value.a ;
      if( value.d )
        this.bgScale += value.d ;
    }
  }
} ;


/**
 * TODO: temporal
 */
StageState.prototype._soundEffectDependsOnFlag = function( ) {
  if( this.isFlagSet( StageState._FLAG_SE_ENEMY_VANISH ) ) {
    this._soundEffect( Game._SE_ENEMY_VANISH ) ;
    this.clearFlag( StageState._FLAG_SE_ENEMY_VANISH ) ;
    if( this.isFlagSet( StageState._FLAG_SE_ENEMY_DAMAGE ) ) {
      this.clearFlag( StageState._FLAG_SE_ENEMY_DAMAGE ) ;
    }
  }
  if( this.isFlagSet( StageState._FLAG_SE_ENEMY_DAMAGE ) ) {
    this._soundEffect( Game._SE_ENEMY_DAMAGE ) ;
    this.clearFlag( StageState._FLAG_SE_ENEMY_DAMAGE ) ;
  }
  if( this.isFlagSet( StageState._FLAG_SE_SHOT ) ) {
    this._soundEffect( Game._SE_SHOT ) ;
    this.clearFlag( StageState._FLAG_SE_SHOT ) ;
  }
  if( this.isFlagSet( StageState._FLAG_SE_ENEMY_SHOT ) ) {
    this._soundEffect( Game._SE_ENEMY_SHOT ) ;
    this.clearFlag( StageState._FLAG_SE_ENEMY_SHOT ) ;
  }
  if( this.isFlagSet( StageState._FLAG_SE_DEAD ) ) {
    this._soundEffect( Game._SE_DEAD ) ;
    this.clearFlag( StageState._FLAG_SE_DEAD ) ;
  }
  if( this.isFlagSet( StageState._FLAG_SE_GRAZE ) ) {
    this._soundEffect( Game._SE_GRAZE ) ;
    this.clearFlag( StageState._FLAG_SE_GRAZE ) ;
  }
  if( this.isFlagSet( StageState._FLAG_SE_POWERUP ) ) {
    this._soundEffect( Game._SE_POWERUP ) ;
    this.clearFlag( StageState._FLAG_SE_POWERUP ) ;
  }
  if( this.isFlagSet( StageState._FLAG_SE_POWER_EFFECT ) ) {
    this._soundEffect( Game._SE_POWER_EFFECT ) ;
    this.clearFlag( StageState._FLAG_SE_POWER_EFFECT ) ;
  }
} ;


/**
 * Order is important.
 */
StageState.prototype.updateDisplay = function( surface ) {
  this.game.clear( surface ) ;
  this.game.bgLayer.clear();
  this._displayBG();
  this._displayElements( surface ) ;
  this._displayBossVital( surface ) ;
  this._displayStageTitle( surface ) ;

  this.states[ this.state ].updateDisplay( surface ) ;

  this._drawSide( surface ) ;

} ;


/**
 * TODO: temporal
 */
StageState.prototype._displayBG = function() {
  var darken = false;
  if(this.isFlagSet(StageState._FLAG_BOMB) || this.spellCard) {
    darken = true;
  }
  this.backgroundManager.draw(this.game.bgLayer, darken);
};


StageState.prototype._displayBossVital = function( surface ) {
  if( ! this.isFlagSet( StageState._FLAG_BOSS_EXIST ) )
    return ;

  surface.save( ) ;
  surface.fillStyle = 'rgb( 255, 255, 255 )' ;
//  surface.globalAlpha = 0.2 ;
//  surface.fillRect( 50, 15, 380 * 1, 5 ) ;
  surface.globalAlpha = 0.8 ;
  surface.fillRect( 50, 15, 380 * this.bossManager.getBoss( ).vital / this.bossManager.getBoss( ).maxVital, 5 ) ;

  // TODO: temporal
  if( this.spellCard ) {
    surface.fillStyle = 'rgb( 0, 0, 0 )' ;
    surface.globalAlpha = 0.4 ;
    surface.fillRect( 50, 22, 380, 24 ) ;
    surface.fillStyle = 'rgb( 255, 255, 255 )' ;
    surface.textAlign = 'right' ;
    surface.textBaseAlign = 'middle' ;
    surface.font = '16px Arial' ;
    surface.globalAlpha = 0.8 ;
    surface.fillText( 'Spell Card: ' + this.spellCard, 420, 40 ) ;
  }

  surface.restore( ) ;
} ;


/**
 * The order is important.
 */
StageState.prototype._displayElements = function( surface ) {
  this.bulletManager.draw(this.game.bgLayer);
  this.fighterManager.draw(this.game.bgLayer);
  this.fighterOptionManager.draw(this.game.bgLayer);
  this.bombManager.display( surface ) ;
  this.enemyManager.draw(this.game.bgLayer);
  this.bossManager.draw(this.game.bgLayer);
  this.vanishedEnemyManager.display( surface ) ;
  this.effectManager.display( surface ) ;
  this.enemyBulletManager.draw(this.game.bgLayer);
  this.itemManager.draw(this.game.bgLayer);
  this.spellCardManager.display( surface ) ;
} ;


StageState.prototype._displayStageTitle = function( surface ) {
  if( ! this.isFlagSet( StageState._FLAG_STAGE_TITLE ) )
    return ;

  surface.save( ) ;

  var alpha = 1.0 ;
  if( this.count < 100 )
    alpha = 0.01 * this.count ;
  else if( this.count > StageState._STAGE_TITLE_SPAN - 100 )
    alpha = 0.01 * ( StageState._STAGE_TITLE_SPAN - this.count ) ;

  surface.fillStyle = 'rgb( 0, 0, 0 )' ;
  surface.globalAlpha = alpha * 0.2 ;
  surface.fillRect( 0, 170, 480, 100 ) ;

  surface.globalAlpha = alpha ;
  surface.fillStyle = 'rgb( 255, 255, 255 )' ;
  surface.textAlign = 'left' ;
  surface.font = '16px Arial' ;
  surface.fillText( 'Stage' + ( this.stageIndex + 1 ), 100, 210 ) ;
  surface.textAlign = 'right' ;
  surface.fillText( this.params[ this.stageIndex ].title, 380, 250 ) ;
  surface.fillRect( 100, 225, 280, 1 ) ;
  surface.restore( ) ;
} ;


/**
 * TODO: remove strings?
 */
StageState.prototype._drawSide = function(surface) {
  surface.save();
  surface.fillStyle = 'rgb(0, 0, 0)' ;
  surface.fillRect(this.getWidth(), 0, Game._SIDE_WIDTH, this.getHeight());
  surface.fillStyle = 'rgb(255, 255, 255)';
  surface.fillRect(this.getWidth(), 0, 2, this.getHeight());
  surface.drawImage(this._getFaceImage(), this.getWidth() + 30, 330, 100, 100);

  surface.font = '16px Arial';
  surface.fillText('Toho-like STG JS', this.getWidth( ) + 15, 50);
  surface.fillText('for debug', this.getWidth( ) + 15, 200);

  surface.textAlign = 'right';
  surface.fillText('Score:', this.getWidth() + 70,  80);
  surface.fillText(this.viewScore, this.getWidth() + 140,  80);
  surface.fillText('Power:', this.getWidth() + 70, 100);
  surface.fillText(this.fighter.getPower(), this.getWidth() + 140, 100);
  surface.fillText('Graze:', this.getWidth() + 70, 120);
  surface.fillText(this.graze, this.getWidth() + 140, 120);
  surface.fillText('Players:', this.getWidth() + 70, 140);
  surface.fillText(this.players, this.getWidth() + 140, 140);
  surface.fillText('Bomb:', this.getWidth() + 70, 160);
  surface.fillText(this.bombs, this.getWidth() + 140, 160);

  surface.fillText(this.count, this.getWidth() + 80, 220);
  surface.fillText(this.bulletManager.getNum(), this.getWidth() + 80, 240);
  surface.fillText(this.enemyManager.getNum(), this.getWidth() + 80, 260);
  surface.fillText(this.enemyBulletManager.getNum(), this.getWidth() + 80, 280);
  surface.fillText(this.itemManager.getNum(), this.getWidth() + 80, 300);

  surface.fillText(parseInt(this.bgScale*1000), this.getWidth() + 140, 220);
  surface.fillText(this.vanishedEnemyManager.getNum(), this.getWidth() + 140, 240);
  surface.fillText(this.effectManager.getNum(), this.getWidth() + 140, 260);

  surface.restore();
};


StageState.prototype._getFaceImage = function( ) {
  switch( this.fighter.characterIndex ) {
    case 0:
      if( this.isFlagSet( StageState._FLAG_BOMB ) )
        return this.getImage( Game._IMG_REIMU_FACE_4 ) ;
      if( this.isFlagSet( StageState._FLAG_FIGHTER_DEAD ) )
        return this.getImage( Game._IMG_REIMU_FACE_3 ) ;
      if( this.fighter.isFlagSet( Element._FLAG_SHOT ) )
        return this.getImage( Game._IMG_REIMU_FACE_2 ) ;
      return this.getImage( Game._IMG_REIMU_FACE_1 ) ;
//    case 1:
    default:
      if( this.isFlagSet( StageState._FLAG_BOMB ) )
        return this.getImage( Game._IMG_MARISA_FACE_4 ) ;
      if( this.isFlagSet( StageState._FLAG_FIGHTER_DEAD ) )
        return this.getImage( Game._IMG_MARISA_FACE_3 ) ;
      if( this.fighter.isFlagSet( Element._FLAG_SHOT ) )
        return this.getImage( Game._IMG_MARISA_FACE_2 ) ;
      return this.getImage( Game._IMG_MARISA_FACE_1 ) ;
  }
} ;


StageState.prototype.handleKeyDown = function( e ) {
  if( this.isFlagSet( StageState._FLAG_AUTO_PLAY ) )
    return ;
  this.states[ this.state ].handleKeyDown( e ) ;
} ;


StageState.prototype.handleKeyUp = function( e ) {
  if( this.isFlagSet( StageState._FLAG_AUTO_PLAY ) )
    return ;
  this.states[ this.state ].handleKeyUp( e ) ;
} ;


/**
 * TODO: temporal
 */
StageState.prototype._actAsRecord = function( ) {
  while( this.replayCount >= this.autoplayParams[ this.autoplayIndex ].count ) {
    for( var key in this.autoplayParams[ this.autoplayIndex ] ) {
      if( key == 'count' )
        continue ;
      var e = { } ;
      e.keyCode = this._toCharCode( key ) ;
      if( this.autoplayParams[ this.autoplayIndex ][ key ] ) {
        this.states[ this.state ].handleKeyDown( e ) ;
      } else {
        this.states[ this.state ].handleKeyUp( e ) ;
      }
    }
    this.autoplayIndex++ ;
    if( this.autoplayIndex >= this.autoplayParams.length )
      break ;
  }
} ;


StageState.prototype._toCharCode = function( str ) {
  switch( str ) {
    case 's':
      return 16 ;
    case 'sp':
      return 32 ;
    case 'l':
      return 37 ;
    case 'u':
      return 38 ;
    case 'r':
      return 39 ;
    case 'd':
      return 40 ;
    case 'x':
      return 88 ;
    case 'z':
      return 90 ;
//    default:
//      throw Error( ) ;
  }
} ;


/**
 * TODO: temporal
 */
StageState.prototype.reset = function( ) {

  this.stageIndex = 0 ;
  this.count = 0 ;
  this.animationCount = 0 ;
  this.replayCount = 0 ;
  this.oldTime = 0 ;
  this.graze = 0;
  this.score = 0 ;
  this.viewScore = 0 ;
  this.players = 3 ;
  this.bombs = 2 ;
  this.bombCount = 0 ;
  this.bossSpellCount = 0 ;
  this.pending = 0 ;
  this.bgScale = 1 ;

  this.playRecords = [ ] ;
  this.autoplayIndex = 0 ;

  this.spellCard = null ;
  this.didContinue = false ;

  this.fighter.reset( ) ;
  this.fighterOptionManager.reset( ) ;
  this.enemyManager.reset( ) ;
  this.vanishedEnemyManager.reset( ) ;
  this.effectManager.reset( ) ;
  this.bossManager.reset( ) ;
  this.bombManager.reset( ) ;
  this.bulletManager.reset( ) ;
  this.enemyBulletManager.reset( ) ;
  this.effectManager.reset( ) ;
  this.itemManager.reset( ) ;
  this.spellCardManager.reset( ) ;
  this.backgroundManager.reset();

  this.fighter.beDefaultPosition( ) ;

  this.states[ StageState._STATE_TALK ].reset( ) ; // TODO: temporal


  this.flags = 0 ;

} ;


/**
 * @param record Array
 */
StageState.prototype.putKeyOnRecord = function( record ) {
  if( this.didContinue )
    return ;
  var h = { 'count': this.replayCount } ;
  for( var i = 0; i < record.length; i++ )
    h[ record[ i ] ] = true ;
  this.playRecords.push( h ) ;
} ;


/**
 * @param record Array
 */
StageState.prototype.putKeyOffRecord = function( record ) {
  if( this.didContinue )
    return ;
  var h = { 'count': this.replayCount } ;
  for( var i = 0; i < record.length; i++ )
    h[ record[ i ] ] = false ;
  this.playRecords.push( h ) ;
} ;


/**
 * TODO: temporal
 */
StageState.prototype.exportPlayRecord = function( ) {
  var params = { } ;
  params.characterIndex = this.baseCharacterIndex ;
  params.seed = this.seed ;
  params.user = 'user' ; // TODO: temporal
  params.datetime = new Date( ).getTime( ) ;

  var buffer = '' ;
  buffer += '[\n' ;
  for( var i = 0; i < this.playRecords.length; i++ ) {
    var b = '{' ;
    var initialized = false ;
    for( var key in this.playRecords[ i ] ) {
      if( initialized )
        b += ', ' ;
      b += '"' + key + '": ' + this.playRecords[ i ][ key ] ;
      initialized = true ;
    }
    b += '}' ;
    buffer += '    ' + b ;
    if( i != this.playRecords.length - 1 )
      buffer += ',\n' ;
    else
      buffer += '\n' ;
  }
  buffer += ']' ;

  params.params = buffer ;
  return params ;
} ;


StageState.prototype.notifyFighterGotPowerItem = function( fighter, item ) {
  this.setFlag( StageState._FLAG_SE_GRAZE ) ;
  this.score += 100 ;
  fighter.incrementPower( 1 ) ;
} ;


StageState.prototype.notifyFighterGotScoreItem = function( fighter, item ) {
  this.setFlag( StageState._FLAG_SE_GRAZE ) ;
  this.score += 1000 ;
} ;


StageState.prototype.notifyFighterPowerUp = function( ) {
  this.setFlag( StageState._FLAG_SE_POWERUP ) ;
} ;


StageState.prototype.notifyFighterDoShot = function( fighter ) {
  if( this.count % 5 != 0 )
    return ;

  this.bulletManager.create( fighter ) ;
  this.setFlag( StageState._FLAG_SE_SHOT ) ;
} ;


StageState.prototype.notifyEnemyDoShot = function( enemy, shot ) {
  this.enemyBulletManager.create( enemy, shot ) ;
} ;


StageState.prototype.notifyEnemyDidShot = function( enemy, shot ) {
  if( ! this.isFlagSet( StageState._FLAG_BOMB ) &&
      ! this.isFlagSet( StageState._FLAG_BOSS_SPELLCARD ) )
    this.setFlag( StageState._FLAG_SE_ENEMY_SHOT ) ;
} ;


StageState.prototype.notifyBulletHit = function( bullet, enemy ) {
  this.vanishedEnemyManager.createDamageEffect( enemy ) ;
  this.setFlag( StageState._FLAG_SE_ENEMY_DAMAGE ) ;
  this.score += 10 ;
} ;


StageState.prototype.notifyGraze = function(fighter, bullet) {
  this.setFlag(StageState._FLAG_SE_GRAZE);
  this.graze += 1;
  bullet.graze -= 1; // TODO: should be in EnemyBullet?
  this.score += 100;
  this.effectManager.createGraze(fighter, bullet);
};


/**
 * TODO: temporal
 */
StageState.prototype.notifyFighterDoBomb = function( fighter ) {
  if( this.bombs <= 0 )
    return ;
  if( this.isFlagSet( StageState._FLAG_BOMB ) )
    return ;
  this.bombs-- ;
  this.bombCount = this.count ;
  this.setFlag( StageState._FLAG_BOMB ) ;
  this.enemyManager.bomb( fighter ) ;
  this.enemyBulletManager.bomb( fighter ) ;
  this.itemManager.beHomingAll( fighter ) ;
  this.spellCardManager.create( fighter ) ;
  this.bombManager.create( fighter ) ;
  this.setFlag( StageState._FLAG_SE_POWER_EFFECT ) ;
} ;


StageState.prototype.notifyEnemyVanished = function( bullet, enemy ) {
  this.setFlag( StageState._FLAG_SE_ENEMY_VANISH ) ;
  // TODO: temporal
  if( enemy.powerItem )
    this.itemManager.create( enemy, Item._TYPE_POWER ) ;
  else if( enemy.scoreItem )
    this.itemManager.create( enemy, Item._TYPE_SCORE ) ;
  this.vanishedEnemyManager.create( enemy ) ;
  this.notifyDoEffect( enemy, 'shockwave', null ) ;
  this.score += 100 ;
} ;


StageState.prototype.notifyBossVanished = function( boss ) {
  this.enemyBulletManager.beItem( ) ;
//  this.enemyBulletManager.removeBulletsOfEnemy( boss ) ;
  this.setFlag( StageState._FLAG_SE_ENEMY_VANISH ) ;
  this.spellCard = null ;
  this.vanishedEnemyManager.create( boss ) ;
  // TODO: these parameters should move to EffectFactory.
  if(boss.dead == 'escape') {
    this.notifyDoEffect(boss, 'shockwave', {
      'w': 5,
      'g': 5,
      'a': 0.1,
      'b': 20,
      'endCount': 100
    });
  } else {
    this.notifyDoEffect(boss, 'shockwave', {
      'w': 5,
      'g': 5,
      'a': 0.1,
      'b': 10,
      'endCount': 100
    });
  }
  this.clearFlag( StageState._FLAG_BOSS_EXIST ) ;
  this.score += boss.score ;
  // TODO: temporal
  if( boss.dead == 'escape' && boss.vanishedTalk ) {
    this.state = StageState._STATE_TALK ;
    this.fighter.beNeutral( ) ;
  }
} ;


StageState.prototype.notifyBossVanishEnd = function( boss ) {
  if( boss.vanishedTalk ) {
    this.state = StageState._STATE_TALK ;
    this.fighter.beNeutral( ) ;
  }
//  this.state = StageState._STATE_CLEAR ;
} ;


/**
 * TODO: temporal
 */
StageState.prototype.notifyFighterDead = function( fighter, element ) {

  this.setFlag( StageState._FLAG_FIGHTER_DEAD ) ;
  this.setFlag( StageState._FLAG_SE_DEAD ) ;
  this.vanishedEnemyManager.create( fighter ) ;
  this.notifyDoEffect(fighter, 'shockwave', null);
  this.fighter.setFlag( Element._FLAG_UNHITTABLE ) ;
  this.fighter.deadCount = this.fighter.count ;

  if( this.players <= 0 ) {
    // TODO: temporal
    if( this.isFlagSet( StageState._FLAG_AUTO_PLAY ) ) {
      this.game.notifyQuitStage( ) ;
      return ;
    }
    this.state = StageState._STATE_GAME_OVER ;
    this.states[ this.state ].init( ) ;
    this.fighter.beNeutral( ) ;
    return ;
  }

  this.bombs = 2 ;
  this.players-- ;
  this.fighter.state = Element._STATE_ALIVE ;
  this.fighter.beDefaultPosition( ) ;
  this.fighter.deadCount = this.fighter.count ;

} ;


StageState.prototype.notifyDoEffect = function( element, type, params ) {
  this.effectManager.create( element, type, params ) ;
} ;


StageState.prototype.notifyBossAppeared = function( boss ) {
} ;


StageState.prototype.notifyBossStageChanged = function( boss ) {
//  this.enemyBulletManager.removeBulletsOfEnemy( boss ) ;
  this.enemyBulletManager.beItem( ) ;
} ;


/**
 * TODO: temporal
 */
StageState.prototype.notifyBeScoreItem = function( element ) {
  this.itemManager.createHoming( element, Item._TYPE_SCORE ) ;
} ;


StageState.prototype.notifyBossBecameActive = function( boss ) {
  this.state = StageState._STATE_SHOOTING ;
  if( boss.spellCard ) {
    this.spellCardManager.create( boss ) ;
    this.setFlag( StageState._FLAG_SE_POWER_EFFECT ) ;
    this.spellCard = boss.spellCard ;
    this.bossSpellCount = this.count ;
    this.setFlag( StageState._FLAG_BOSS_SPELLCARD ) ;
  }
  this.setFlag( StageState._FLAG_BOSS_EXIST ) ;
} ;


StageState.prototype.notifyBossBeginTalk = function( boss ) {
  // TODO: temporal
  if( boss.appearedTalk ) {
    this.state = StageState._STATE_TALK ;
    this.fighter.beNeutral( ) ;
  } else {
    this.notifyBossBecameActive( boss ) ;
  }
} ;


StageState.prototype.notifyBossMovedNextStage = function( boss ) {
  this.clearFlag( StageState._FLAG_BOSS_SPELLCARD ) ; // Just in case.
  this.setFlag( StageState._FLAG_SE_ENEMY_VANISH ) ;
  this.spellCard = null ;
  this.notifyDoEffect( boss, 'shockwave', {
    'w': 5,
    'g': 5,
    'a': 0.1,
    'b': 20,
    'endCount': 50
  } ) ;
} ;


StageState.prototype.notifyContinue = function( ) {
  this.didContinue = true ;
  this.bombs = 2 ;
  this.players = 3 ;
  this.fighter.state = Fighter._STATE_ALIVE ;
  this.fighter.setX( parseInt( this.getWidth( ) / 2 ) ) ;
  this.fighter.setY( this.getHeight( ) - 100 ) ;
  this.state = StageState._STATE_SHOOTING ;
} ;


StageState.prototype.notifyQuit = function( ) {
  this.game.notifyQuitStage( true ) ;
} ;


StageState.prototype.notifyGoNextStage = function( ) {
  this.state = StageState._STATE_SHOOTING ;
  this.count = 0 ;
  this.animationCount = 0 ;
  this.pending = 0 ;
  this.enemyManager.goNextStage( ) ;
  this.bossManager.goNextStage( ) ;
  this.backgroundManager.goNextStage();
} ;


StageState.prototype.notifyGameClear = function( ) {
  // TODO: temporal
  if( this.isFlagSet( StageState._FLAG_AUTO_PLAY ) ) {
    this.game.notifyQuitStage( ) ;
  } else {
    this.game.notifyGameClear( ) ;
  }
} ;


StageState.prototype.notifyStageClear = function( ) {
  this.clearFlag( StageState._FLAG_BOSS_SPELLCARD ) ; // Just in case.
  this.state = StageState._STATE_CLEAR ;
  this.states[ this.state ].init( ) ; // TODO: temporal
  this.viewScore = this.score ;
} ;


/**
 * TODO: temporal
 */
StageState.prototype.getWidth = function( ) {
  return this.game.width - Game._SIDE_WIDTH ;
} ;



function StageAbstractState( stage ) {
  this.stage = stage ;
}


StageAbstractState.prototype.runStep = function( ) {

} ;


StageAbstractState.prototype.handleKeyDown = function( e ) {
} ;


StageAbstractState.prototype.handleKeyUp = function( e ) {
} ;


StageAbstractState.prototype.updateDisplay = function( surface ) {
} ;


StageAbstractState.prototype._soundEffect = function( key ) {
  this.stage._soundEffect( key ) ;
} ;


StageAbstractState.prototype.getImage = function( key ) {
  return this.stage.getImage( key ) ;
} ;


/**
 * @param record Array
 */
StageAbstractState.prototype._putKeyOnRecord = function( record ) {
  if( record.length > 0 )
    this.stage.putKeyOnRecord( record ) ;
} ;


/**
 * @param record Array
 */
StageAbstractState.prototype._putKeyOffRecord = function( record ) {
  if( record.length > 0 )
    this.stage.putKeyOffRecord( record ) ;
} ;



function ShootingState( stage ) {
  this.parent = StageAbstractState ;
  this.parent.call( this, stage ) ;
}
__inherit( ShootingState, StageAbstractState ) ;


ShootingState.prototype.handleKeyDown = function( e ) {
  var p = [ ] ;
  switch( e.keyCode ) {
    case 16: // shift
      if( this.stage.fighter.setFlag( Fighter._FLAG_SLOW ) )
        p.push( 's' ) ;
      break ;
    case 32: // space
      this.stage.fighter.changeCharacter( ) ;
      p.push( 'sp' ) ;
      break ;
    case 37: // left
      if( this.stage.fighter.setFlag( Element._FLAG_MOVE_LEFT ) )
        p.push( 'l' ) ;
      break ;
    case 38: // up
      if( this.stage.fighter.setFlag( Element._FLAG_MOVE_UP ) )
        p.push( 'u' ) ;
      break ;
    case 39: // right
      if( this.stage.fighter.setFlag( Element._FLAG_MOVE_RIGHT ) )
        p.push( 'r' ) ;
      break ;
    case 40: // down
      if( this.stage.fighter.setFlag( Element._FLAG_MOVE_DOWN ) )
        p.push( 'd' ) ;
      break ;
    // TODO: temporal
    case 88: // x
      this.stage.notifyFighterDoBomb( this.stage.fighter ) ;
      p.push( 'x' ) ;
      break ;
    case 90: // z
      if( this.stage.fighter.setFlag( Element._FLAG_SHOT ) )
        p.push( 'z' ) ;
      break ;
  } ;
  this._putKeyOnRecord( p ) ;
} ;


ShootingState.prototype.handleKeyUp = function( e ) {
  var p = [ ] ;
  switch( e.keyCode ) {
    case 16: // shift
      if( this.stage.fighter.clearFlag( Fighter._FLAG_SLOW ) )
        p.push( 's' ) ;
      break ;
    case 37: // left
      if( this.stage.fighter.clearFlag( Element._FLAG_MOVE_LEFT ) )
        p.push( 'l' ) ;
      break ;
    case 38: // up
      if( this.stage.fighter.clearFlag( Element._FLAG_MOVE_UP ) )
        p.push( 'u' ) ;
      break ;
    case 39: // right
      if( this.stage.fighter.clearFlag( Element._FLAG_MOVE_RIGHT ) )
        p.push( 'r' ) ;
      break ;
    case 40: // down
      if( this.stage.fighter.clearFlag( Element._FLAG_MOVE_DOWN ) )
        p.push( 'd' ) ;
      break ;
    case 90: // z
      if( this.stage.fighter.clearFlag( Element._FLAG_SHOT ) )
        p.push( 'z' ) ;
      break ;
  } ;
  this._putKeyOffRecord( p ) ;
} ;


ShootingState.prototype.updateDisplay = function( surface ) {
} ;



function TalkState( stage ) {
  this.parent = StageAbstractState ;
  this.parent.call( this, stage ) ;
  this.stageIndex = 0 ;
  this.sceneIndex = 0 ;
  this.index = 0 ;
  this.params = __talkParams ;
}
__inherit( TalkState, StageAbstractState ) ;


TalkState.prototype.reset = function( ) {
  this.stageIndex = 0 ;
  this.sceneIndex = 0 ;
  this.index = 0 ;
} ;


TalkState.prototype.handleKeyDown = function( e ) {
  var p = [ ] ;
  switch( e.keyCode ) {
    case 32: // space
      p.push( 'sp' ) ;
      this.stage.fighter.changeCharacter( ) ;
      break ;
    case 90: // z
      p.push( 'z' ) ;
      this.index++ ;
      // TODO: temporal
      if( this.index >= this.params[ this.stageIndex ][ this.sceneIndex ][ this.stage.fighter.characterIndex ].length ) {
        this.sceneIndex++ ;
        this.index = 0 ;
        if( this.sceneIndex >= this.params[ this.stageIndex ].length ) {
          this.stage.notifyStageClear( ) ;
          this.stageIndex++ ;
          this.sceneIndex = 0 ;
        } else {
          this.stage.notifyBossBecameActive( this.stage.bossManager.getBoss( ) ) ;
        }
      }
      break ;
  } ;
  this._putKeyOnRecord( p ) ;
} ;


TalkState.prototype.handleKeyUp = function( e ) {
} ;


TalkState.prototype.updateDisplay = function( surface ) {
  this._displayStandUp( surface, this.params[ this.stageIndex ][ this.sceneIndex ][ this.stage.fighter.characterIndex ][ this.index ].left,  120,  0 ) ;
  this._displayStandUp( surface, this.params[ this.stageIndex ][ this.sceneIndex ][ this.stage.fighter.characterIndex ][ this.index ].right, 360,  0 ) ;
  this._displaySerifWindow( surface ) ;
  this._displaySerif( surface ) ;
} ;


/**
 * TODO: temporal
 */
TalkState.prototype._displayStandUp = function( surface, params, w, dw ) {
  if( ! params )
    return ;

  surface.save( ) ;
  if( params.active ) {
    surface.globalAlpha = 1.0 ;
    w += dw ;
  } else {
    surface.globalAlpha = 0.5 ;
  }
  var p = this._getStandUp( params.character ) ;
  surface.drawImage( p.image,
                     w - p.width * 0.75 / 2,
                     50,
                     p.width  * 0.75,
                     p.height * 0.75 ) ;
  surface.restore( ) ;
} ;


TalkState.prototype._getStandUp = function( key ) {
  var image ;
  var width ;
  var height ;
  switch( key ) {
    case 'reimu':
      image = this.stage.getImage( Game._IMG_STAND_REIMU ) ;
      width = 400 ;
      height = 600 ;
      break ;
    case 'marisa':
      image = this.stage.getImage( Game._IMG_STAND_MARISA ) ;
      width = 400 ;
      height = 600 ;
      break ;
    case 'mokou':
      image = this.stage.getImage( Game._IMG_STAND_MOKOU ) ;
      width = 512 ;
      height = 600 ;
      break ;
    case 'rumia':
      image = this.stage.getImage( Game._IMG_STAND_RUMIA ) ;
      width = 600 ;
      height = 600 ;
      break ;
    case 'chilno':
      image = this.stage.getImage( Game._IMG_STAND_CHILNO ) ;
      width = 550 ;
      height = 600 ;
      break ;
    default:
      // TODO: throw exception?
      break ;
  }
  return { 'image': image, 'width': width, 'height': height } ;
} ;


TalkState.prototype._displaySerifWindow = function( surface ) {
  surface.save( ) ;
  surface.fillStyle = 'rgb( 50, 50, 50 )' ;
  surface.globalAlpha = 0.7 ;
  surface.fillRect( 50, 350, 380, 100 ) ;
  surface.restore( ) ;
} ;


TalkState.prototype._displaySerif = function( surface ) {
  surface.save( ) ;
  surface.fillStyle = 'rgb( 255, 255, 255 )' ;
  surface.textAlign = 'left' ;
  surface.font = '16px Arial' ;
  var array = this.params[ this.stageIndex ][ this.sceneIndex ][ this.stage.fighter.characterIndex ][ this.index ].serif.split( '\n' ) ;
  for( var i = 0; i < array.length; i++ ) {
    surface.fillText( array[ i ], 60, 380 + i * 20) ;
  }
  surface.restore( ) ;
} ;


/**
 * TODO: temporal
 */
function ClearState( stage ) {
  this.parent = StageAbstractState ;
  this.parent.call( this, stage ) ;
  this.count = 0 ;
}
__inherit( ClearState, StageAbstractState ) ;

ClearState._MOVE_SPEED = 20 ;


/**
 * TODO: temporal
 */
ClearState.prototype.init = function( ) {
  this.count = 0 ;
} ;


/**
 * TODO: temporal
 */
ClearState.prototype.runStep = function( ) {
  this.count++ ;
} ;


ClearState.prototype.handleKeyDown = function( e ) {
  var p = [ ] ;
  switch( e.keyCode ) {
    case 32: // space
      p.push( 'sp' ) ;
      this.stage.fighter.changeCharacter( ) ;
      break ;
    case 90: // z
      p.push( 'z' ) ;
      // TODO: temporal
      if( this.count < this.stage.getHeight( ) / ClearState._MOVE_SPEED )
        return ;
      this._toNextStage(  )
      break ;
  } ;
  this._putKeyOnRecord( p ) ;
} ;


ClearState.prototype.handleKeyUp = function( e ) {
} ;


ClearState.prototype.updateDisplay = function( surface ) {

  var base = this.stage.getHeight( ) - this.count * ClearState._MOVE_SPEED ;;
  if( base < 0 )
    base = 0 ;

  surface.save( ) ;
  var pattern = surface.createPattern( this.getImage( Game._IMG_SCORE_BACK ), '' ) ;
  surface.fillStyle = pattern ;
  surface.fillRect( 0, base, this.stage.getWidth( ), this.stage.getHeight( ) ) ;

  surface.fillStyle = 'rgb( 30, 30, 30 )' ;
  surface.globalAlpha = 0.8 ;
  surface.fillRect( 50, base + 50, 380, 380 ) ;
  surface.fillStyle = 'rgb( 255, 255, 255 )' ;
  surface.textAlign = 'left' ;
  surface.font = '16px Arial' ;
  surface.fillText( 'Stage' + ( this.stage.stageIndex + 1 ) + ' Clear',
                    100, base + 100 ) ;
  surface.restore( ) ;

} ;


/**
 * TODO: temporal
 */
ClearState.prototype._toNextStage = function( ) {
  this.stage.stageIndex++ ;
  if( this.stage.stageIndex >= __enemiesParams.length ) {
    this.stage.notifyGameClear( ) ;
  } else {
    this.stage.notifyGoNextStage( ) ;
  }
} ;


/**
 * TODO: temporal
 */
function GameOverState( stage ) {
  this.parent = StageAbstractState ;
  this.parent.call( this, stage ) ;
  this.index = 0 ;
}
__inherit( GameOverState, StageAbstractState ) ;


GameOverState.prototype.init = function( ) {
  this.index = 0 ;
} ;


/**
 * TODO: temporal
 */
GameOverState.prototype.runStep = function( ) {
} ;


GameOverState.prototype.handleKeyDown = function( e ) {
  switch( e.keyCode ) {
    case 38: // up
    case 40: // down
      this._soundEffect( Game._SE_SELECT ) ;
      this.index = ( this.index == 0 ) ? 1 : 0 ;
      break ;
    case 90: // z
      this._soundEffect( Game._SE_SELECT ) ;
      if( this.index == 0 )
        this.stage.notifyContinue( ) ;
      else
        this.stage.notifyQuit( ) ;
      break ;
  } ;
} ;


GameOverState.prototype.handleKeyUp = function( e ) {
} ;


GameOverState.prototype.updateDisplay = function( surface ) {
  surface.save( ) ;

  surface.fillStyle = 'rgb( 0, 0, 0 )' ;
  surface.globalAlpha = 0.5 ;
  surface.fillRect( 0, 170, 480, 100 ) ;

  surface.fillStyle = 'rgb( 255, 255, 255 )' ;
  surface.textAlign = 'center' ;
  surface.textBaseAlign = 'middle' ;
  surface.font = '16px Arial' ;
  if( this.index == 0 ) {
    surface.globalAlpha = 1.0 ;
  } else {
    surface.globalAlpha = 0.2 ;
  }
  surface.fillText( 'Continue', 240, 200 ) ;
  if( this.index == 0 ) {
    surface.globalAlpha = 0.2 ;
  } else {
    surface.globalAlpha = 1.0 ;
  }
  surface.fillText( 'Quit',     240, 240 ) ;
  surface.restore( ) ;
} ;


