function BackgroundManager(gameState) {
  this.parent = ElementManager;
  this.parent.call(this, gameState);
  this.activeIndex = 0;
  this.drawers = [];
  this.effectTextures = [];
  this._init();
};
__inherit(BackgroundManager, ElementManager);

BackgroundManager.prototype._MAX_NUM = 5;


BackgroundManager.prototype._initMaxNum = function() {
  return this._MAX_NUM;
};


/**
 * Unnecessary to have factory.
 */
BackgroundManager.prototype._initFactory = function() {
};


BackgroundManager.prototype._init = function() {
  this.elements.length = 0;
  this.add(new Background(this.gameState,
                          this.gameState.maxX,
                          this.gameState.maxY));
  this.add(new Background(this.gameState,
                          this.gameState.maxX,
                          this.gameState.maxY));
};


BackgroundManager.prototype.initDrawer = function(layer, image) {
  this.drawers.length = 0;
  this.drawers.push(new BackgroundDrawer(
                          this.get(0), layer,
                          this.gameState.getImage(Game._IMG_BG1)));
  this.drawers.push(new BackgroundDrawer(
                          this.get(1), layer,
                          this.gameState.getImage(Game._IMG_BG2)));

  this.effectTextures.length = 0;
  this._initForwardBlackEffect(layer);
};


/**
 * TODO: is there a way to generate non-premultiplied image?
 */
BackgroundManager.prototype._initForwardBlackEffect = function(layer) {
  var h = 3;
  var loop = 40;

  var width = layer.calculateSquareValue(this.gameState.getWidth());
  var height = layer.calculateSquareValue(h*loop);

  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  var surface = canvas.getContext('2d');

  surface.fillStyle = 'rgb(0, 0, 0)';
  for(var i = 0; i < loop; i++) {
    surface.globalAlpha = 0.4 - i * 0.01;
    surface.fillRect(0, i * h, width, h);
  }

  var texture = layer.generateTexture(canvas);
  texture.width = width;
  texture.height = height;

  this.effectTextures.push(texture);
};


BackgroundManager.prototype.setDarkness = function(d) {
  this.get(this.activeIndex).getView().setDarkness(d);
};


BackgroundManager.prototype.draw = function(layer, darken) {
  var d = darken ? 0.4 : 1.0;

  this.setDarkness(d);
  this.drawers[this.activeIndex].draw(layer);

  if(! darken)
    this._drawEffect(layer);
};


BackgroundManager.prototype._drawEffect = function(layer) {
  var texture = this.effectTextures[0];
  layer.viewport();
  layer.ortho(0.1, 10.0);
  mat4.identity(layer.mvMatrix);
  layer.drawOneTexture(texture,
                       texture.width/2, texture.height/2, -1.0,
                       texture.width,   texture.height, 1.0, 1.0);
};


/**
 * should not call parent reset() method to
 * keep elements available.
 */
BackgroundManager.prototype.reset = function() {
  this.activeIndex = 0;
  for(var i = 0; i < this.getNum(); i++) {
    this.get(i).reset();
  }
};


BackgroundManager.prototype.goNextStage = function() {
  this.activeIndex++;
};



function BackgroundView(element) {
  this.parent = ElementView;
  this.parent.call(this, element);
};
__inherit(BackgroundView, ElementView);


BackgroundView.prototype.setDarkness = function(d) {
  this.d = d;
};


BackgroundView.prototype._initVertices = function() {
  this.vertices[0]  = -2.0;
  this.vertices[1]  =  2.0;
  this.vertices[2]  =  0.0;

  this.vertices[3]  =  2.0;
  this.vertices[4]  =  2.0;
  this.vertices[5]  =  0.0;

  this.vertices[6]  =  2.0;
  this.vertices[7]  = -8.0;
  this.vertices[8]  =  0.0;

  this.vertices[9]  = -2.0;
  this.vertices[10] = -8.0;
  this.vertices[11] =  0.0;
};


BackgroundView.prototype._initCoordinates = function() {
  this.coordinates[0] =  0.0;
  this.coordinates[1] = 10.0;

  this.coordinates[2] =  4.0;
  this.coordinates[3] = 10.0;

  this.coordinates[4] =  4.0;
  this.coordinates[5] =  0.0;

  this.coordinates[6] =  0.0;
  this.coordinates[7] =  0.0;
};



function BackgroundDrawer(elementManager, gl, image) {
  this.parent = ElementDrawer;
  this.parent.call(this, elementManager, gl, image);
};
__inherit(BackgroundDrawer, ElementDrawer);

// only for reference
BackgroundDrawer.prototype.Math = Math;
BackgroundDrawer.prototype.mat4 = mat4;



BackgroundDrawer.prototype._project = function(layer) {
  layer.perspective(60, 0.1, 100.0);
};


BackgroundDrawer.prototype._prepareDraw = function(layer) {
  this.mat4.rotate(layer.mvMatrix, this.Math.PI/180*50, [-1, 0, 0]);
};

/**
 * independent of fighter so far.
 * TODO: remove magic numbers.
 */
BackgroundDrawer.prototype.lookAtFromViewpointTarget = function(layer) {
  var eye = this._VIEWPOINTS_CONTAINERS[0];
  var center = this._VIEWPOINTS_CONTAINERS[1];
  var up = this._VIEWPOINTS_CONTAINERS[2];

  eye[0] = 0;
  eye[1] = -0.4;
  eye[2] = 0.1;

  center[0] = 0;
  center[1] = 0;
  center[2] = 0;

  layer.lookAt(eye, center, up);
};


function Background(gameState, maxX, maxY) {
  this.parent = Element;
  this.parent.call(this, gameState, maxX, maxY);
  this._initView();
};
__inherit(Background, Element);


/**
 * Excepts not to call this method unlike other Element inherit class.
 * TODO: bad design.
 */
Background.prototype.init = function(params, image) {
  this.image = image;
//  Prolly unnecessary to call perent init()
//  this.parent.prototype.init.call(this, params, image);
};


Background.prototype.reset = function() {
  this.count = 0;
  this.x = 0;
  this.y = 0;
  this.z = 0;
};


Background.prototype._generateView = function() {
  return new BackgroundView(this);
};


// not implemented yet and no plan to implement.
Background.prototype.display = function(surface) {
};


// TODO: temporal
Background.prototype.Element_runStep = Element.prototype.runStep;
Background.prototype.runStep = function() {
  this.Element_runStep();
  // TODO: should be in BackgroundView?
  this.y = (this.count%200)/200;
  this.z = -this.gameState.bgScale;
};

