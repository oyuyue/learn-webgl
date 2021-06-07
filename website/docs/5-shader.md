# 着色器

WebGL 程序执行主要分为两个阶段，CPU 阶段和 GPU 阶段，在 CPU 中我们可以直接使用 JS 来编写代码，但是如果要控制 GPU 的渲染逻辑就需要使用着色器。

GPU 中的处理过程大致如下图，其中蓝色部分是我们可以控制的（忽略几何着色器，WebGL中没有）。

[![image](https://user-images.githubusercontent.com/25923128/121031222-be0a2300-c7dc-11eb-8fab-9c6a35687745.png)](https://learnopengl-cn.github.io/01%20Getting%20started/04%20Hello%20Triangle/)

之前有介绍过，WebGL 只能渲染点、线和三角形，那些复杂的 3D 模型都是一个个三角形组成的。一个三角形是由 3 个顶点组成，如果我们想渲染两个三角形，就提供 6 个顶点，WebGL 每处理完 3 个顶点后会将这三个顶点连接成一个三角形。

## 顶点着色器

顶点着色器用来处理每个顶点。下面是一个最简单的顶点着色器。

```c
attribute vec4 a_position;

void main() {
  gl_Position = a_position;
}
```

WebGL 会默认执行着色器中的 main 函数，顶点着色器中我们使用 `attribute` 存储限定字获取外部传入的顶点信息。然后使用 `gl_Position` （内置变量）输入处理过的顶点位置（比如在顶点着色器中将顶点左移 10px）。

我们可以使用下面的伪代码表示顶点着色器是如何被执行的。

```js
const points = [
  0, 0.5,
  0.5, 0,
  -0.5, -0.5
]
// 三角形的三个顶点，在 CPU 中提供的数据

const vertex = points.map(p => vertexShader(p))
// 获得最终的顶点位置
```

[![vertex-shader-anim](https://user-images.githubusercontent.com/25923128/121054661-282bc380-c7ef-11eb-95d4-4064dfa677dd.gif)](https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-how-it-works.html)

如上图中，我们从外部输入顶点坐标，然后在顶点着色器中对它进行矩阵运算，然后通过 `gl_Position` 变量输出新的坐标。（矩阵变换请查看[下篇文章](/6-transform.md)）

### attribute 存储限定字

`attribute` 只能用在顶点着色器，被用来表示逐顶点信息，比如顶点位置、顶点颜色等信息。我们可以通过它来获取外部传递过来的信息。上面例子中，我们定义了三个顶点传递给 `a_position` 变量，顶点着色器不是一次性获取到这些顶点，而是一个个的获取。

[上篇文章](/4-taste.md)中我们是这样向顶点着色器传递数据的。

```js
const positionLocation = gl.getAttribLocation(program, 'a_position')
const positionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0, 0.5,
    0.5, 0,
    -0.5, -0.5
]), gl.STATIC_DRAW)
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
```

我们首先获取变量 `a_position` 的位置。由于我们需要传递一堆的顶点，所以这里创建一个 Buffer 来存放这些顶点。我们还需要使用 `vertexAttribPointer` 告诉 WebGL 如何获取 Buffer 中的数据。

## 片段着色器

在顶点着色器处理完顶点后，WebGL 还会把这些三角形进行插值，将三角形变成一个个像素，然后对每个像素执行一次片段着色器，片段着色器中使用 `gl_FragColor` 内置变量输出这个像素的颜色。

[上篇文章](/4-taste.md)中的片段着色器代码如下。

```c
precision mediump float;
uniform vec4 u_color;

void main() {
  gl_FragColor = u_color;
}
```

### uniform 存储限定字

我们先忽略比顶点着色器多出的一行代码 `precision mediump float;`。我们在片段着色器中使用了 `uniform` 存储限定字获取了外部传递的数据。

`uniform` 存储限定字，可以用在片段着色器也可以用在顶点着色器，它是全局的，在着色器程序中是独一无二的。

[上篇文章](/4-taste.md)我们是这样传递数据到片段着色器中。

```js
const colorLocation = gl.getUniformLocation(program, 'u_color')
gl.uniform4f(colorLocation, 0.93, 0, 0.56, 1)
```

由于 `uniform` 是全局唯一的，相当于常量，所以不需要 Buffer，直接设置它的值就行了。`uniform4f` 方法后缀 `4f` 表示 4 个浮点数，在这里我们用来表示一个颜色值的 `rgba`。

## GLSL

OpenGL 的着色器使用 GLSL(OpenGL Shading Language) 语言进行编写，它有点像 C 语言。在 OpenGL ES 和 WebGL 中使用的是 GLSL ES。

它是强类型语言，每一句都必须有分号。它和 JS 语法也挺像。

注释语法和 JS 一样，变量名规则也和 JS 一样，不能使用关键字，保留字，不能以 `gl_`、`webgl_` 或 `_webgl_` 开头。运算符基本也和 JS 一样，`++` `--` `+=` `&&` `||` 还有三元运算符都支持。

GLSL 中主要有三种数据值类型，浮点数、整数和布尔。注意浮点数必须要带小数点。类型转换可以直接使用 `float`、`int` 和 `bool` 函数。

```c
float f = float(1);
```

### 矢量和矩阵

### 分支和循环

### 函数

### 精度限定字

## 立方体

```js
const canvas = document.createElement('canvas')
canvas.width = canvas.height = 300
document.body.appendChild(canvas)
const gl = canvas.getContext('webgl')
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

const program = createProgramFromSource(gl, `
attribute vec4 aPos;
attribute vec4 aColor;
varying vec4 vColor;

void main() {
  gl_Position = aPos;
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
])
const colors = new Float32Array([
  1,0,0, 0,1,0, 0,0,1, 1,0,1,
  0,0,0, 0,0,0, 0,0,0, 0,0,0
])
const indices = new Uint8Array([
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

gl.enable(gl.DEPTH_TEST)
gl.clearColor(0, 1, 1, 1)
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

gl.drawElements(
  gl.TRIANGLES, // 要渲染的图元类型
  indices.length, // 要渲染的元素数量
  gl.UNSIGNED_BYTE, // 元素数组缓冲区中的值的类型
  0 // 元素数组缓冲区中的偏移量, 字节单位
)

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

### varying 存储限定字

## 总结
