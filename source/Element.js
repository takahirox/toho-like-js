/**
 * TODO: should rename Element to Entity?
 */
function ElementManager(gameState) {
  this.gameState = gameState;
  this.elements = [];
  this.count = 0;
  this.factory = null;
  this.drawer = null;
  this.maxNum = this._initMaxNum();
  this._initFactory();
};


/**
 * maximum number for WebGL Buffer.
 * TODO: bad design?
 * TODO: rename to _getMaxNum.
 */
ElementManager.prototype._initMaxNum = function() {
  return 1;
};


ElementManager.prototype._initFactory = function( ) {
  this.factory = new ElementFactory( this.gameStage,
                                     this.gameState.maxX,
                                     this.gameState.maxY ) ;
} ;


/**
 * TODO: be private?
 */
ElementManager.prototype.initDrawer = function(layer, image) {
  this.drawer = new ElementDrawer(this, layer, image);
};


ElementManager.prototype.reset = function( ) {
  for( var i = 0; i < this.elements.length; i++ ) {
    this.elements[ i ].die( ) ;
    this.elements[ i ].free( ) ;
    this.factory.free( this.elements[ i ] ) ;
  }
  this.elements.length = 0 ;
  this.count = 0 ;
} ;


ElementManager.prototype.runStep = function() {
  for(var i = 0, len = this.elements.length; i < len; i++)
    this.elements[i].runStep();
  this.count++;
};


/**
 * displays on 2D Canvas
 */
ElementManager.prototype.display = function( surface ) {
  for( var i = 0; i < this.elements.length; i++ )
    this.elements[ i ].display( surface ) ;
} ;


/**
 * draws on WebGL layer
 * TODO: rename
 */
ElementManager.prototype.draw = function(layer) {
  this.drawer.draw(layer);
};


ElementManager.prototype.create = function( params ) {
  this.addElement( this.factory.create( params ) ) ;
} ;


/**
 * TODO: rename to add()
 */
ElementManager.prototype.addElement = function(element) {
  this.elements[this.elements.length] = element;
};


ElementManager.prototype.add = function(element) {
  this.addElement(element);
};


ElementManager.prototype.get = function(index) {
  return this.elements[index];
};


ElementManager.prototype.checkCollisionWith = function(
    id, element, caller, flag ) {
  for(var i = 0, len = this.elements.length; i < len; i++) {
    if(this.elements[i].checkCollision(element)) {
      caller.notifyCollision(id, element, this.elements[i]);
      if(flag === true)
        return ;
    }
  }
};


/**
 * TODO: temporal
 */
ElementManager.prototype.checkCollisionWith2 = function(
    id, element, caller, flag) {
  for(var i = 0, len = this.elements.length; i < len; i++) {
    if(element.checkCollision(this.elements[i])) {
      caller.notifyCollision2(id, element, this.elements[i]);
      if(flag === true)
        return;
    }
  }
};


ElementManager.prototype.checkGrazeWith = function(id, element, caller) {
  for(var i = 0, len = this.elements.length; i < len; i++) {
    if(this.elements[i].checkGraze(element)) {
      caller.notifyGraze(id, element, this.elements[i]);
    }
  }
};


/**
 * TODO: temporal. How deletes unnecessary entries?
 */
ElementManager.prototype.checkLoss = function(caller) {
  var j = 0 ;
  for(var i = 0, len = this.elements.length; i < len; i++ ) {
    if( ! this.elements[ i ].checkLoss( ) ) {
      this.elements[ i - j ] = this.elements[ i ] ;
    } else {
      this.elements[ i ].die( ) ;
      // TODO: temporal
      if(caller !== void 0)
        caller.notifyCheckLoss(this.elements[i]);
      this.elements[ i ].free( ) ;
      this.factory.free( this.elements[ i ] ) ;
      j++ ;
    }
  }
  this.elements.length -= j ;
}


ElementManager.prototype.getNum = function() {
  return this.elements.length;
};


ElementManager.prototype.getMaxNum = function() {
  return this.maxNum;
};


function ElementFactory( gameState, maxX, maxY ) {
  this.gameState = gameState ;
  this.maxX = maxX ;
  this.maxY = maxY ;
  this.freelist = null ;
  this._initFreelist( ) ;
} ;

ElementFactory.prototype._NUM = 100 ;


ElementFactory.prototype._initFreelist = function() {
  this.freelist = new ElementFreeList(this._NUM, this.gameState); 
};


ElementFactory.prototype.create = function( params ) {
  var element = this.freelist.get( ) ;
  element.init( params, this._getImage( params ) ) ;
  return element ;
} ;


ElementFactory.prototype.free = function( element ) {
  this.freelist.free( element ) ;
} ;


/**
 * Child process must override this method.
 */
ElementFactory.prototype._getImage = function( params ) {
  return new Image( ) ;
} ;


/**
 * TODO: list may should be Linked list if num is large.
 */
function ElementFreeList( num, gameState ) {
  this.gameState = gameState ;
  FreeList.call( this, num ) ;
}
__inherit( ElementFreeList, FreeList ) ;


/**
 * Child class must override this method.
 */
ElementFreeList.prototype._generateElement = function( ) {
  return new Element( this.gameState, this.gameState.maxX, this.gameState.maxY ) ;
} ;


/**
 * This class has position and parameters of Element for WebGL.
 * They're used by ElementDrawer.
 * Note that this class doesn't have image and texture.
 * ElementDrawer has them.
 */
function ElementView(element) {
  this.element = element;
  this.a = 1.0;
  this.d = 1.0;
  this.vertices = [];
  this.coordinates = [];
  this.indices = [];
  this.colors = [];
  this.sVertices = [];
  this.vertices.length    = this._V_SIZE;
  this.coordinates.length = this._C_SIZE;
  this.indices.length     = this._I_SIZE;
  this.colors.length      = this._A_SIZE;
  this.sVertices.length   = this._V_SIZE;
};

// only for reference
ElementView.prototype.Math = Math;

ElementView.prototype._V_ITEM_SIZE = 3;
ElementView.prototype._V_ITEM_NUM = 4;
ElementView.prototype._V_SIZE = ElementView.prototype._V_ITEM_SIZE * ElementView.prototype._V_ITEM_NUM;

ElementView.prototype._C_ITEM_SIZE = 2;
ElementView.prototype._C_ITEM_NUM = 4;
ElementView.prototype._C_SIZE = ElementView.prototype._C_ITEM_SIZE * ElementView.prototype._C_ITEM_NUM;

ElementView.prototype._I_ITEM_SIZE = 1;
ElementView.prototype._I_ITEM_NUM = 6;
ElementView.prototype._I_SIZE = ElementView.prototype._I_ITEM_SIZE * ElementView.prototype._I_ITEM_NUM;

ElementView.prototype._A_ITEM_SIZE = 4;
ElementView.prototype._A_ITEM_NUM = 4;
ElementView.prototype._A_SIZE = ElementView.prototype._A_ITEM_SIZE * ElementView.prototype._A_ITEM_NUM;

// TODO: temporal
ElementView._V_ITEM_SIZE = 3;
ElementView._V_ITEM_NUM = 4;
ElementView._V_SIZE = ElementView._V_ITEM_SIZE * ElementView._V_ITEM_NUM;

ElementView._C_ITEM_SIZE = 2;
ElementView._C_ITEM_NUM = 4;
ElementView._C_SIZE = ElementView._C_ITEM_SIZE * ElementView._C_ITEM_NUM;

ElementView._I_ITEM_SIZE = 1;
ElementView._I_ITEM_NUM = 6;
ElementView._I_SIZE = ElementView._I_ITEM_SIZE * ElementView._I_ITEM_NUM;

ElementView._A_ITEM_SIZE = 4;
ElementView._A_ITEM_NUM = 4;
ElementView._A_SIZE = ElementView._A_ITEM_SIZE * ElementView._A_ITEM_NUM;


ElementView.prototype.init = function() {
  this._initVertices();
  this._initCoordinates();
  this._initIndices();
  this._initColors();
};


ElementView.prototype._initVertices = function() {
  var w = this.element.getWidth()/2;
  var h = this.element.getHeight()/2;

  this.vertices[0]  = -w;
  this.vertices[1]  = -h;
  this.vertices[2]  = -1.0;
  this.vertices[3]  =  w;
  this.vertices[4]  = -h;
  this.vertices[5]  = -1.0;
  this.vertices[6]  =  w;
  this.vertices[7]  =  h;
  this.vertices[8]  = -1.0;
  this.vertices[9]  = -w;
  this.vertices[10] =  h;
  this.vertices[11] = -1.0;
};


ElementView.prototype._initCoordinates = function() {
  var w = this.element.getWidth()/this.element.getImageWidth();
  var h = this.element.getHeight()/this.element.getImageHeight();

  var x1 = w * this.element.getImageIndexX();
  var y1 = h * this.element.getImageIndexY();
  var x2 = x1 + w;
  var y2 = y1 + h;

  this.coordinates[0] = x1;
  this.coordinates[1] = y2;
  this.coordinates[2] = x2;
  this.coordinates[3] = y2;
  this.coordinates[4] = x2;
  this.coordinates[5] = y1;
  this.coordinates[6] = x1;
  this.coordinates[7] = y1;
};


ElementView.prototype._initIndices = function() {
  this.indices[0] = 0;
  this.indices[1] = 1;
  this.indices[2] = 2;

  this.indices[3] = 0;
  this.indices[4] = 2;
  this.indices[5] = 3;
};


ElementView.prototype._initColors = function() {
  this.colors[0] = 1.0;
  this.colors[1] = 1.0;
  this.colors[2] = 1.0;
  this.colors[3] = 1.0;

  this.colors[4] = 1.0;
  this.colors[5] = 1.0;
  this.colors[6] = 1.0;
  this.colors[7] = 1.0;

  this.colors[8] = 1.0;
  this.colors[9] = 1.0;
  this.colors[10] = 1.0;
  this.colors[11] = 1.0;

  this.colors[12] = 1.0;
  this.colors[13] = 1.0;
  this.colors[14] = 1.0;
  this.colors[15] = 1.0;
};


ElementView.prototype.getNum = function() {
  return 1;
};


ElementView.prototype.saveVertices = function() {
  for(var i = 0, len = this._V_SIZE * this.getNum(); i < len; i++) {
    this.sVertices[i] = this.vertices[i];
  }
};


ElementView.prototype.restoreVertices = function() {
  for(var i = 0, len = this._V_SIZE * this.getNum(); i < len; i++) {
    this.vertices[i] = this.sVertices[i];
  }
};


ElementView.prototype.translate = function() {
  for(var j = 0, len = this.getNum(); j < len; j++) {
    var o = this._V_SIZE * j;
    for(var i = 0; i < this._V_ITEM_NUM; i++) {
      this.vertices[o+i*this._V_ITEM_SIZE+0] += this._getElementX();
      // this is the trick to correspond 2D canvas coordinates.
      this.vertices[o+i*this._V_ITEM_SIZE+1] -= this._getElementY();
      this.vertices[o+i*this._V_ITEM_SIZE+2] += this._getElementZ();;
    }
  }
};


ElementView.prototype._getElementX = function() {
  return this.element.getX();
};


ElementView.prototype._getElementY = function() {
  return this.element.getY();
};


ElementView.prototype._getElementZ = function() {
  return this.element.getZ();
};


ElementView.prototype.rotate = function() {
  var theta = 270 - this.element.getDirectionTheta();
  var radian = theta * this.Math.PI / 180;
  for(var j = 0, len = this.getNum(); j < len; j++) {
    var o = this._V_SIZE * j;
    for(var i = 0; i < this._V_ITEM_NUM; i++) {
      var x = this.vertices[o+i*this._V_ITEM_SIZE+0];
      var y = this.vertices[o+i*this._V_ITEM_SIZE+1];

      this.vertices[o+i*this._V_ITEM_SIZE+0] =
        x * this.Math.cos(radian) - y * this.Math.sin(radian);
      this.vertices[o+i*this._V_ITEM_SIZE+1] =
        x * this.Math.sin(radian) + y * this.Math.cos(radian);
    }
  }
};


/**
 * TODO: optimize. and remove magic numbers;
 */
ElementView.prototype.rotateForViewpoint = function() {
  var r = this.Math.sqrt(40*40 + 120*120);
  var r2 = this.element.getHeight()/2;
  var ay =  40 * r2 / r;
  var az = 120 * r2 / r;
  for(var j = 0, len = this.getNum(); j < len; j++) {
    var o = this._V_SIZE * j;
    for(var i = 0; i < this._V_ITEM_NUM; i++) {
      var y = this.vertices[o+i*this._V_ITEM_SIZE+1];
      var z = this.vertices[o+i*this._V_ITEM_SIZE+2];
      if(i > 1) {
        this.vertices[o+i*this._V_ITEM_SIZE+1] = ay;
        this.vertices[o+i*this._V_ITEM_SIZE+2] = z+az;
      } else {
        this.vertices[o+i*this._V_ITEM_SIZE+1] = ay;
        this.vertices[o+i*this._V_ITEM_SIZE+2] = z-az;
      }
    }
  }
};


ElementView.prototype.doRotateForViewpoint = function() {
  return false;
};


/**
 * assume that update coordinates here in each frame.
 */
ElementView.prototype.animate = function() {
};



function ElementDrawer(e, layer, image) {
  this.gameState = e.gameState;
  if(e instanceof ElementManager) {
    this.elementManager = e;
    this.element = null;
    this.maxLength = e.getMaxNum();
  } else {
    this.element = e;
    this.elementManager = null;
    this.maxLength = 1;
  }
  this.vArray = layer.createFloatArray(this.maxLength*this.ElementView._V_SIZE);
  this.cArray = layer.createFloatArray(this.maxLength*this.ElementView._C_SIZE);
  this.iArray = layer.createUintArray(this.maxLength*this.ElementView._I_SIZE);
  this.aArray = layer.createFloatArray(this.maxLength*this.ElementView._A_SIZE);
  this.vBuffer = layer.createBuffer();
  this.cBuffer = layer.createBuffer();
  this.iBuffer = layer.createBuffer();
  this.aBuffer = layer.createBuffer();
  this.texture = null;
  this._initTexture(layer, image);
};

// only for reference
ElementDrawer.prototype.ElementView = ElementView.prototype;
ElementDrawer.prototype.Layer = Layer.prototype;

ElementDrawer.prototype._initTexture = function(layer, image) {
  this.texture = layer.generateTexture(image);
};


ElementDrawer.prototype._pourVertices = function(i, v) {
  v.saveVertices();
  if(this.gameState.doLookAtFromViewpointTarget() &&
     v.doRotateForViewpoint())
    v.rotateForViewpoint();
  v.rotate();
  v.translate();

  var num = v.getNum();
  var vLength = v._V_SIZE;
  for(var k = 0; k < num; k++) {
    for(var j = 0; j < vLength; j++) {
      this.vArray[(i+k)*vLength+j] = v.vertices[k*vLength+j];
    }
  }

  v.restoreVertices();
};


ElementDrawer.prototype._pourCoordinates = function(i, v) {
  var cLength = v._C_SIZE;
  for(var k = 0, len = v.getNum(); k < len; k++) {
    for(var j = 0; j < cLength; j++) {
      this.cArray[(i+k)*cLength+j] = v.coordinates[k*cLength+j];
    }
  }
};


ElementDrawer.prototype._pourIndices = function(i, v) {
  // TODO: 4 is a magic number
  var iLength = v._I_SIZE;
  var indices = v.indices;
  for(var k = 0, len = v.getNum(); k < len; k++) {
    for(var j = 0; j < iLength; j++) {
      this.iArray[(i+k)*iLength+j] = (i+k)*4 + indices[k*iLength+j];
    }
  }
};


ElementDrawer.prototype._pourColors = function(i, v) {
  var aLength = v._A_SIZE;
  var colors = v.colors;
  var a = v.a;
  var d = v.d;
  for(var k = 0, len = v.getNum(); k < len; k++) {
    for(var j = 0; j < aLength; j++) {
      if(j % 4 == 3)
        this.aArray[(i+k)*aLength+j] = colors[k*aLength+j] * a;
      else
        this.aArray[(i+k)*aLength+j] = colors[k*aLength+j] * d;
    }
  }
};


ElementDrawer.prototype._pourArray = function(e, n) {
  var v = e.getView();
  v.animate();
  this._pourVertices(n, v);
  this._pourCoordinates(n, v);
  this._pourIndices(n, v);
  this._pourColors(n, v);
  return v.getNum();
};


ElementDrawer.prototype._pourArrays = function() {
  var n = 0;
  for(var i = 0, len = this.elementManager.getNum(); i < len; i++) {
    // TODO: bad design
    var e = this.elementManager.get(i);
    if(this._doPour(e)) {
      n += this._pourArray(e, n);
    }
  }
  return n;
};


ElementDrawer.prototype._doPour = function(e) {
  return true;
};


/**
 * This method can be performance critical function.
 * TODO: iBuffer generally doesn't need to update in each frame.
 *       It's good enough to update only its size if it's initialized.
 *       It could be improve CPU-GPU transfer performance.
 * TODO: attempt to redoce CPU-GPU transfer.
 */
ElementDrawer.prototype._pourBuffer = function(layer, n) {
  layer.pourArrayBuffer(this.vBuffer, this.vArray, this.ElementView._V_ITEM_SIZE,
                        n * this.ElementView._V_ITEM_NUM);
  layer.pourArrayBuffer(this.cBuffer, this.cArray, this.ElementView._C_ITEM_SIZE,
                        n * this.ElementView._C_ITEM_NUM);
  layer.pourArrayBuffer(this.aBuffer, this.aArray, this.ElementView._A_ITEM_SIZE,
                        n * this.ElementView._A_ITEM_NUM);
  layer.pourElementArrayBuffer(this.iBuffer, this.iArray,
                               this.ElementView._I_ITEM_SIZE,
                               n * this.ElementView._I_ITEM_NUM);
};


ElementDrawer.prototype._draw = function(layer) {
  layer.draw(this.texture, this.vBuffer, this.cBuffer, this.iBuffer,
             this.aBuffer, this._getBlend());
};


ElementDrawer.prototype._getBlend = function() {
  return this.Layer._BLEND_ALPHA;
};


ElementDrawer.prototype._initDraw = function(layer) {
  layer.viewport();
};


/**
 * TODO: remove magic numbers.
 */
ElementDrawer.prototype._project = function(layer) {
  if(this.gameState.doLookAtFromViewpointTarget())
    layer.perspective(60, 0.1, 1000.0);
  else
    layer.ortho(0.1, 10.0);
};


/**
 * Note: layer.lookAt or something should be here.
 */
ElementDrawer.prototype._prepareDraw = function(layer) {
};


ElementDrawer.prototype._VIEWPOINTS_CONTAINERS = [
  [0, 0, 1], // eye
  [0, 0, 0], // center
  [0, 1, 0]  // up
];
/**
 * TODO: remove magic numbers.
 */
ElementDrawer.prototype.lookAtFromViewpointTarget = function(layer) {
  var f = this.gameState.getViewpointTarget();

  var eye = this._VIEWPOINTS_CONTAINERS[0];
  var center = this._VIEWPOINTS_CONTAINERS[1];
  var up = this._VIEWPOINTS_CONTAINERS[2];

  eye[0] =  f.getX();
  eye[1] = -f.getY()+8;
  eye[2] = 20;

  center[0] = f.getX();
  center[1] = -f.getY() + 128;
  center[2] = -20;

  layer.lookAt(eye, center, up);
};


ElementDrawer.prototype.draw = function(layer) {
  var n = this.element ? this._pourArray(this.element, 0) : this._pourArrays();
  this._pourBuffer(layer, n);
  this._initDraw(layer);
  this._project(layer);
  layer.identity();
  this._prepareDraw(layer);
  if(this.gameState.doLookAtFromViewpointTarget())
    this.lookAtFromViewpointTarget(layer);
  this._draw(layer);
};



/**
 * TODO: parameters should be object?
 */
var __moveVectorManager = new MoveVectorManager( ) ;
function Element( gameState, maxX, maxY ) {
  this.moveVectorManager = __moveVectorManager ; // TODO: temporal
  this.listId = null ;
  this.listForw = null ;
  this.image = null ;

  this.gameState = gameState ;
  this.maxX = maxX ;
  this.maxY = maxY ;

  this.x = 0 ;
  this.y = 0 ;
  this.z = 0 ;
  this.r = 0 ;
  this.keepAlive = 0 ;
  this.baseTheta = 0 ;
  this.indexX = 0 ;
  this.indexY = 0 ;
  this.width  = 0 ;
  this.height = 0 ;
  this.collisionWidth  = 0 ;
  this.collisionHeight = 0 ;
  this.grazeWidth = 0;
  this.grazeHeight = 0;

  this.state = 0 ;
  this.flags = 0 ;
  this.count = 0 ;
  this.graze = 0;

  this.vectorIndex = 0 ;
  this.vector = null ;
  this.baseVectorCount = 0 ;
  this.vectors = [ ] ;
  this.gravity = null ;

  this.view = this._generateView();
};

// only for reference
Element.prototype.Math = Math;
Element.prototype.Randomizer = __randomizer;

Element.prototype._STATE_ALIVE = 1 ;
Element.prototype._STATE_DEAD  = 2 ;

Element.prototype._FLAG_MOVE_STOP  =  0x1 ;
Element.prototype._FLAG_MOVE_LEFT  =  0x2 ;
Element.prototype._FLAG_MOVE_UP    =  0x4 ;
Element.prototype._FLAG_MOVE_RIGHT =  0x8 ;
Element.prototype._FLAG_MOVE_DOWN  = 0x10 ;
Element.prototype._FLAG_SHOT       = 0x20 ;
Element.prototype._FLAG_HIT        = 0x40 ;
Element.prototype._FLAG_UNHITTABLE = 0x80 ;


Element.prototype.init = function(params, image) {
  this.image = image ;

  this.x               = this._getValueOrDefaultValue(params.x, 0);
  this.y               = this._getValueOrDefaultValue(params.y, 0);
  this.z               = this._getValueOrDefaultValue(params.z, 0);
  this.r               = this._getValueOrDefaultValue(params.r, 0);
  this.keepAlive       = this._getValueOrDefaultValue(params.keepAlive, 0);
  this.baseTheta       = this._getValueOrDefaultValue(params.baseTheta, 0);
  this.indexX          = this._getValueOrDefaultValue(params.indexX, 0);
  this.indexY          = this._getValueOrDefaultValue(params.indexY, 0);
  this.width           = this._getValueOrDefaultValue(params.width, 0);
  this.height          = this._getValueOrDefaultValue(params.height, 0);
  this.collisionWidth  = this._getValueOrDefaultValue(params.collisionWidth, 0);
  this.collisionHeight = this._getValueOrDefaultValue(params.collisionHeight, 0);
  this.grazeWidth      = this._getValueOrDefaultValue(params.grazeWidth, 0);
  this.grazeHeight     = this._getValueOrDefaultValue(params.grazeHeight, 0);
  this.graze           = this._getValueOrDefaultValue(params.graze, 1);

  this.state = 0 ;
  this.flags = 0 ;
  this.count = 0 ;

  this.vectorIndex = 0 ;
  this.baseVectorCount = 0 ;
  // TODO: temporal
  this.vectors.length = 0 ;
  if(params.v === void 0) {
  } else if( params.v instanceof Array ) {
    for( var i = 0; i < params.v.length; i++ )
      this.vectors.push( params.v[ i ] ) ;
  } else {
    params.v = [ { 'v': params.v } ] ;
    this.vectors.push( params.v[ 0 ] ) ;
//    this.vectors.push( { 'v': params.v } ) ;
  }

  if( this.vectors.length > 0 )
    this.vectors[ 0 ].count = 0 ;
  this.vector = null ;
  this.gravity = null ;

  if( this.vectors.length > 0 )
    this._initVector( ) ;
  this._supplyPosition( ) ;

} ;


Element.prototype._initView = function() {
  this.view.init();
};


Element.prototype.getView = function() {
  return this.view;
};


Element.prototype._generateView = function() {
  return new ElementView(this);
};


Element.prototype._getValueOrDefaultValue = function(value, defaultValue) {
  return value !== void 0 ? value : defaultValue;
};


Element.prototype.free = function( ) {
  if(this.vector !== null)
    this.moveVectorManager.free( this.vector ) ;
  if(this.gravity !== null)
    this.moveVectorManager.free( this.gravity ) ;
} ;


Element.prototype._checkVectorChange = function( ) {
  if( this.vectorIndex >= this.vectors.length - 1 )
    return false ;
  if( this.count >=
        this.vectors[ this.vectorIndex + 1 ].count + this.baseVectorCount ) {
    return true ;
  }
  return false ;
} ;


Element.prototype._changeVector = function( ) {
  this.vectorIndex++ ;
  if( typeof( this.vectors[ this.vectorIndex ].v ) == 'number' ) {
    this.vectorIndex = this.vectors[ this.vectorIndex ].v ;
    this.baseVectorCount = this.count ;
  }
} ;


/**
 * TODO: to make the logic straightforward.
 */
Element.prototype._initVector = function( ) {
  // save previous data
  var preTheta = null;
  if(this.vector !== null)
    preTheta = this.vector.theta ;
  var tmpTheta = this.vectors[ this.vectorIndex ].v.theta ;
  var tmpR     = this.vectors[ this.vectorIndex ].v.r ;

  // for special propose
  // these functions will updates this.vectors[ this.vectorIndex ],
  // so previous data needs to be saved.
  if(this.vectors[ this.vectorIndex ].v.aimed !== void 0)
    this._calculateAimedVector( ) ;
  if(this.vectors[ this.vectorIndex ].v.target !== void 0)
    this._calculateTargetVector( ) ;

  // set normal vector
  if(this.vector !== null)
    this.moveVectorManager.free( this.vector ) ;
  this.vector = this.moveVectorManager.create( this.vectors[ this.vectorIndex ].v ) ;
  if(this.baseTheta !== null)
    this.vector.theta += this.baseTheta ;
  if(preTheta !== null && this.vectors[ this.vectorIndex ].v.theta === void 0)
    this.vector.theta = preTheta ;

  // restore previous data
  this.vectors[ this.vectorIndex ].v.theta = tmpTheta ;
  this.vectors[ this.vectorIndex ].v.r = tmpR ;

  // set gravity vector
  if(this.gravity !== null)
    this.moveVectorManager.free( this.gravity ) ;
  if(this.vectors[ this.vectorIndex ].v.g !== void 0)
    this.gravity = this.moveVectorManager.create( this.vectors[ this.vectorIndex ].v.g ) ;
  else
    this.gravity = null ;
} ;


/**
 * TODO: temporal
 */
Element.prototype._supplyPosition = function( ) {

  if(this.r === 0 || this.vector === null)
    return ;

  var ax = 0 ;
  var ay = 0 ;

  if(this.gravity === null) {
    ax = this.r * this.Math.cos( this._calculateRadian( this.vector.theta ) ) ;
    ay = this.r * this.Math.sin( this._calculateRadian( this.vector.theta ) ) ;
  } else {
    var dx = this.vector.moveX( ) + this.gravity.moveX( ) ;
    var dy = this.vector.moveY( ) + this.gravity.moveY( ) ;
    var t = this.Math.atan2( dy, dx ) ;
    ax = this.r * this.Math.cos( t ) ;
    ay = this.r * this.Math.sin( t ) ;
  }

  this.setX( this.getX( ) + ax ) ;
  this.setY( this.getY( ) + ay ) ;

} ;


/**
 * TODO: temporal
 */
Element.prototype._calculateAimedVector = function() {
  var fighter = this.gameState.fighterManager.getClosestFighter(this);
  var ax = fighter.getCenterX() - this.getCenterX();
  var ay = fighter.getCenterY() - this.getCenterY();
  this.vectors[this.vectorIndex].v.theta += this._calculateTheta(this.Math.atan2(ay, ax));
};


/**
 * TODO: temporal
 */
Element.prototype._calculateTargetVector = function( ) {
  var x = typeof( this.vectors[ this.vectorIndex ].v.target.x ) == 'object'
             ? this._getRandomValue( this.vectors[ this.vectorIndex ].v.target.x )
             : this.vectors[ this.vectorIndex ].v.target.x ;
  var y = typeof( this.vectors[ this.vectorIndex ].v.target.y ) == 'object'
             ? this._getRandomValue( this.vectors[ this.vectorIndex ].v.target.y )
             : this.vectors[ this.vectorIndex ].v.target.y ;

  var ax = x - this.getX( ) ;
  var ay = y - this.getY( ) ;
  this.vectors[ this.vectorIndex ].v.theta = this._calculateTheta( this.Math.atan2( ay, ax ) ) ;
  this.vectors[ this.vectorIndex ].v.r = this.Math.sqrt( ax * ax + ay * ay ) / this.vectors[ this.vectorIndex ].v.target.count ;
} ;


/**
 * TODO: temporal
 * duplicated code
 */
Element.prototype._getRandomValue = function(range) {
  var differ = range.max - range.min;
  return ((this.Randomizer.random() * differ) | 0) + range.min;
};


Element.prototype._calculateRadian = function( theta ) {
  return theta * this.Math.PI / 180 ;
} ;


Element.prototype._calculateTheta = function(radian) {
  return (radian * 180 / this.Math.PI) | 0;
};


Element.prototype.display = function( surface, rotate, angle ) {
  var x = this.Math.round( this.getLeftX( ) ) ;
  var y = this.Math.round( this.getUpY( ) ) ;
  if( rotate ) {
    var rx = this.Math.round( this.getCenterX( ) ) ;
    var ry = this.Math.round( this.getCenterY( ) ) ;
    if(angle === null || angle === void 0)
      angle = this._calculateRadian( this.getDirectionTheta( ) + 90 ) ;
    else
      angle = this._calculateRadian( angle ) ;
    surface.save( ) ;
    surface.translate( rx, ry ) ;
    surface.rotate( angle ) ;
    surface.translate( -rx, -ry ) ;
  }
  surface.drawImage( this.image,
                     this.width  * this.indexX, this.height * this.indexY,
                     this.width,                this.height,
                     x,                         y,
                     this.width,                this.height ) ;
  if( rotate ) {
    surface.restore( ) ;
  }
} ;


Element.prototype.getX = function( ) {
  return this.x ;
} ;


Element.prototype.getY = function( ) {
  return this.y ;
} ;


Element.prototype.getZ = function() {
  return this.z;
};


Element.prototype.getWidth = function( ) {
  return this.width ;
} ;


Element.prototype.getHeight = function( ) {
  return this.height ;
} ;


Element.prototype.getImageIndexX = function() {
  return this.indexX;
};


Element.prototype.getImageIndexY = function() {
  return this.indexY;
};


Element.prototype.getImageWidth = function() {
  return this.image.width;
};


Element.prototype.getImageHeight = function() {
  return this.image.height;
};


Element.prototype.setX = function( x ) {
  this.x = x ;
} ;


Element.prototype.setY = function( y ) {
  this.y = y ;
} ;


Element.prototype.getCenterX = function( ) {
  return this.getX( ) ;
} ;


Element.prototype.getCenterY = function( ) {
  return this.getY( ) ;
} ;


Element.prototype.getLeftX = function( ) {
  return this.getCenterX( ) - this.getWidth( ) / 2 ;
} ;


Element.prototype.getRightX = function( ) {
  return this.getCenterX( ) + this.getWidth( ) / 2 ;
} ;


/**
 * TODO: rename. Up -> Top
 */
Element.prototype.getUpY = function( ) {
  return this.getCenterY( ) - this.getHeight( ) / 2 ;
} ;


Element.prototype.getBottomY = function( ) {
  return this.getCenterY( ) + this.getHeight( ) / 2 ;
} ;


Element.prototype.getCollisionLeftX = function( ) {
  return this.getCenterX( ) - this.collisionWidth / 2 ;
} ;


Element.prototype.getCollisionRightX = function( ) {
  return this.getCenterX( ) + this.collisionWidth / 2 ;
} ;


Element.prototype.getCollisionUpY = function( ) {
  return this.getCenterY( ) - this.collisionHeight / 2 ;
} ;


Element.prototype.getCollisionBottomY = function( ) {
  return this.getCenterY( ) + this.collisionHeight / 2 ;
} ;


Element.prototype.inCollisionArea = function( x, y ) {
  if( x >= this.getCollisionLeftX( ) && x <= this.getCollisionRightX( ) &&
      y >= this.getCollisionUpY( )   && y <= this.getCollisionBottomY( ) )
    return true ;
  return false ;
} ;


/**
 * TODO: temporal
 */
Element.prototype.checkCollision = function( e ) {

  if( this.isDead( ) )
    return false ;

  if( this.inCollisionArea( e.getCollisionLeftX( ),  e.getCollisionUpY( ) ) ||
      this.inCollisionArea( e.getCollisionLeftX( ),  e.getCollisionBottomY( ) ) ||
      this.inCollisionArea( e.getCollisionRightX( ), e.getCollisionUpY( ) ) ||
      this.inCollisionArea( e.getCollisionRightX( ), e.getCollisionBottomY( ) ) ||
      this.inCollisionArea( e.getCenterX( ),         e.getCenterY( ) ) ) {
    return true ;
  }

  return false ;

} ;


Element.prototype.getGrazeLeftX = function() {
  return this.getCenterX() - this.grazeWidth/2;
};


Element.prototype.getGrazeRightX = function() {
  return this.getCenterX() + this.grazeWidth/2;
};


Element.prototype.getGrazeUpY = function() {
  return this.getCenterY() - this.grazeHeight/2;
};


Element.prototype.getGrazeBottomY = function() {
  return this.getCenterY() + this.grazeHeight/2;
};


Element.prototype.inGrazeArea = function(x, y) {
  if(x >= this.getGrazeLeftX() && x <= this.getGrazeRightX() &&
     y >= this.getGrazeUpY()   && y <= this.getGrazeBottomY())
    return true;
  return false;
};


/**
 * TODO: temporal
 */
Element.prototype.checkGraze = function(e) {

  if(!this.graze)
    return false;

  if(this.isDead())
    return false;

  if(this.inGrazeArea(e.getGrazeLeftX(),  e.getGrazeUpY()) ||
     this.inGrazeArea(e.getGrazeLeftX(),  e.getGrazeBottomY()) ||
     this.inGrazeArea(e.getGrazeRightX(), e.getGrazeUpY()) ||
     this.inGrazeArea(e.getGrazeRightX(), e.getGrazeBottomY()) ||
     this.inGrazeArea(e.getCenterX(),     e.getCenterY())) {
    return true;
  }

  return false;

};


Element.prototype.inViewArea = function( x, y ) {
  if( x > this.getLeftX( ) && x < this.getRightX( ) &&
      y > this.getUpY( )   && y < this.getBottomY( ) )
    return true ;
  return false ;
} ;


Element.prototype.checkViewCollision = function( e ) {

  if( this.isDead( ) )
    return false ;

  if( this.inViewArea( e.getLeftX( ),  e.getUpY( ) ) ||
      this.inViewArea( e.getLeftX( ),  e.getBottomY( ) ) ||
      this.inViewArea( e.getRightX( ), e.getUpY( ) ) ||
      this.inViewArea( e.getRightX( ), e.getBottomY( ) ) ) {
    return true ;
  }

  return false ;

} ;


Element.prototype._beInTheField = function( ) {
  if( this.getX( ) < 0 )
    this.setX( 0 ) ;
  if( this.getX( ) > this.maxX )
    this.setX( this.maxX ) ;
  if( this.getY( ) < 0 )
    this.setY( 0 ) ;
  if( this.getY( ) > this.maxY )
    this.setY( this.maxY ) ;
} ;


/**
 * TODO: separate the check loss logic and reflect logic?
 */
Element.prototype.checkLoss = function( ) {

  if( this.isDead( ) )
    return true ;

  if( this._outOfKeepAlive( ) )
    return true ;

  if( this._checkReflect( ) )
    return true ;

  if( this._outOfTheField( ) )
    return true ;

  return false ;

} ;


Element.prototype._outOfKeepAlive = function( ) {
  if( this.keepAlive && this.count >= this.keepAlive )
    return true ;
} ;


Element.prototype._outOfTheField = function( ) {
  if( this.getX( ) < 0 || this.getX( ) > this.maxX ||
      this.getY( ) < 0 || this.getY( ) > this.maxY )
    return true ;
  return false ;
} ;


Element.prototype._checkReflect = function( ) {
  if( this.vectors.length <= 0 )
    return false ;

  if( this.vectors[ this.vectorIndex ].v.reflectX ) {
    if( this.getX( ) < 0 || this.getX( ) > this.maxX ) {
      this.vector.reflectX( ) ;
      this._beInTheField( ) ;
      if( this.vectors[ this.vectorIndex ].v.reflectCount &&
          this.vector.getReflectCount( ) > this.vectors[ this.vectorIndex ].v.reflectCount )
        return true ;
    }
  }
  if( this.vectors[ this.vectorIndex ].v.reflectY ) {
    if( this.getY( ) < 0 || this.getY( ) > this.maxY ) {
      this.vector.reflectY( ) ;
      this._beInTheField( ) ;
      if( this.vectors[ this.vectorIndex ].v.reflectCount &&
          this.vector.getReflectCount( ) > this.vectors[ this.vectorIndex ].v.reflectCount )
        return true ;
    }
  } 
  if( this.vectors[ this.vectorIndex ].v.reflect ) {
    if( this.getX( ) < 0 || this.getX( ) > this.maxX ||
        this.getY( ) < 0 || this.getY( ) > this.maxY ) {
      this.vector.reflect( ) ;
      this._beInTheField( ) ;
      if( this.vectors[ this.vectorIndex ].v.reflectCount &&
          this.vector.getReflectCount( ) > this.vectors[ this.vectorIndex ].v.reflectCount )
        return true ;
    }
  }
  return false ;
} ;


Element.prototype.move = function( ) {
  if( this.vector ) {
    this.setX( this.getX( ) + this._moveX( ) ) ;
    this.setY( this.getY( ) + this._moveY( ) ) ;
  }

  if( this.gravity ) {
    this.setX( this.getX( ) + this._moveGravityX( ) ) ;
    this.setY( this.getY( ) + this._moveGravityY( ) ) ;
  }
} ;


Element.prototype._moveX = function( ) {
  return this.vector.moveX( ) ;
} ;


Element.prototype._moveY = function( ) {
  return this.vector.moveY( ) ;
} ;


Element.prototype._moveGravityX = function( ) {
  return this.gravity.moveX( ) ;
} ;


Element.prototype._moveGravityY = function( ) {
  return this.gravity.moveY( ) ;
} ;


/**
 * TODO: temporal
 */
Element.prototype.getDirectionTheta = function( ) {
  if( ! this.vector )
    return 90 ;
  if( this.vector && ! this.gravity )
    return this.vector.theta ;

  // TODO: is there any simpler logics?
  var ax = this.vector.moveX( ) + this.gravity.moveX( ) ;
  var ay = this.vector.moveY( ) + this.gravity.moveY( ) ;
  return this._calculateTheta( this.Math.atan2( ay, ax ) ) ;
} ;


Element.prototype.getXDirection = function( ) {
  if( ! this.vector )
    return 0 ;
  var cos = this.Math.cos( this._calculateRadian( this.getDirectionTheta( ) ) ) ;
  if( cos > 1.00e-10 )
    return 1 ;
  else if( cos < -1.00e-10 )
    return -1 ;
  return 0 ;

} ;


Element.prototype.getTheta = function() {
  if(this.getVelocity() >= 0)
    return this.vector.theta;
  return -this.vector.theta;
};


Element.prototype.getVelocity = function() {
  return this.vector.r;
};


/**
 * TODO: divide count up and runstep?
 */
Element.prototype.runStep = function( ) {
  this.move( ) ;
  if( this.gravity ) {
    this.gravity.runStep( ) ;
  }
  if( this.vector ) {
    this.vector.runStep( ) ;
    if( this._checkVectorChange( ) ) {
      this._changeVector( ) ;
      this._initVector( ) ;
    }
  }
  this.count++ ;
} ;


Element.prototype.die = function( ) {
  this.state = this._STATE_DEAD ;
} ;


Element.prototype.isDead = function( ) {
  return this.state == this._STATE_DEAD ;
} ;


Element.prototype.isFlagSet = function( type ) {
  return ( this.flags & type ) ? true : false ;
} ;


/**
 * Returns true if previous value is false. Otherwise returns false.
 */
Element.prototype.setFlag = function( type ) {
  var pre = this.isFlagSet( type ) ;
  this.flags |= type ;
  return ! pre ;
} ;


/**
 * Returns true if previous value is true. Otherwise returns false.
 */
Element.prototype.clearFlag = function( type ) {
  var pre = this.isFlagSet( type ) ;
  this.flags &= ~type ;
  return pre ;
} ;

