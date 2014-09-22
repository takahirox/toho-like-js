function Layer(canvas) {
  this.canvas = canvas;
  this.gl = this._initGl(canvas);
  this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
  this.shader = this._initShader(this.gl);
  this.mvMatrix = mat4.create();
  this.pMatrix = mat4.create();

  // These are for one texture drawing.
  // TODO: remove magic numbers.
  this.vArray = this.createFloatArray(12);
  this.cArray = this.createFloatArray(8);
  this.iArray = this.createUintArray(6);
  this.aArray = this.createFloatArray(16);
  this.vBuffer = this.gl.createBuffer();
  this.cBuffer = this.gl.createBuffer();
  this.iBuffer = this.gl.createBuffer();
  this.aBuffer = this.gl.createBuffer();
};

Layer.prototype.mat4 = mat4; // only for reference.

Layer.prototype._NAMES = ['webgl', 'experimental-webgl'];

Layer.prototype._BLEND_ALPHA     = 0;
Layer.prototype._BLEND_ALPHA2    = 1;
Layer.prototype._BLEND_ADD_ALPHA = 2;

Layer.prototype._SHADERS = {};

Layer.prototype._SHADERS['shader-vs'] = {};
Layer.prototype._SHADERS['shader-vs'].type = 'x-shader/x-vertex';
Layer.prototype._SHADERS['shader-vs'].src = '\
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

Layer.prototype._SHADERS['shader-fs'] = {};
Layer.prototype._SHADERS['shader-fs'].type = 'x-shader/x-fragment';
Layer.prototype._SHADERS['shader-fs'].src = '\
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
  var names = this._NAMES;
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
  var params = this._SHADERS['shader-vs'];
  return this._compileShader(gl, params.src, params.type);
};


Layer.prototype._initFragmentShader = function(gl) {
  var params = this._SHADERS['shader-fs'];
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
  this.mat4.perspective(theta, this.gl.viewportWidth / this.gl.viewportHeight,
                   near, far, this.pMatrix);
};


Layer.prototype.ortho = function(near, far) {
  this.mat4.ortho(0, this.gl.viewportWidth, -this.gl.viewportHeight, 0,
             near, far, this.pMatrix);
};


Layer.prototype.lookAt = function(eye, center, up) {
  this.mat4.lookAt(eye, center, up, this.mvMatrix);
};


Layer.prototype.identity = function() {
  this.mat4.identity(this.mvMatrix);
};


/**
 * pre_multiplied argument is a last resort.
 */
Layer.prototype.generateTexture = function(image) {
  var gl = this.gl;
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
//  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
//  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.bindTexture(gl.TEXTURE_2D, null);
  return texture;
};


Layer.prototype.draw = function(texture, vBuffer, cBuffer, iBuffer, aBuffer,
                                blend) {
  var gl = this.gl;
  var shader = this.shader;

  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.vertexAttribPointer(shader.vertexPositionAttribute,
                         vBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, aBuffer);
  gl.vertexAttribPointer(shader.colorAttribute,
                         aBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.vertexAttribPointer(shader.textureCoordAttribute,
                         cBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.uniform1i(shader.uSamplerUniform, 0);

  var param1;
  var param2;
  switch(blend) {
    case this._BLEND_ALPHA2:
      param1 = gl.ONE;
      param2 = gl.ONE_MINUS_SRC_ALPHA;
      break;
    case this._BLEND_ADD_ALPHA:
      param1 = gl.SRC_ALPHA;
      param2 = gl.ONE;
      break;
//  case this._BLEND_ALPHA:
//  case null:
    default:
      param1 = gl.SRC_ALPHA;
      param2 = gl.ONE_MINUS_SRC_ALPHA;
      break;
  }
  gl.blendFuncSeparate(param1, param2, gl.ONE, gl.ONE);

//  gl.enable(gl.DEPTH_TEST);
//  gl.depthFunc(gl.LEQUAL);
  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
  this.setMatrixUniforms(gl);
  gl.drawElements(gl.TRIANGLES, iBuffer.numItems, gl.UNSIGNED_SHORT, 0);
};


/**
 * TODO: gl.bufferSubData and pratial update could improve
 *       CPU-GPU transfer performance.
 */
Layer.prototype.pourArrayBuffer = function(buffer, array, itemSize, numItems) {
  var gl = this.gl;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
  buffer.itemSize = itemSize;
  buffer.numItems = numItems;
};


Layer.prototype.pourElementArrayBuffer = function(buffer, array, itemSize,
                                                  numItems) {
  var gl = this.gl;
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, array, gl.STATIC_DRAW);
  buffer.itemSize = itemSize;
  buffer.numItems = numItems;
};


Layer.prototype.createFloatArray = function(num) {
  return new Float32Array(num);
};


Layer.prototype.createUintArray = function(num) {
  return new Uint16Array(num);
};


Layer.prototype.createBuffer = function() {
  return this.gl.createBuffer();
};


/**
 * This method is to easily draw one texture.
 * I wanna use image, not texture.
 * But cannot do that cuz of performance reason.
 */
Layer.prototype.drawOneTexture = function(texture, x, y, z, w, h, d, a, blend) {
  y = -y;

  this.vArray[0]  = x-w/2;
  this.vArray[1]  = y-h/2;
  this.vArray[2]  = z;
  this.vArray[3]  = x+w/2;
  this.vArray[4]  = y-h/2;
  this.vArray[5]  = z;
  this.vArray[6]  = x+w/2;
  this.vArray[7]  = y+h/2;
  this.vArray[8]  = z;
  this.vArray[9]  = x-w/2;
  this.vArray[10] = y+h/2;
  this.vArray[11] = z;
  this.pourArrayBuffer(this.vBuffer, this.vArray, 3, 4);

  this.cArray[0] = 0.0;
  this.cArray[1] = 1.0;
  this.cArray[2] = 1.0;
  this.cArray[3] = 1.0;
  this.cArray[4] = 1.0;
  this.cArray[5] = 0.0;
  this.cArray[6] = 0.0;
  this.cArray[7] = 0.0;
  this.pourArrayBuffer(this.cBuffer, this.cArray, 2, 4);

  this.iArray[0] = 0;
  this.iArray[1] = 1;
  this.iArray[2] = 2;
  this.iArray[3] = 0;
  this.iArray[4] = 2;
  this.iArray[5] = 3;
  this.pourElementArrayBuffer(this.iBuffer, this.iArray, 1, 6);

  this.aArray[0] = d;
  this.aArray[1] = d;
  this.aArray[2] = d;
  this.aArray[3] = a;
  this.aArray[4] = d;
  this.aArray[5] = d;
  this.aArray[6] = d;
  this.aArray[7] = a;
  this.aArray[8] = d;
  this.aArray[9] = d;
  this.aArray[10] = d;
  this.aArray[11] = a;
  this.aArray[12] = d;
  this.aArray[13] = d;
  this.aArray[14] = d;
  this.aArray[15] = a;
  this.pourArrayBuffer(this.aBuffer, this.aArray, 4, 4);

  this.draw(texture, this.vBuffer, this.cBuffer, this.iBuffer, this.aBuffer,
            blend);
};


Layer.prototype.calculateSquareValue = function(num) {
  return Layer.calculateSquareValue(num);
};


/**
 * Static method.
 */
Layer.calculateSquareValue = function(num) {
  var val = 1;
  while(num > val) {
    val = val << 1;
  }
  return val;
};
