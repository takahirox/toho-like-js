/**
 * no plan to port this class to WebGL so far cuz
 * it cannot be performance critical.
 */
function SpellCardManager( gameState ) {
  this.parent = ElementManager ;
  this.parent.call( this, gameState ) ;
} ;
__inherit( SpellCardManager, ElementManager ) ;


SpellCardManager.prototype._initFactory = function( ) {
  this.factory = new SpellCardFactory( this.gameState, this.gameState.width, this.gameState.height ) ;
} ;


SpellCardManager.prototype.create = function( boss ) {
  this.addElement( this.factory.create( boss ) ) ;
} ;



function SpellCardFactory( gameState, maxX, maxY ) {
  this.parent = ElementFactory ;
  this.parent.call( this, gameState, maxX, maxY ) ;
} ;
__inherit( SpellCardFactory, ElementFactory ) ;

SpellCardFactory.prototype._NUM = 10 ;
SpellCardFactory.prototype._FIGHTER_IMAGES = [ Game._IMG_STAND_REIMU, Game._IMG_STAND_MARISA ] ;
SpellCardFactory.prototype._ENEMY_IMAGES   = [ Game._IMG_STAND_MOKOU, Game._IMG_STAND_RUMIA, Game._IMG_STAND_CHILNO ] ;
SpellCardFactory.prototype._PARAMS = [
  { 'x': 240, 'y': 240, 'v': { 'r': 3, 'theta':150, 'raa': -0.005, 'rrange': { 'min': 1 } } },
  { 'x': 240, 'y': 240, 'v': { 'r': 3, 'theta': 30, 'raa': -0.005, 'rrange': { 'min': 1 } } },
] ;

SpellCardFactory.prototype._initFreelist = function() {
  this.freelist = new SpellCardFreeList(this._NUM, this.gameState); 
};


/**
 *
 */
SpellCardFactory.prototype.create = function( element ) {
  var params = element instanceof Fighter ? this._PARAMS[0] : this._PARAMS[1];
  var card = this.freelist.get();
  card.init(params, this._getImage(element), element);
  return card;
};


SpellCardFactory.prototype._getImage = function( element ) {
  var image ;
  var vector = null ;
  if( element instanceof Fighter ) {
    vector = { 'r': 3, 'theta':150, 'raa': -0.005, 'rrange': { 'min': 1 } } ;
    image = this.gameState.getImage( this._FIGHTER_IMAGES[ element.characterIndex ] ) ;
    image.width = 400 ;
  } else {
    vector = { 'r': 3, 'theta': 30, 'raa': -0.005, 'rrange': { 'min': 1 } } ;
    // TODO: temporary
    if( element.character == 'rumia' ) {
      image = this.gameState.getImage( this._ENEMY_IMAGES[ 1 ] ) ;
      image.width = 600 ;
    } else if( element.character == 'chilno' ) {
      image = this.gameState.getImage( this._ENEMY_IMAGES[ 2 ] ) ;
      image.width = 550 ;
    } else {
      image = this.gameState.getImage( this._ENEMY_IMAGES[ 0 ] ) ;
      image.width = 512 ;
    }
  }
  return image ;
} ;



function SpellCardFreeList( num, gameState ) {
  this.parent = ElementFreeList ;
  this.parent.call( this, num, gameState ) ;
}
__inherit( SpellCardFreeList, ElementFreeList ) ;


SpellCardFreeList.prototype._generateElement = function( ) {
  return new SpellCard( this.gameState, this.gameState.getWidth( ), this.gameState.getHeight( ) ) ;
} ;



/**
 * This class shows Spell card background.
 * That is character image and spellcard name strings.
 */
function SpellCard( gameState, maxX, maxY ) {
  this.parent = Element ;
  this.parent.call( this, gameState, maxX, maxY ) ;
  this.boss = null ;
  this.baseX = 0 ;
  this.baseY = 0 ;
}
__inherit( SpellCard, Element ) ;

SpellCard.prototype._HEIGHT = 600 ;


__copyParentMethod(SpellCard, Element, 'init');
SpellCard.prototype.init = function(params, image, boss) {
  this.Element_init(params, image);
  this.boss = boss;

  this.width = image.width;
  this.height = this._HEIGHT;
  this.collisionWidth = this.width;
  this.collisionHeight = this.height;
  this.indexX = 0;
  this.indexY = 0;
  this.baseX = this.getX();
  this.baseY = this.getY();
};


/**
 * still uses display() method.
 * TODO: temporal
 */
__copyParentMethod(SpellCard, Element, 'display');
SpellCard.prototype.display = function(surface) {
  surface.save();
  surface.globalAlpha = 0.4;
  this.Element_display(surface);
  this.displaySpellCardName(surface);
  surface.restore();
//  surface.fillText( x + ':' + y, x, y ) ;
};


SpellCard.prototype.displaySpellCardName = function(surface) {
  surface.save();
  surface.fillStyle = 'rgb(255, 255, 255)';
  surface.textAlign = 'center';
  surface.font = '16px Arial';
  surface.globalAlpha = 0.8;
  var x = this.baseX + (this.getX() - this.baseX) / 4;
  var y = this.baseY + (this.getY() - this.baseY) / 4 + 150;
  surface.fillText('Spell Card: ' + this.boss.spellCard, x, y);
  surface.restore();
};


/**
 * TODO: temporal
 */
SpellCard.prototype.checkLoss = function( ) {
  return this.count > 100 ? true : false ;
} ;

