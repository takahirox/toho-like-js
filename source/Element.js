/**
 * TODO: should rename Element to Entity?
 */
function ElementManager(gameState) {
  this.gameState = gameState;
  this.elements = [];
  this.count = 0;
  this.factory = null;
  this.maxNum = this._initMaxNum();
  this._initFactory();
};


ElementManager.prototype._initMaxNum = function() {
  return 1;
};


ElementManager.prototype._initFactory = function( ) {
  this.factory = new ElementFactory( this.gameStage,
                                     this.gameState.maxX,
                                     this.gameState.maxY ) ;
} ;


ElementManager.prototype.reset = function( ) {
  for( var i = 0; i < this.elements.length; i++ ) {
    this.elements[ i ].die( ) ;
    this.elements[ i ].free( ) ;
    this.factory.free( this.elements[ i ] ) ;
  }
  this.elements.length = 0 ;
  this.count = 0 ;
} ;


ElementManager.prototype.runStep = function( ) {
  for( var i = 0; i < this.elements.length; i++ )
    this.elements[ i ].runStep( ) ;
  this.count++ ;
} ;


ElementManager.prototype.display = function( surface ) {
  for( var i = 0; i < this.elements.length; i++ )
    this.elements[ i ].display( surface ) ;
} ;


ElementManager.prototype.create = function( params ) {
  this.addElement( this.factory.create( params ) ) ;
} ;


ElementManager.prototype.addElement = function( element ) {
  this.elements.push( element ) ;
} ;


ElementManager.prototype.getElement = function(index) {
  return this.elements.get[index];
};


ElementManager.prototype.checkCollisionWith = function(
    element, callback, flag ) {
  for( var i = 0; i < this.elements.length; i++ ) {
    if( this.elements[ i ].checkCollision( element ) ) {
      callback( element, this.elements[ i ] ) ;
      if( flag )
        return ;
    }
  }
} ;


/**
 * TODO: temporal
 */
ElementManager.prototype.checkCollisionWith2 = function(
    element, callback, flag ) {
  for( var i = 0; i < this.elements.length; i++ ) {
    if( element.checkCollision( this.elements[ i ] ) ) {
      callback( element, this.elements[ i ] ) ;
      if( flag )
        return ;
    }
  }
} ;


ElementManager.prototype.checkGrazeWith = function(element, callback) {
  for(var i = 0; i < this.elements.length; i++) {
    if(this.elements[i].checkGraze(element)) {
      callback(element, this.elements[i]);
    }
  }
};


/**
 * TODO: temporal. How deletes unnecessary entries?
 */
ElementManager.prototype.checkLoss = function( callback ) {
  var j = 0 ;
  for( var i = 0; i < this.elements.length; i++ ) {
    if( ! this.elements[ i ].checkLoss( ) ) {
      this.elements[ i - j ] = this.elements[ i ] ;
    } else {
      this.elements[ i ].die( ) ;
      // TODO: temporal
      if( callback )
        callback( this.elements[ i ] ) ;
      this.elements[ i ].free( ) ;
      this.factory.free( this.elements[ i ] ) ;
      j++ ;
    }
  }
  this.elements.length -= j ;
}


ElementManager.prototype.getNum = function( ) {
  return this.elements.length ;
} ;


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

ElementFactory._NUM = 100 ;


ElementFactory.prototype._initFreelist = function( ) {
  this.freelist = new ElementFreeList( ElementFactory._NUM, this.gameState ) ; 
} ;


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


function ElementView(element) {
  this.element = element;
  this.a = 1.0;
  this.vertices = [];
  this.coordinates = [];
  this.indices = [];
  this.colors = [];
  this.sVertices = [];
  this.vertices.length = ElementView._V_SIZE;
  this.coordinates.length = ElementView._C_SIZE;
  this.indices.length = ElementView._I_SIZE;
  this.colors.length = ElementView._A_SIZE;
  this.sVertices.length = ElementView._V_SIZE;
};

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

  var x1 = w * this.element.getImageXIndex();
  var y1 = h * this.element.getImageYIndex();
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


ElementView.prototype.saveVertices = function() {
  for(var i = 0; i < ElementView._V_SIZE; i++) {
    this.sVertices[i] = this.vertices[i];
  }
};


ElementView.prototype.restoreVertices = function() {
  for(var i = 0; i < ElementView._V_SIZE; i++) {
    this.vertices[i] = this.sVertices[i];
  }
};


ElementView.prototype.translate = function() {
  for(var i = 0; i < ElementView._V_ITEM_NUM; i++) {
    this.vertices[i*ElementView._V_ITEM_SIZE+0] += this.element.getX();
    this.vertices[i*ElementView._V_ITEM_SIZE+1] -= this.element.getY();
    this.vertices[i*ElementView._V_ITEM_SIZE+2] += this.element.getZ();
  }
};


ElementView.prototype.rotate = function() {
  var radian = this.element.getARadian();
  for(var i = 0; i < ElementView._V_ITEM_NUM; i++) {
    var x = this.vertices[i*ElementView._V_ITEM_SIZE+0];
    var y = this.vertices[i*ElementView._V_ITEM_SIZE+1];

    this.vertices[i*ElementView._V_ITEM_SIZE+0] =
      x * Math.cos(radian) - y * Math.sin(radian);
    this.vertices[i*ElementView._V_ITEM_SIZE+1] =
      x * Math.sin(radian) + y * Math.cos(radian);
  }
};


ElementView.prototype.animate = function() {
};



function ElementsDrawer(elementManager, gl, image) {
  this.elementManager = elementManager;
  var maxLength = elementManager.getMaxLength();
  this.vArray = new Float32Array(maxLength*12);
  this.cArray = new Float32Array(maxLength*8);
  this.iArray = new Uint16Array(maxLength*6);
  this.aArray = new Float32Array(maxLength*16);
  this.vBuffer = gl.createBuffer();
  this.cBuffer = gl.createBuffer();
  this.iBuffer = gl.createBuffer();
  this.aBuffer = gl.createBuffer();
  this.image = image;
  this.texture = null;
  this._initTexture(gl);
};


ElementsDrawer.prototype._initTexture = function(gl) {
  this.texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, this.texture)
//  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
                this.image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.bindTexture(gl.TEXTURE_2D, null);
};


ElementsDrawer.prototype._pourVerticies = function(i, v) {
  v.saveVertices();
  v.rotate();
  v.translate();
  for(var j = 0; j < ElementView._V_SIZE; j++) {
    this.vArray[i*ElementView._V_SIZE+j] = v.vertices[j];
  }
  v.restoreVertices();
};


ElementsDrawer.prototype._pourCoordinates = function(i, v) {
  for(var j = 0; j < ElementView._C_SIZE; j++) {
    this.cArray[i*ElementView._C_SIZE+j] = v.coordinates[j];
  }
};


ElementsDrawer.prototype._pourIndices = function(i, v) {
  // TODO: 4 is a magic number
  this.iArray[i*ElementView._I_SIZE+0] = i*4 + v.indices[0];
  this.iArray[i*ElementView._I_SIZE+1] = i*4 + v.indices[1];
  this.iArray[i*ElementView._I_SIZE+2] = i*4 + v.indices[2];

  this.iArray[i*ElementView._I_SIZE+3] = i*4 + v.indices[3];
  this.iArray[i*ElementView._I_SIZE+4] = i*4 + v.indices[4];
  this.iArray[i*ElementView._I_SIZE+5] = i*4 + v.indices[5];
};


ElementsDrawer.prototype._pourColors = function(i, v) {
  this.aArray[i*ElementView._A_SIZE+0] = 1.0;
  this.aArray[i*ElementView._A_SIZE+1] = 1.0;
  this.aArray[i*ElementView._A_SIZE+2] = 1.0;
  this.aArray[i*ElementView._A_SIZE+3] = v.a;

  this.aArray[i*ElementView._A_SIZE+4] = 1.0;
  this.aArray[i*ElementView._A_SIZE+5] = 1.0;
  this.aArray[i*ElementView._A_SIZE+6] = 1.0;
  this.aArray[i*ElementView._A_SIZE+7] = v.a;

  this.aArray[i*ElementView._A_SIZE+8] = 1.0;
  this.aArray[i*ElementView._A_SIZE+9] = 1.0;
  this.aArray[i*ElementView._A_SIZE+10] = 1.0;
  this.aArray[i*ElementView._A_SIZE+11] = v.a;

  this.aArray[i*ElementView._A_SIZE+12] = 1.0;
  this.aArray[i*ElementView._A_SIZE+13] = 1.0;
  this.aArray[i*ElementView._A_SIZE+14] = 1.0;
  this.aArray[i*ElementView._A_SIZE+15] = v.a;
};


ElementsDrawer.prototype._pourArray = function() {
  var length = this.elementManager.getLength();

  for(var i = 0; i < length; i++) {
    var e = this.elementManager.get(i);
    var v = e.getView();
    v.animate();
    this._pourVerticies(i, v);
    this._pourCoordinates(i, v);
    this._pourIndices(i, v);
    this._pourColors(i, v);
  }
};


ElementsDrawer.prototype._pourBuffer = function(gl) {
  var length = this.elementManager.getLength();

  gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, this.vArray, gl.STATIC_DRAW);
  this.vBuffer.itemSize = ElementView._V_ITEM_SIZE;
  this.vBuffer.numItems = length * ElementView._V_ITEM_NUM;

  gl.bindBuffer(gl.ARRAY_BUFFER, this.cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, this.cArray, gl.STATIC_DRAW);
  this.cBuffer.itemSize = ElementView._C_ITEM_SIZE;
  this.cBuffer.numItems = length * ElementView._C_ITEM_NUM;

  gl.bindBuffer(gl.ARRAY_BUFFER, this.aBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, this.aArray, gl.STATIC_DRAW);
  this.aBuffer.itemSize = ElementView._A_ITEM_SIZE;
  this.aBuffer.numItems = length * ElementView._A_ITEM_NUM;

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.iArray, gl.STATIC_DRAW);
  this.iBuffer.itemSize = ElementView._I_ITEM_SIZE;
  this.iBuffer.numItems = length * ElementView._I_ITEM_NUM;
};


ElementsDrawer.prototype._draw = function(layer) {
  var gl = layer.gl;

  gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
  gl.vertexAttribPointer(layer.shader.vertexPositionAttribute,
                         this.vBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.aBuffer);
  gl.vertexAttribPointer(layer.shader.colorAttribute,
                         this.aBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.cBuffer);
  gl.vertexAttribPointer(layer.shader.textureCoordAttribute,
                         this.cBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, this.texture);
  gl.uniform1i(layer.shader.uSamplerUniform, 0);

  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.enable(gl.BLEND);
  gl.disable(gl.DEPTH_TEST);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
  layer.setMatrixUniforms(gl);
  gl.drawElements(gl.TRIANGLES, this.iBuffer.numItems, gl.UNSIGNED_SHORT, 0);
};


ElementsDrawer.prototype._prepareDraw = function(layer) {
};


ElementsDrawer.prototype.draw = function(layer) {
  this._pourArray();
  this._pourBuffer(layer.gl);
  mat4.identity(layer.mvMatrix);
  this._prepareDraw(layer);
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
}

Element._STATE_ALIVE = 1 ;
Element._STATE_DEAD  = 2 ;

Element._FLAG_MOVE_STOP  =  0x1 ;
Element._FLAG_MOVE_LEFT  =  0x2 ;
Element._FLAG_MOVE_UP    =  0x4 ;
Element._FLAG_MOVE_RIGHT =  0x8 ;
Element._FLAG_MOVE_DOWN  = 0x10 ;
Element._FLAG_SHOT       = 0x20 ;
Element._FLAG_HIT        = 0x40 ;
Element._FLAG_UNHITTABLE = 0x80 ;


Element.prototype.init = function(params, image) {
  this.image = image ;

  this.x               = this._getValueOrDefaultValue(params.x, 0);
  this.y               = this._getValueOrDefaultValue(params.y, 0);
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
  if( params.v == undefined ) {
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


Element.prototype._getValueOrDefaultValue = function( value, defaultValue ) {
  return value != undefined ? value : defaultValue ;
} ;


Element.prototype.free = function( ) {
  if( this.vector )
    this.moveVectorManager.free( this.vector ) ;
  if( this.gravity )
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
  var preTheta ;
  if( this.vector )
    preTheta = this.vector.theta ;
  var tmpTheta = this.vectors[ this.vectorIndex ].v.theta ;
  var tmpR     = this.vectors[ this.vectorIndex ].v.r ;

  // for special propose
  // these functions will updates this.vectors[ this.vectorIndex ],
  // so previous data needs to be saved.
  if( this.vectors[ this.vectorIndex ].v.aimed )
    this._calculateAimedVector( ) ;
  if( this.vectors[ this.vectorIndex ].v.target )
    this._calculateTargetVector( ) ;

  // set normal vector
  if( this.vector )
    this.moveVectorManager.free( this.vector ) ;
  this.vector = this.moveVectorManager.create( this.vectors[ this.vectorIndex ].v ) ;
  if( this.baseTheta )
    this.vector.theta += this.baseTheta ;
  if( preTheta && this.vectors[ this.vectorIndex ].v.theta == undefined )
    this.vector.theta = preTheta ;

  // restore previous data
  this.vectors[ this.vectorIndex ].v.theta = tmpTheta ;
  this.vectors[ this.vectorIndex ].v.r = tmpR ;

  // set gravity vector
  if( this.gravity )
    this.moveVectorManager.free( this.gravity ) ;
  if( this.vectors[ this.vectorIndex ].v.g )
    this.gravity = this.moveVectorManager.create( this.vectors[ this.vectorIndex ].v.g ) ;
  else
    this.gravity = null ;
} ;


/**
 * TODO: temporal
 */
Element.prototype._supplyPosition = function( ) {

  if( ! this.r || ! this.vector )
    return ;

  var ax = 0 ;
  var ay = 0 ;

  if( ! this.gravity ) {
    ax = this.r * Math.cos( this._calculateRadian( this.vector.theta ) ) ;
    ay = this.r * Math.sin( this._calculateRadian( this.vector.theta ) ) ;
  } else {
    var dx = this.vector.moveX( ) + this.gravity.moveX( ) ;
    var dy = this.vector.moveY( ) + this.gravity.moveY( ) ;
    var t = Math.atan2( dy, dx ) ;
    ax = this.r * Math.cos( t ) ;
    ay = this.r * Math.sin( t ) ;
  }

  this.setX( this.getX( ) + ax ) ;
  this.setY( this.getY( ) + ay ) ;

} ;


/**
 * TODO: temporal
 */
Element.prototype._calculateAimedVector = function( ) {
  var ax = this.gameState.fighter.getCenterX( ) - this.getCenterX( ) ;
  var ay = this.gameState.fighter.getCenterY( ) - this.getCenterY( ) ;
  this.vectors[ this.vectorIndex ].v.theta += this._calculateTheta( Math.atan2( ay, ax ) ) ;
} ;


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
  this.vectors[ this.vectorIndex ].v.theta = this._calculateTheta( Math.atan2( ay, ax ) ) ;
  this.vectors[ this.vectorIndex ].v.r = Math.sqrt( ax * ax + ay * ay ) / this.vectors[ this.vectorIndex ].v.target.count ;
} ;


/**
 * TODO: temporal
 * duplicated code
 */
Element.prototype._getRandomValue = function( range ) {
  var differ = range.max - range.min ;
  return parseInt( Math.random( ) * differ ) + range.min ;
} ;


Element.prototype._calculateRadian = function( theta ) {
  return theta * Math.PI / 180 ;
} ;


Element.prototype._calculateTheta = function( radian ) {
  return parseInt( radian * 180 / Math.PI ) ;
} ;


Element.prototype.display = function( surface, rotate, angle ) {
  var x = Math.round( this.getLeftX( ) ) ;
  var y = Math.round( this.getUpY( ) ) ;
  if( rotate ) {
    var rx = Math.round( this.getCenterX( ) ) ;
    var ry = Math.round( this.getCenterY( ) ) ;
    if( angle == null || angle == undefined )
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


Element.prototype.getWidth = function( ) {
  return this.width ;
} ;


Element.prototype.getHeight = function( ) {
  return this.height ;
} ;


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
  return this._calculateTheta( Math.atan2( ay, ax ) ) ;
} ;


Element.prototype.getXDirection = function( ) {
  if( ! this.vector )
    return 0 ;
  var cos = Math.cos( this._calculateRadian( this.getDirectionTheta( ) ) ) ;
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
  this.state = Element._STATE_DEAD ;
} ;


Element.prototype.isDead = function( ) {
  return this.state == Element._STATE_DEAD ;
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

