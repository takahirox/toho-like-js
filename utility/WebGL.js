function Layer(canvas) {
  this.canvas = canvas;
  this.gl = this._initGl(canvas);
  this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
  this.shader = this._initShader(this.gl);
  this.mvMatrix = mat4.create();
  this.pMatrix = mat4.create();
};

Layer._NAMES = ['webgl', 'experimental-webgl'];

Layer._SHADERS = {};

Layer._SHADERS['shader-vs'] = {};
Layer._SHADERS['shader-vs'].type = 'x-shader/x-vertex';
Layer._SHADERS['shader-vs'].src = '\
  attribute vec3 aVertexPosition;\
  attribute vec2 aTextureCoordinates;\
  attribute vec4 aColor;\
\
  uniform mat4 uMVMatrix;\
  uniform mat4 uPMatrix;\
\
  varying vec2 vTextureCoordinates;\
  varying vec4 vColor;\
  void main() {\
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\
    vTextureCoordinates = aTextureCoordinates;\
    vColor = aColor;\
  }\
';

Layer._SHADERS['shader-fs'] = {};
Layer._SHADERS['shader-fs'].type = 'x-shader/x-fragment';
Layer._SHADERS['shader-fs'].src = '\
  precision mediump float;\
  varying vec2 vTextureCoordinates;\
  uniform sampler2D uSampler;\
  varying vec4 vColor;\
  void main() {\
    vec4 textureColor = texture2D(uSampler, vTextureCoordinates);\
    gl_FragColor = textureColor * vColor;\
  }\
';


Layer.prototype._initGl = function(canvas) {
  var names = Layer._NAMES;
  var context = null;
  for(var i = 0; i < names.length; i++) {
    try {
      context = canvas.getContext(names[i]);
    } catch(e) {
      if(context)
        break;
    }
  }
  if(context) {
    context.viewportWidth = canvas.width;
    context.viewportHeight = canvas.height;
  } else {
    alert("Failed to create WebGL context!");
  }
  return context;
};


Layer.prototype._compileShaderFromDOM = function(gl, id) {
  var script = document.getElementById(id);

  if(!script)
    return null;

  var source = '';
  var currentChild = script.firstChild;
  while(currentChild) {
    if(currentChild.nodeType == 3) { // 3 corresponds to TEXT_NODE
      source += currentChild.textContent;
    }
    currentChild = currentChild.nextSibling;
  }

  return this._compileShader(gl, source, script.type);
};


Layer.prototype._compileShader = function(gl, source, type) {
  var shader;
  if(type == 'x-shader/x-fragment') {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if(type == 'x-shader/x-vertex') {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
};


Layer.prototype._initVertexShader = function(gl) {
  var params = Layer._SHADERS['shader-vs'];
  return this._compileShader(gl, params.src, params.type);
};


Layer.prototype._initFragmentShader = function(gl) {
  var params = Layer._SHADERS['shader-fs'];
  return this._compileShader(gl, params.src, params.type);
};


Layer.prototype._initShader = function(gl) {
  var vertexShader = this._initVertexShader(gl);
  var fragmentShader = this._initFragmentShader(gl);

  var shader = gl.createProgram();
  gl.attachShader(shader, vertexShader);
  gl.attachShader(shader, fragmentShader);
  gl.linkProgram(shader);

  if(!gl.getProgramParameter(shader, gl.LINK_STATUS)) {
    alert("Failed to setup shaders");
  }

  gl.useProgram(shader);

  shader.vertexPositionAttribute =
    gl.getAttribLocation(shader, 'aVertexPosition');
  gl.enableVertexAttribArray(shader.vertexPositionAttribute);

  shader.textureCoordAttribute = 
    gl.getAttribLocation(shader, 'aTextureCoordinates');
  gl.enableVertexAttribArray(shader.textureCoordAttribute);

  shader.colorAttribute =
    gl.getAttribLocation(shader, 'aColor');
  gl.enableVertexAttribArray(shader.colorAttribute);

  shader.pMatrixUniform =
    gl.getUniformLocation(shader, 'uPMatrix');
  shader.mvMatrixUniform =
    gl.getUniformLocation(shader, 'uMVMatrix');

  shader.uSamplerUniform =
    gl.getUniformLocation(shader, 'uSampler');

  return shader;
}


Layer.prototype.setMatrixUniforms = function(gl) {
  gl.uniformMatrix4fv(this.shader.pMatrixUniform, false, this.pMatrix);
  gl.uniformMatrix4fv(this.shader.mvMatrixUniform, false, this.mvMatrix);
}


Layer.prototype.viewport = function() {
  this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
};


Layer.prototype.clear = function() {
  this.gl.clear(this.gl.COLOR_BUFFER_BIT);
};


Layer.prototype.perspective = function(theta, near, far) {
  mat4.perspective(theta, this.gl.viewportWidth / this.gl.viewportHeight,
                   near, far, this.pMatrix);
};


Layer.prototype.ortho = function(near, far) {
  mat4.ortho(-this.gl.viewportWidth/2,
              this.gl.viewportWidth/2,
             -this.gl.viewportHeight/2,
              this.gl.viewportHeight/2,
              near, far, this.pMatrix);
};
