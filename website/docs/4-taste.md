# 浅尝

在实现编写代码之前，需要知道 WebGL 只是一个光栅化引擎，它非常底层，它只能用它来画点，线和三角形，那些复杂的 3D 模型都是由一个个三角形组成。只要愿意我们可以使用 canvas 2d 来实现 3D 效果。

[![image](https://user-images.githubusercontent.com/25923128/120994009-ad46b680-c7b6-11eb-82cf-9fed33463719.png)](https://sketchfab.com/3d-models/the-argonaut-4982efe9a03e42e6a867c33afd863ca5)

比如上方这辆汽车模型，它其实是由 267300 个三角形组成。

可以点击这个链接查看这个模型详情 [https://sketchfab.com/3d-models/the-argonaut-4982efe9a03e42e6a867c33afd863ca5](https://sketchfab.com/3d-models/the-argonaut-4982efe9a03e42e6a867c33afd863ca5) 。

可能有同学会问了，为什么就是三角形，而不是 5 边形，6 边形呢？

因为三角形有很多的优势，比如三角形一定在一个平面上，任何多边形都可以使用三角形组成等性值。

## 防走样

## 三角形

现在就让我们从最简单图形开始吧，渲染一个三角形。

```js
const canvas = document.createElement('canvas')
canvas.width = canvas.height = 300
document.body.append(canvas)
const gl = canvas.getContext('webgl')

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
// 告诉 webgl 如何将 NDC 坐标 变为屏幕上的坐标

const vertexShader = gl.createShader(gl.VERTEX_SHADER) // 创建一个顶点着色器
gl.shaderSource(vertexShader, `
  attribute vec4 a_position;

  void main() {
    gl_Position = a_position; // 设置顶点位置
  }
`) // 编写顶点着色器代码
gl.compileShader(vertexShader) // 编译着色器

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER) // 创建一个片元着色器
gl.shaderSource(fragmentShader, `
  precision mediump float;
  uniform vec4 u_color;

  void main() {
    gl_FragColor = u_color; // 设置片元颜色
  }
`) // 编写片元着色器代码
gl.compileShader(fragmentShader) // 编译着色器

const program = gl.createProgram() // 创建一个程序
gl.attachShader(program, vertexShader) // 添加顶点着色器
gl.attachShader(program, fragmentShader) // 添加片元着色器
gl.linkProgram(program) // 连接 program 中的着色器

gl.useProgram(program) // 告诉 webgl 用这个 program 进行渲染

const colorLocation = gl.getUniformLocation(program, 'u_color') // 获取 u_color 变量位置
gl.uniform4f(colorLocation, 0.93, 0, 0.56, 1) // 设置它的值

const positionLocation = gl.getAttribLocation(program, 'a_position') 
// 获取 a_position 位置
const positionBuffer = gl.createBuffer() 
// 创建一个顶点缓冲对象，返回其 ID，用来放三角形顶点数据，
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer) 
// 将这个顶点缓冲对象绑定到 gl.ARRAY_BUFFER
// 后续对 gl.ARRAY_BUFFER 的操作都会映射到这个缓存
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0, 0.5,
    0.5, 0,
    -0.5, -0.5
]),  // 三角形的三个顶点
     // 因为会将数据发送到 GPU，为了省去数据解析，这里使用 Float32Array 直接传送数据
gl.STATIC_DRAW // 表示缓冲区的内容不会经常更改
)
// 将顶点数据加入的刚刚创建的缓存对象

gl.vertexAttribPointer( // 告诉 OpenGL 如何从 Buffer 中获取数据
    positionLocation, // 顶点属性的索引
    2, // 组成数量，必须是1，2，3或4。我们只提供了 x 和 y
    gl.FLOAT, // 每个元素的数据类型
    false, // 是否归一化到特定的范围，对 FLOAT 类型数据设置无效
    0, // stride 步长 数组中一行长度，0 表示数据是紧密的没有空隙，让OpenGL决定具体步长
    0 // offset 字节偏移量，必须是类型的字节长度的倍数。
)
gl.enableVertexAttribArray(positionLocation);
// 开启 attribute 变量，使顶点着色器能够访问缓冲区数据

gl.clearColor(0, 1, 1, 1) // 设置清空颜色缓冲时的颜色值
gl.clear(gl.COLOR_BUFFER_BIT) // 清空颜色缓冲区，也就是清空画布

gl.drawArrays( // 从数组中绘制图元
    gl.TRIANGLES, // 渲染三角形
    0,  // 从数组中哪个点开始渲染
    3   // 需要用到多少个点，三角形的三个顶点
)
```

渲染结果如下图。

![image](https://user-images.githubusercontent.com/25923128/120929285-0d881a80-c71b-11eb-82fe-4813aeb0609e.png)

可见 WebGL 的代码非常繁琐，一个简单的三角形就需要编写这么多的代码。下面将一步步的分析上面的代码。

首先我们需要知道 WebGL 就是一个非常大的状态机，它提供的方法都是改变 WebGL 的某个状态。

我们需要在 CPU 中使用 JS 设置 WebGL 的状态，准备数据和着色器程序，然后发送给 GPU 执行。

上方代码可以分为如下几步。

1. 因为 WebGL 的坐标是 -1 到 1，所以首先我们使用 `viewport` 设置视口大小信息。
2. 创建顶点和片段着色器（关于着色器情况[下篇文章](/5-shader.md)），然后创建一个程序，来连接顶点和片段着色器。
3. 然后获取着色器中的变量，设置如何将值传递给着色器。三角形是由 3 个顶点组成，所以准备了 3 个点的坐标。
4. 设置清屏颜色，并清屏，**WebGL 中的颜色是 0 到 1，而不是 0 到 255**。
5. 渲染三角形

## 代码优化


