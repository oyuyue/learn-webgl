# 纹理

纹理（Texture）是一张图片，它可以贴在模型的表面就像皮肤一样。除了图像之外它还可以存储其他数据，这将在后面章节中详细讲解。

```js run
const image = new Image()
image.crossOrigin=''
image.onload=() => render(image)
image.src='http://localhost:3000/learn-webgl/img/uv.jpg'

function render(image) {
  const gl = createGl()

  const program = createProgramFromSource(gl, `
  attribute vec4 pos;
  varying vec2 texCoord;

  void main() {
    texCoord = pos.xy;
    gl_Position = pos;
  }
  `, `
  precision mediump float;
  uniform sampler2D img;
  varying vec2 texCoord;

  void main() {
    gl_FragColor = texture2D(img, texCoord);
  }
  `)

  const [posLoc, posBuffer] = createAttrBuffer(gl, program, 'pos', new Float32Array([
    0.0,  0.0,
    1.0,  0.0,
    0.0,  1.0,
    0.0,  1.0,
    1.0,  0.0,
    1.0,  1.0,
  ]))

  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(posLoc)

  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)

  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, 6)
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  return shader;
}

function createProgramFromSource(gl, vertex, fragment) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER,vertex)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment)
  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  gl.useProgram(program)
  return program
}

function createAttrBuffer(gl, program, attr, data) {
  const location = gl.getAttribLocation(program, attr)
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
  return [location, buffer]
}
```




