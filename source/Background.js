function BackgroundManager(gameState) {
  this.parent = ElementManager;
  this.parent.call(this, gameState);
  this.activeIndex = 0;
  this.oneElementActive = true;
  this.drawers = [];
  this._init();
};
__inherit(BackgroundManager, ElementManager);

BackgroundManager._MAX_NUM = 5;


BackgroundManager.prototype._initMaxNum = function() {
  return BackgroundManager._MAX_NUM;
};


/**
 * Unnecessary to have factory.
 */
BackgroundManager.prototype._initFactory = function() {
};


BackgroundManager.prototype._init = function() {
  this.add(new Background(this.gameState,
                          this.gameState.maxX,
                          this.gameState.maxY));
  this.add(new Background(this.gameState,
                          this.gameState.maxX,
                          this.gameState.maxY));
};


BackgroundManager.prototype.initDrawer = function(layer, image) {
  this.drawers.length = 0;
  this.drawers.push(new BackgroundsDrawer(
                          this, layer.gl,
                          this.gameState.getImage(Game._IMG_BG1)));
  this.drawers.push(new BackgroundsDrawer(
                          this, layer.gl,
                          this.gameState.getImage(Game._IMG_BG2)));
};


BackgroundManager.prototype.draw = function(layer) {
  this.drawers[this.activeIndex].draw(layer);
};


/**
 * should not call parent reset() method to
 * keep elements available.
 */
BackgroundManager.prototype.reset = function() {
  this.activeIndex = 0;
  // cannot use this.elements.getNum() here.
  // TODO: bad design
  for(var i = 0; i < this.elements.length; i++) {
    this.elements[i].reset();
  }
};


BackgroundManager.prototype.goNextStage = function() {
  this.activeIndex++;
};


BackgroundManager.prototype.getOne = function() {
  return this.get(this.activeIndex);
};


function BackgroundView(element) {
  this.parent = ElementView;
  this.parent.call(this, element);
};
__inherit(BackgroundView, ElementView);


BackgroundView.prototype._initVertices = function() {
  this.vertices[0]  = -2.0;
  this.vertices[1]  = -2.0;
  this.vertices[2]  =  0.0;

  this.vertices[3]  =  2.0;
  this.vertices[4]  = -2.0;
  this.vertices[5]  =  0.0;

  this.vertices[6]  =  2.0;
  this.vertices[7]  =  8.0;
  this.vertices[8]  =  0.0;

  this.vertices[9]  = -2.0;
  this.vertices[10] =  8.0;
  this.vertices[11] =  0.0;
};


BackgroundView.prototype._initCoordinates = function() {
  this.coordinates[0] = 0.0;
  this.coordinates[1] = 10.0;

  this.coordinates[2] = 4.0;
  this.coordinates[3] = 10.0;

  this.coordinates[4] = 4.0;
  this.coordinates[5] = 0.0;

  this.coordinates[6] = 0.0;
  this.coordinates[7] = 0.0;
};


function BackgroundsDrawer(elementManager, gl, image) {
  this.parent = ElementsDrawer;
  this.parent.call(this, elementManager, gl, image);
};
__inherit(BackgroundsDrawer, ElementsDrawer);


BackgroundsDrawer.prototype._project = function(layer) {
  layer.perspective(60, 0.1, 10.0);
};


BackgroundsDrawer.prototype._prepareDraw = function(layer) {
  mat4.rotate(layer.mvMatrix, Math.PI/180*50, [-1, 0, 0]);
};


function Background(gameState, maxX, maxY) {
  this.parent = Element;
  this.parent.call(this, gameState, maxX, maxY);
  this._initView();
};
__inherit(Background, Element);


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
Background.prototype.runStep = function() {
  this.parent.prototype.runStep.call(this);
  // TODO: should be in BackgroundView?
  this.y = (this.count%200)/200;
  this.z = -this.gameState.bgScale;
};
