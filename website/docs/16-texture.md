# 纹理

纹理（Texture）是一张图片，它可以贴在模型的表面就像皮肤一样。除了图像之外它还可以存储其他数据，这将在后面章节中详细讲解。

```js {10,13,18-19,22,35-38} run
const image = new Image()
image.onload = () => render(image)
image.src = `${location.origin}/learn-webgl/img/uv.jpg`

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
    0, 0, 1, 0, 1, 1,
    0, 0, 1, 1, 0, 1
  ]))

  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(posLoc)

  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
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

上面代码将下面这张图片使用 WebGL 渲染出来。

![](/img/uv.jpg)

和颜色值一样图片的宽度和高度值的范围是 `0` 到 `1`。而且期望图片原点在左下角，但是一般图片在原点在左上角，这也是为什么渲染的结果和实际图片是上下颠倒的。

上面代码中首先指定了两个三角形的 6 个顶点，用它们组合成一个正方形。然后创建一个纹理，将纹理绑定的到 `TEXTURE_2D` 上，使用 `texParameteri` 设置纹理渲染方式，最后使用 `texImage2D` 设置图片数据，这个流程和传入顶点坐标很相似，首先创建 `Buffer` 然后绑定 `Buffer` 最后设置顶点数据到 `Buffer`。



