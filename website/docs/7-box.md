# 立方体

上篇文章我们学到了如何变换物体，现在我们可以让[着色器](/5-shader.md)中的立方体动起来了。

我们可以先让立方体绕 Y 轴旋转，[上篇文章](/6-transform.md)中我们总结了各种旋转矩阵。

```js
function fromYRotation(rad) {
  const s = Math.sin(rad)
  const c = Math.cos(rad)
  return [
    c, 0, -s, 0,
    0, 1, 0, 0,
    s, 0, c, 0,
    0, 0, 0, 1
  ]
}
```

这里直接使用上篇文章中的绕 Y 轴矩阵，需要注意这里将它转置了一下，因为 OpenGL 中的矩阵是列主序的。

下面在[着色器](/5-shader.md)中关键代码的基础上添加新的代码。

```js {6,10,55,60-68}
const gl = createGl()

const program = createProgramFromSource(gl, `
attribute vec4 aPos;
attribute vec4 aColor;
uniform mat4 uMat;
varying vec4 vColor;

void main() {
  gl_Position = uMat * aPos;
  vColor = aColor;
}
`, `
precision mediump float;
varying vec4 vColor;

void main() {
  gl_FragColor = vColor;
}
`)

const points = new Float32Array([
  -0.5,0.5,-0.5, 0.5,0.5,-0.5, 0.5,-0.5,-0.5, -0.5,-0.5,-0.5,
  0.5,0.5,0.5, -0.5,0.5,0.5, -0.5,-0.5,0.5, 0.5,-0.5,0.5
  // 立方体的 8 个顶点
])
const colors = new Float32Array([
  1,0,0, 0,1,0, 0,0,1, 1,0,1,
  0,0,0, 0,0,0, 0,0,0, 0,0,0
  // 每个顶点的颜色
])
const indices = new Uint8Array([ // 面的索引，值是 points 的下标
  0, 1, 2, 0, 2, 3, // 前
  1, 4, 2, 4, 7, 2, // 右
  4, 5, 6, 4, 6, 7, // 后
  5, 3, 6, 5, 0, 3, // 左
  0, 5, 4, 0, 4, 1, // 上
  7, 6, 3, 7, 3, 2  // 下
])

const [posLoc, posBuffer] = createAttrBuffer(gl, program, 'aPos', points)
const [colorLoc, colorBuffer] = createAttrBuffer(gl, program, 'aColor', colors)
const indexBuffer = gl.createBuffer()
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(posLoc)

gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(colorLoc)

const matLoc = gl.getUniformLocation(program, 'uMat')

gl.enable(gl.DEPTH_TEST)
gl.clearColor(0, 1, 1, 1)

let r = 0
function draw() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.uniformMatrix4fv(matLoc, false, fromYRotation(r))
  gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_BYTE,0)
  r += 0.01
  requestAnimationFrame(draw)
}
draw()
```
