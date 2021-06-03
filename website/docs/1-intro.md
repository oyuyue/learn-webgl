# 介绍

WebGL（Web图形库）是一个JavaScript API，可在任何兼容的 Web 浏览器中渲染高性能的交互式 3D 和 2D 图形或大量计算（机器学习），而无需使用插件，由非营利 Khronos Group 设计和维护。

使用 WebGL 的方式和 canvas 2d 类似，都是通过 `getContext` 方法获取渲染上下文。

```js
const canvas = document.createElement('canvas')

const gl = (
  canvas.getContext('webgl2') ||
  canvas.getContext('webgl') ||
  canvas.getContext('experimental-webgl')
)
```

上面代码中是按照 `webgl2`、`webgl`、`experimental-webgl` 的顺序获取 WebGL 渲染上下文。`webgl2` 是最新版本，它几乎完全兼容 WebGL1。`experimental-webgl` 用来兼容老浏览器，如 IE 11。

![](/img/webgl-compat.png)

大多数浏览器都支持 WebGL1。也有很多现代浏览器支持 WebGL2，但是苹果还不支持 WebGL2，所以编写 WebGL 程序时，需要向下降级到 WebGL1。

![](/img/webgl2-compat.png)

## OpenGL

WebGL 是基于 OpenGL的。OpenGL(Open Graphics Library) 是用于渲染2D、3D矢量图形的跨语言、跨平台的应用程序编程接口，常用于CAD、虚拟现实、科学可视化程序和电子游戏开发。OpenGL 通常是显卡生产商根据规范来实现的。

OpenGL 前身是 SGI 的 IRIS GL API 它在当时被认为是最先进的科技并成为事实上的行业标准，后由 SGI 转变为一项开放标准 OpenGL。1992年 SGI 创建 OpenGL架构审查委员会，2006年将 OpenGL API 标准的控制权交给 Khronos Group。

OpenGL 是跨平台的，在移动设备上是使用 OpenGL ES(OpenGL for Embedded Systems)， 它是 OpenGL 的子集。下图展示了 OpenGL 和 OpenGL ES 的时间线。

![](/img/opengl-timeline.png)

WebGL 基于 OpenGL，是 OpenGL 的子集。WebGL1 基于 OpenGL ES 2.0。WebGL2 基于 OpenGL ES 3.0。

## GPU

WebGL 性能高的原因是它使用到了 GPU。GPU 和 CPU 针对的是两种不同的应用场景，大家可以把 CPU 想象为一个教授，它什么都知道，而 GPU 是一群小学生，只能做些简单的计算，所以对于大量简单计算 GPU 的执行速度是远大于 CPU 的。

![](/img/gpu.png)

上图是显卡 3090 的配置参数，我们可以看到它有 1 万多个核心，24G 显存。支持 3D API，DirectX 12 Ultimate 和 OpenGL 4.6 （DirectX 是微软的图形 API）。

## 渲染管线

一般 WebGL 程序是 JS 提供数据（在 CPU 中运行），然后将数据发送到显存中，交给 GPU 渲染，我们可以使用着色器控制 GPU 渲染管线部分阶段。

```js
// CPU
const vertexShader = `shader source code` // 顶点着色器代码
const fragmentShader = `shader source code` // 片段着色器代码
const points = [{ x: 1, y: 1, z: 1 }/* ... */]  // 准备数据
gl.draw(points, vertexShader, fragmentShader) // 将数据和着色器发送给 GPU

// GPU
const positions = data.map(point => vertexShader(point)) // 运行顶点着色器
const frags = Rasterization(positions) // 光栅化
const colors = frags.map(frag => fragmentShader(frag)) // 运行片段着色器
Display(colors) // 渲染到屏幕
```

上面的伪代码，简单展示了 WebGL 程序的执行流程。OpenGL 中着色器是使用 GLSL 编写，它有点类似 C 语言，我们可以通过顶点着色器和片段着色器控制 GPU 渲染的部分环节。现在还不了解整个渲染管线没有关系，后面会更加详细的讲解。

## 例子

WebGL 有非常多，非常酷的例子，下面列举一些不错例子。（学完这个系列教程你也可以做出下面这些炫酷的程序哦~）

### ThreeJS

ThreeJS 中有非常多炫酷的例子，可以点击的链接进入官网查看。

[https://threejs.org/](https://threejs.org/)

### 
