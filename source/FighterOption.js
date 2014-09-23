function FighterOptionManager(gameState, fighters) {
  this.parent = ElementManager;
  this.parent.call(this, gameState);
  this.fighters = fighters;
  this._init();
};
__inherit(FighterOptionManager, ElementManager);


FighterOptionManager.prototype._MAX_NUM = 4;

FighterOptionManager.prototype._PARAMS = [];
FighterOptionManager.prototype._PARAMS[0] = {
  'r':  32,
  'angle': 180,
  'theta': 180,
  'd':  1,
  'trange': {'min': 180, 'max': 250}
};
FighterOptionManager.prototype._PARAMS[1] = {
  'r':  32,
  'angle':   0,
  'theta': 360,
  'd': -1,
  'trange': {'min': 290, 'max': 360}
};


FighterOptionManager.prototype._initMaxNum = function() {
  return this._MAX_NUM;
};


FighterOptionManager.prototype._init = function() {
  // TODO: move these parameters to outside.
  for(var i = 0; i < this.fighters.length; i++) {
    var fighter = this.fighters[i];
    this.create(fighter, this._PARAMS[0]);
    this.create(fighter, this._PARAMS[1]);
  }
};


/**
 * keeps the elements even it resets.
 * TODO: unstraightforward.
 */
FighterOptionManager.prototype.reset = function() {
  for(var i = 0; i < this.elements.length; i++) {
    this.elements[i].reset(this._PARAMS[i%2]);
  }
  this.count = 0 ;
};


FighterOptionManager.prototype._initFactory = function( ) {
  this.factory = new FighterOptionFactory( this.gameState,
                                           this.gameState.getWidth( ),
                                           this.gameState.getHeight( ) ) ;
} ;


FighterOptionManager.prototype.initDrawer = function(layer, image) {
  this.drawer = new FighterOptionDrawer(this, layer, this._getImage());
};


/**
 * TODO: consider who should manage image.
 */
FighterOptionManager.prototype._getImage = function() {
  return this.gameState.getImage(Game._IMG_FIGHTER_OPTION);
};


FighterOptionManager.prototype.create = function(fighter, params) {
  var o = this.factory.create(fighter, params, this._getImage());
  fighter.addOption(o);
  this.addElement(o);
};



function FighterOptionFactory( gameState, maxX, maxY ) {
  this.parent = ElementFactory ;
  this.parent.call( this, gameState, maxX, maxY ) ;
} ;
__inherit( FighterOptionFactory, ElementFactory ) ;

FighterOptionFactory.prototype._NUM = 10 ;


FighterOptionFactory.prototype._initFreelist = function( ) {
  this.freelist = new FighterOptionFreeList( this._NUM,
                                             this.gameState ) ;
} ;


/**
 *
 */
FighterOptionFactory.prototype.create = function(fighter, params, image) {
  var option = this.freelist.get();
  option.init(params, image, fighter);
  return option;
};



function FighterOptionFreeList( num, gameState ) {
  this.parent = ElementFreeList ;
  this.parent.call( this, num, gameState ) ;
} ;
__inherit( FighterOptionFreeList, ElementFreeList ) ;


FighterOptionFreeList.prototype._generateElement = function( ) {
  return new FighterOption( this.gameState,
                            this.gameState.getWidth( ),
                            this.gameState.getHeight( ) ) ;
} ;


function FighterOptionDrawer(elementManager, layer, image) {
  this.parent = ElementDrawer;
  this.parent.call(this, elementManager, layer, image);
};
__inherit(FighterOptionDrawer, ElementDrawer);



function FighterOptionView(element) {
  this.parent = ElementView;
  this.parent.call(this, element);
};
__inherit(FighterOptionView, ElementView);



/**
 * if fighter doesn't have option, return 0 not to draw.
 * TODO: not straight forward design.
 */
FighterOptionView.prototype.getNum = function() {
  return (this.element.fighter.hasOption()) ? 1 : 0;
};


__copyParentMethod(FighterOptionView, ElementView, '_getElementX');
FighterOptionView.prototype._getElementX = function() {
  return this.ElementView_getElementX() + this.element.fighter.getX();
};


__copyParentMethod(FighterOptionView, ElementView, '_getElementY');
FighterOptionView.prototype._getElementY = function() {
  return this.ElementView_getElementY() + this.element.fighter.getY();
};


__copyParentMethod(FighterOptionView, ElementView, '_getElementZ');
FighterOptionView.prototype._getElementZ = function() {
  return this.ElementView_getElementZ() + this.element.fighter.getZ();
};


/**
 * for character change.
 * TODO: bad design.
 */
FighterOptionView.prototype.animate = function() {
  this._initCoordinates();
  this.a = this.element.fighter.isFlagSet(this.element._FLAG_UNHITTABLE) ? 0.7 : 1.0;
};



function FighterOption(gameState, maxX, maxY) {
  this.parent = Element;
  this.parent.call(this, gameState, maxX, maxY);
  this.fighter = null;
  this.angle   = null;
  this.theta   = null;
  this.d       = null;
  this.trange  = null;
}
__inherit(FighterOption, Element);

// only for reference
FighterOption.prototype.Math = Math;

FighterOption.prototype._WIDTH = 16 ;
FighterOption.prototype._HEIGHT = 16 ;

FighterOption.prototype._MOVE_SPEED = 8 ;
FighterOption.prototype._ROTATE_SPEED = 4 ;


__copyParentMethod(FighterOption, Element, 'init');
FighterOption.prototype._init = function(params, image) {
  this.Element_init(params, image);

  this.width  = this._WIDTH;
  this.height = this._HEIGHT;
  this.collisionWidth  = this.width;
  this.collisionHeight = this.height;

  this.angle  = this._getValueOrDefaultValue(params.angle, 0);
  this.theta  = this._getValueOrDefaultValue(params.theta, 0);
  this.d      = this._getValueOrDefaultValue(params.d, 0);
  this.trange = this._getValueOrDefaultValue(params.trange, null);
};


FighterOption.prototype.init = function(params, image, fighter) {
  this.fighter = fighter;
  this._init(params, image);
  this._initView();
};


FighterOption.prototype.reset = function(params) {
  this._init(params, this.image);
};


FighterOption.prototype._generateView = function() {
  return new FighterOptionView(this);
};


/**
 * TODO: temporal. Should I use MoveVector?
 */
__copyParentMethod(FighterOption, Element, 'runStep');
FighterOption.prototype.runStep = function() {
  if(this.fighter.hasOption()) {
    this.theta += (this.fighter.isFlagSet(this.fighter._FLAG_SLOW) ? 1 : -1)
                    * this.d * this._MOVE_SPEED;
    if(this.theta > this.trange.max)
      this.theta = this.trange.max;
    if(this.theta < this.trange.min)
      this.theta = this.trange.min;
    this.setX(this.r * this.Math.cos(this._calculateRadian(this.theta)));
    this.setY(this.r * this.Math.sin(this._calculateRadian(this.theta)));
  }
  this.Element_runStep();
};


/**
 * TODO: temporal
 */
FighterOption.prototype.display = function( surface ) {
  if( ! this.fighter.hasOption( ) )
    return ;

  this.image = this.fighter.characterIndex == 0
                 ? this.gameState.getImage( Game._IMG_REIMU_OPTION )
                 : this.gameState.getImage( Game._IMG_MARISA_OPTION ) ;

  this.parent.prototype.display.call( this, surface, true, angle ) ;
} ;


FighterOption.prototype.getDirectionTheta = function() {
  return (this.angle + this.count * this._ROTATE_SPEED + 90) % 360;
};


FighterOption.prototype.checkLoss = function( ) {
  return false ;
} ;


FighterOption.prototype.getCenterX = function( ) {
  return this.getX( ) + this.fighter.getX( ) ;
} ;


FighterOption.prototype.getCenterY = function( ) {
  return this.getY( ) + this.fighter.getY( ) ;
} ;


/**
 * TODO: temporal. bad design.
 */
FighterOption.prototype.getImageIndexY = function() {
  return this.fighter.characterIndex;
};

