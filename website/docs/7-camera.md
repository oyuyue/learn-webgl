# 摄像机

可以想象一个场景，场景中有很多的物体排列在不同的位置。我们拿个摄像机从不同角度拍摄这个场景，摄像机拍到的就是最终渲染在屏幕上的内容。

OpenGL 中并没有相机的概念，需要我们自己完成。摄像机也可以称为眼，从哪个角度去拍或从哪个角度去看。

在深入介绍之前，我们先来看下我们是怎么使用的。

```js
const camera = new Camera()

camera.position.x = 0.5
camera.position.y = 0.5
camera.position.z = 0.5
// 设置相机的位置

camera.lookAt(0, 0, 0)
// 设置相机看向原点

const matLoc = gl.getUniformLocation(program, 'uMat')
gl.uniformMatrix4fv(matLoc, false, camera.viewMatrix)
// 获取和设置 uniform

gl_Position = uMat * aPos;
// 在顶点着色器中将顶点乘上这个矩阵
```

我们首先创建了一个相机实例，然后设置了相机的位置，并让相机看向原点。`camera.viewMatrix` 就是根据相机的位置和看向方向生成的矩阵，我们只需要将这个矩阵应用在物体上，最终渲染出来的画面就是相机拍下来的画面。

要实现 `Camera` 类，我们需要求出相机的所在的坐标系，相机在它的坐标系原点，朝着 -Z 方向看。相机的坐标系还是[右手坐标系](/2-coordinate.md)。

![image](https://user-images.githubusercontent.com/25923128/122186917-19b16c00-cec1-11eb-8e56-0656ac73309e.png)

我们可以通过相机的位置减去目标的位置并归一化得到相机坐标轴中的 Z 轴，我们不需要坐标轴的长度只要它的方向，所以将它归一化为单位矢量。

:::info

这里会用到矢量的各种计算，如果对矢量不太了解，可以回顾下[矢量和矩阵](/3-vector-matrix.md)章节。

:::

```js
zAxis = normalize(cameraPosition - targetPosition)
```

我们需要一个 `up` 矢量来求出剩下两个轴，一般这个矢量是 `[0, 1, 0]` 也就是全局坐标系的 Y 轴。我们可以用它来叉成相机 Z 轴求出 X 轴。

```js
xAxis = cross(up, zAxis)
```

知道了 X 和 Z 轴，那么 Y 轴就可以直接用 Z 轴叉乘 X 轴来求得。

```js
yAxis = cross(zAxis, xAxis)
```

![image](https://user-images.githubusercontent.com/25923128/122206321-d14f7980-ced3-11eb-96da-fec42df5015e.png)
