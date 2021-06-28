# 坐标空间

我们前面学到了各种变换矩阵用来变换物体，相机从某个位置来观看场景，投影矩阵将场景转换到 NDC。我们每将物体顶点应用一个矩阵其实都是将物体转换到矩阵的空间，矩阵的 3 列是新坐标空间的基矢量。渲染一个场景我们一般会使用 3 个矩阵将场景转换到 3 个坐标空间，这几个步骤是分步进行就和流水线一样。

<img src="https://user-images.githubusercontent.com/25923128/123030144-df8e2000-d414-11eb-8e1f-4d14e7433dd6.png" width="300"></img>

物体最初是在对象空间，经过模型变换（Model Transform）将物体转换到世界空间，在世界空间中经过视图变换（View Transform）转换成相机空间（或眼空间）最后通过投影变换（Projection Transform）变换到裁切空间。这几次变换简称为 MVP 变换，一般每个物体在渲染之前都会进行这 3 次变换。

![image](https://user-images.githubusercontent.com/25923128/122650168-ef330d80-d163-11eb-94d0-ee2270f5ca48.png)

## 对象空间

对象空间也称为局部空间，制作 3D 模型时我们并不知道这个模型最终在场景中的位置，一般将模型放在坐标轴的正中间，就像我们之前手写封装的盒子，我们也将它的中心放到坐标轴的正中心。

## 世界空间

世界空间就是我们渲染的一个场景，所有模型都在这个空间，这些模型默认都在对象空间也就是全部都在坐标原点。我们需要使用**模型变换**分别将这个模型变换到它应该在的位置。比如一个飞机模型，我们可以使用模型变换将它变换到世界坐标的空中位置。或者一个模型太大了，我们使用**模型变换**将它缩小。在模型变换后，我们就将这些模型从原点变换到它们应该在的位置并且是合适的大小和旋转角度。

## 相机空间

相机空间也称观察空间是从相机的视角所观察到的空间，将模型都放在了合适的位置后，我们就需要以一个角度去观察这个场景，通过**视图变换**将世界空间变换到相机空间。

## 裁剪空间

OpenGL 只会将 XYZ 轴 -1 和 1 之间物体渲染到屏幕，这个范围之外的点都应该被裁剪掉。在转换到相机空间后，我们还需要使用**投影矩阵**将相机空间转换到这个规则观察体空间，由投影矩阵创建的观察箱被称为平截头体(Frustum)，不同的投影矩阵会形成不同的平截头体，[上篇文章](/9-projection.md)中，我们知道正交投影是一个方方正正的盒子，透视投影是四角锥台。使用**投影矩阵**转换到裁切空间后，OpenGL 会在顶点着色器执行后，自动执行齐次除法得到每个点的坐标。

## NDC 空间

将裁剪空间坐标赋值给 `gl_Position` 后，OpenGL 会自动执行透视除法 `[Xc / Wc, Yc / Wc, Zc / Wc]`，将裁剪空间转换到 NDC 空间。

## 渲染管线

我们现在来将这些概念全部串起来，一个模型渲染到显示器上一共会经过哪些步骤。

1. 提供模型顶点坐标数据
2. 运行顶点着色器，在顶点着色器中对逐顶点进行处理，进行上面提到的 MVP 变换到[标准化设备坐标](/2-coordinate.md)
3. 顶点后处理
    1. 图元组装，将一个个顶点组装成三角形或线等 OpenGL 支持的图元
    2. [面剔除](/7-box.md)
    3. 剔除平截头体外的图元(`-w <= x <= w; -w <= y <= w; -w <= z <= w`)，不同图元有不同的处理方式。如果三角形刚好只有一部分在外面，会生成在内部的顶点，将外部的部分剔除
    4. 透视除法，上面提到的 `[x / w, y / w, z / w]`
    5. 视口变换，将 NDC 空间转换到窗口空间，我通过 `gl.viewport(x, y, width, height)` 和 `gl.depthRange(near, far)` 指定窗口相关信息
        ```js
        halfWidth = width / 2
        halfHeight = height / 2

        Xw = halfWidth * Xndc + x + halfWidth
        Yw = halfHeight * Yndc + y + halfHeight
        Zw = (far - near) / 2 * Zndc + (far + near) / 2 = Depth
        ```
        `Zw` 是当前深度值
4. 光栅化，将每个单独的图元分解成离散的片段（可以简单理解为将 SVG 变成像素图），[varying](/5-shader.md)参数插值
5. 运行片段着色器，处理逐片段
6. 逐采样处理（后面文章详细讲解）

## gl_FragCoord

[前面章节](/8-camera.md)中，我们在片段着色器中使用了 `gl_FragCoord`。现在就来好好了解这个它吧。

`gl_FragCoord` 是只读的 `vec4` 类型变量。我们可以在片段着色器中访问它，它包含当前片段窗口坐标相关的信息。`gl_FragCoord.xyz` 就是上面视口变换中的 `[Xw, Yw, Zw]`。`gl_FragCoord.w` 是 `1 / clip.w`，`clip.w` 是裁剪空间的 W 分量，也就是 `gl_Position.w`。

可以通过 `gl_FragCoord` 计算当前片段在其他空间的坐标。

```js
ndcPos.xy = ((2.0 * gl_FragCoord.xy) - (2.0 * viewport.xy)) / (viewport.zw) - 1;
ndcPos.z = (2.0 * gl_FragCoord.z - gl_DepthRange.near - gl_DepthRange.far) /
    (gl_DepthRange.far - gl_DepthRange.near);
ndcPos.w = 1.0;

vec4 clipPos = ndcPos / gl_FragCoord.w;
vec4 eyePos = projectionMatrixInverse * clipPos;
```

根据上面视口变换的公式，我们就可以反推出来 NDC 空间的坐标值，然后手动将 NDC 乘 `clip.w` 转换到裁剪空间，再通过逆投影矩阵转换到眼空间，我们还可以接着用逆矩阵转换到世界空间。

## 渲染多个立方体

现在让我们来用 MVP 矩阵来渲染多个立方体吧。

```js {10} run
const gl = createGl()

const program = createProgramFromSource(gl, `
attribute vec4 position;
uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

void main() {
  gl_Position = projection * view * model * position;
}
`, `
precision highp float;

void main() {
  gl_FragColor = vec4(gl_FragCoord.zzz, 1);
}
`)

const box = createBox()
// { index: { value: [], size: 1 }, position: { value: [], size: 3 } }

const indexBuffer = gl.createBuffer()
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, box.index.value, gl.STATIC_DRAW)

const [posLoc] = createAttrBuffer(gl, program, 'position', box.position.value)
gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(posLoc)

const camera = new Camera()
camera.position.x = camera.position.y = 0
camera.position.z = 5
camera.lookAt([0, 0, 0])
const viewLoc = gl.getUniformLocation(program, 'view')
gl.uniformMatrix4fv(viewLoc, false, camera.viewMatrix)

const perLoc = gl.getUniformLocation(program, 'projection')
gl.uniformMatrix4fv(perLoc, false, Mat4.perspective(45 * Math.PI / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 1, 100))

const modelLoc = gl.getUniformLocation(program, 'model')

gl.enable(gl.DEPTH_TEST)
gl.enable(gl.CULL_FACE)
gl.clearColor(0, 0, 0, 0)

let r = 0
render()

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  const rotation = Mat4.fromYRotation(r)

  drawBox(-1, 1, 0, rotation)
  drawBox(1, 1, 0, rotation)
  drawBox(1, -1, 0, rotation)
  drawBox(-1, -1, 0, rotation)
  drawBox(0, 0, 1, rotation)
  drawBox(0, 0, -1, rotation)

  r += 0.01

  requestAnimationFrame(render)
}

function drawBox(x, y, z, rotation) {
  gl.uniformMatrix4fv(modelLoc, false, Mat4.multiply(rotation, Mat4.fromTranslation([x, y, z])))
  gl.drawElements(gl.TRIANGLES, box.index.value.length, gl.UNSIGNED_SHORT, 0)
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
