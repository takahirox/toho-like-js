function ItemManager( gameState ) {
  this.parent = ElementManager ;
  this.parent.call( this, gameState ) ;
} ;
__inherit( ItemManager, ElementManager ) ;


ItemManager.prototype._initFactory = function( ) {
  this.factory = new ItemFactory( this.gameState, this.gameState.getWidth( ), this.gameState.getHeight( ) ) ;
} ;


/**
 * TODO: temporary
 */
ItemManager.prototype.create = function( enemy, type ) {
  this.addElement( this.factory.create( enemy, type ) ) ;
} ;


/**
 * TODO: temporary
 */
ItemManager.prototype.createHoming = function( enemy, type ) {
  var item = this.factory.create( enemy, type ) ;
  item.setTarget( this.gameState.fighter ) ;
  this.addElement( item ) ;
} ;


ItemManager.prototype.checkCollisionWith = function( fighter ) {
  this.parent.prototype.checkCollisionWith.call( this, fighter,
    this._checkCollisionWithCallBack.bind( this ) ) ;
} ;


ItemManager.prototype._checkCollisionWithCallBack = function( fighter, item ) {
  item.die( ) ;
  if( item.isPower( ) )
    this.gameState.notifyFighterGotPowerItem( fighter, item ) ;
  else
    this.gameState.notifyFighterGotScoreItem( fighter, item ) ;
}


ItemManager.prototype.beHomingAll = function( fighter ) {
  for( var i = 0; i < this.elements.length; i++ ) {
    this.elements[ i ].setTarget( fighter ) ;
  }
} ;



function ItemFactory( gameState, maxX, maxY ) {
  this.parent = ElementFactory ;
  this.parent.call( this, gameState, maxX, maxY ) ;
} ;
__inherit( ItemFactory, ElementFactory ) ;

ItemFactory._NUM = 3000 ;
ItemFactory._PARAMS = {
  'x': 0,
  'y': 0,
  'v': { 'r': 4, 'theta': 270, 'w': 0, 'ra':-0.1, 'wa': 0 }
} ;


ItemFactory.prototype._initFreelist = function( ) {
  this.freelist = new ItemFreeList( ItemFactory._NUM, this.gameState ) ; 
} ;


/**
 * TODO: temporal
 */
ItemFactory.prototype.create = function( element, type ) {
  var params = ItemFactory._PARAMS ;
  params.x = element.getX( ) ;
  params.y = element.getY( ) ;
  var item = this.freelist.get( ) ;
  item.init( params, this._getImage( type ), type ) ;
  return item ;
} ;


ItemFactory.prototype._getImage = function( type ) {
  var key = type == Item._TYPE_POWER ? Game._IMG_POWER_ITEM : Game._IMG_SCORE_ITEM ;
  return this.gameState.getImage( key ) ;
} ;



function ItemFreeList( num, gameState ) {
  this.parent = ElementFreeList ;
  this.parent.call( this, num, gameState ) ;
}
__inherit( ItemFreeList, ElementFreeList ) ;


ItemFreeList.prototype._generateElement = function( ) {
  return new Item( this.gameState, this.gameState.getWidth( ), this.gameState.getHeight( ) ) ;
} ;



function Item( gameState, maxX, maxY ) {
  this.parent = Element ;
  this.parent.call( this, gameState, maxX, maxY ) ;
  this.type = null ;
  this.target = null ;
}
__inherit( Item, Element ) ;

Item._WIDTH = 12 ;
Item._HEIGHT = 12 ;

Item._COLLISION_WIDTH = 50 ;
Item._COLLISION_HEIGHT = 50 ;

Item._HOMING_SPAN = 2 ;
Item._HOMING_R = 10 ;

Item._TYPE_POWER = 0 ;
Item._TYPE_SCORE = 1 ;


Item.prototype.init = function( params, image, type ) {
  this.parent.prototype.init.call( this, params, image ) ;
  this.type = type ;
  this.width = Item._WIDTH ;
  this.height = Item._HEIGHT ;
  this.collisionWidth = Item._COLLISION_WIDTH ;
  this.collisionHeight = Item._COLLISION_HEIGHT ;
  this.target = null ;
} ;


/**
 * TODO: temporal
 */
Item.prototype.runStep = function( ) {
  if( this.target && this.count % Item._HOMING_SPAN == 0 )
    this._calculateHomingPoint( ) ;
  this.parent.prototype.runStep.call( this ) ;
} ;


Item.prototype.setTarget = function( element ) {
  this.target = element ;
} ;


Item.prototype.isPower = function( ) {
  return this.type == Item._TYPE_POWER ;
} ;


Item.prototype.isScore = function( ) {
  return this.type == Item._TYPE_SCORE ;
} ;


/**
 * TODO: temporal
 */
Item.prototype.checkLoss = function( ) {
  if( this.isDead( ) )
    return true ;

  if( this.x < 0 || this.x >= this.maxX ||
                    this.y >= this.maxY )
    return true ;
  return false ;
} ;


/**
 * TODO: temporal
 */
Item.prototype._calculateHomingPoint = function( ) {
  var ax = this.target.getX( ) - this.getX( ) ;
  var ay = this.target.getY( ) - this.getY( ) ;
  var t = this._calculateTheta( Math.atan2( ay, ax ) ) ;
  this.vector.theta = t ;
  this.vector.r = Item._HOMING_R ;
  return ;
} ;


