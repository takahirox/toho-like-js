function BombManager( gameState ) {
  this.parent = ElementManager ;
  this.parent.call( this, gameState ) ;
}
__inherit( BombManager, ElementManager ) ;

BombManager._MAX_NUM = 40;


BombManager.prototype._initMaxNum = function() {
  return BombManager._MAX_NUM;
};


BombManager.prototype._initFactory = function( ) {
  this.factory = new BombFactory( this.gameState, this.gameState.getWidth( ), this.gameState.getHeight( ) ) ;
} ;


BombManager.prototype.initDrawer = function(layer, image) {
  this.drawer = new BombDrawer(this, layer,
                               this.gameState.getImage(Game._IMG_BOMB));
};


// TODO: temporal
BombManager.prototype.create = function( fighter ) {
  var bombs = this.factory.create( fighter ) ;
  for( var i = 0; i < bombs.length; i++ )
    this.addElement( bombs[ i ] ) ;
} ;



function BombFactory( gameState, maxX, maxY ) {
  this.parent = ElementFactory ;
  this.parent.call( this, gameState, maxX, maxY ) ;
  this.params = [ ] ;
  this._initBomb( ) ;
}
__inherit( BombFactory, ElementFactory ) ;

BombFactory._NUM = 20 ;
BombFactory._BULLET_NUM = 10 ;


BombFactory.prototype._initFreelist = function( ) {
  this.freelist = new BombFreeList( BombFactory._NUM, this.gameState ) ; 
} ;


BombFactory.prototype._initBomb = function( ) {
  var num = BombFactory._BULLET_NUM ;
  for( var i = 0; i < num; i++ ) {
    this.params.push( {
      'x': 0,
      'y': 0,
      'v': { 'r': 0, 'theta': parseInt( 360 / num ) * i, 'w': 1, 'ra': 0.2 }
    } ) ;
  }
} ;


BombFactory.prototype.create = function( fighter ) {
  var bombs = [ ] ;
  for( var i = 0; i < this.params.length; i++ ) {
    this.params[ i ].x = fighter.getX( ) ;
    this.params[ i ].y = fighter.getY( ) ;
    var bomb = this.freelist.get( ) ;
    bomb.init( this.params[ i ], this._getImage( this.params[ i ] ), fighter ) ;
    bombs.push( bomb ) ;
  }
  return bombs ;
} ;


BombFactory.prototype._getImage = function( params ) {
  return this.gameState.getImage( Game._IMG_BOMB ) ;
} ;



function BombFreeList( num, gameState ) {
  this.parent = ElementFreeList ;
  this.parent.call( this, num, gameState ) ;
}
__inherit( BombFreeList, ElementFreeList ) ;


BombFreeList.prototype._generateElement = function( ) {
  return new Bomb( this.gameState, this.gameState.getWidth( ), this.gameState.getHeight( ) ) ;
} ;



function BombDrawer(elementManager, layer, image) {
  this.parent = ElementDrawer;
  this.parent.call(this, elementManager, layer, image);
};
__inherit(BombDrawer, ElementDrawer);


BombDrawer.prototype._getBlend = function() {
  return Layer._BLEND_ADD_ALPHA;
};



function BombView(element) {
  this.parent = ElementView;
  this.parent.call(this, element);
  this.a = 0.4;
};
__inherit(BombView, ElementView);



/**
 * Currently Bomb represents just a big bullet.
 */
function Bomb( gameState, maxX, maxY ) {
  this.parent = Element ;
  this.parent.call( this, gameState, maxX, maxY ) ;
}
__inherit( Bomb, Element ) ;

Bomb._WIDTH  = 128 ;
Bomb._HEIGHT = 128 ;

Bomb._OUT_RANGE = 200 ;


Bomb.prototype.init = function( params, image, fighter ) {
  this.parent.prototype.init.call( this, params, image ) ;

  this.setX( fighter.getX( ) ) ;
  this.setY( fighter.getY( ) ) ;

  this.width = Bomb._WIDTH ;
  this.height = Bomb._HEIGHT ;
  this.collisionWidth = this.width ;
  this.collisionHeight = this.height ;
  this.indexX = 0 ;
  this.indexY = 3 ;
  this._initView();
} ;


Bomb.prototype._generateView = function() {
  return new BombView(this);
};


Bomb.prototype.display = function( surface ) {
//  surface.save( ) ;
  surface.globalAlpha = 0.6 ;
  this.parent.prototype.display.call( this, surface ) ;
  surface.globalAlpha = 1.0 ;
//  surface.restore( ) ;
} ;


Bomb.prototype._outOfTheField = function( ) {
  if( this.getX( ) < -Bomb._OUT_RANGE || this.getX( ) > this.maxX + Bomb._OUT_RANGE ||
      this.getY( ) < -Bomb._OUT_RANGE || this.getY( ) > this.maxY + Bomb._OUT_RANGE )
    return true ;
  return false ;
} ;
