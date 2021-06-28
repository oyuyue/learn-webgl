# 欧拉角 / 万向节死锁

前面我们使用矩阵来表示旋转，在[变换](/6-transform.md)章节中我们还推算出来绕任意轴旋转的矩阵。

矩阵形式的优点是它是图形 API 使用的形式，我们无论用什么形式表示旋转，但是最终都需要转换成矩阵形式。我们还可以对矩阵求逆，求出反向旋转的矩阵，而且旋转矩阵是正交矩阵，求它的逆矩阵只需要转置一下就行了。但是矩阵形式也有很多缺点，比如矩阵使用 9 个数字表示旋转，占用较多内存。而且矩阵形式难以阅读，我们很难看出来一个矩阵到底是表示什么样的旋转。

## 欧拉角

我们还可以用欧拉角（Euler angles）表示旋转，称作欧拉角是因为欧拉证明，任何一个 3D 空间的旋转，都可以拆分为沿着自身三个坐标轴的旋转。我们一般称为这三个旋转为**偏航-俯仰-翻滚**（Yaw-Pitch-Roll 或 Heading-Pitch-Bank），我们可以理解为左右摇头-上下点头-左右歪头。也就是分别绕 Y 轴、X 轴和 Z 轴旋转。当然旋转的顺序也不一定非要是 YXZ，也可以 XYZ 等其他旋转顺序，比如 ThreeJS 的默认顺序就是 [XYZ](https://github.com/mrdoob/three.js/blob/dev/src/math/Euler.js#L319)。

![](https://user-images.githubusercontent.com/25923128/123463150-c2786d80-d61d-11eb-97a3-c692be22b365.png)

我们使用的是右手坐标系和旋转正方向和[坐标系](/2-coordinate.md)章节中一样，从轴的正值看向负值，逆时针旋转是旋转正方向。

欧拉角的三次旋转是沿着体轴旋转，而不是固定轴旋转。我们可以先左右摇头 0 度，然后向下低头 90 度看向地面，最后按照 Z 轴旋转 90 度，此时我们还是面向地面，但是如果我们是按照固定轴旋转则此时是耳朵朝向地面。一个比较有意思点是，只要按照相反顺序旋转，固定轴旋转和体轴旋转一样的，比如体轴按照 YXZ 旋转，那么固定轴按照 ZXY 旋转相同角度，旋转结果是相同的。

```js {50-51,57-58} run
const renderer = new Renderer()
const geometry = new BoxGeometry()

let colors = [], size = geometry.attributes.position.value.length / 6 / 3;
[[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 1, 0], [0, 1, 1], [1, 0, 1]].forEach(([r, g, b]) => {
  for (let i = 0; i < size; i++) colors.push(r, g, b)
})
geometry.setAttribute('color', { value: new Float32Array(colors) })

const program = new Program(renderer, {
  vs: `
    attribute vec4 position;
    attribute vec3 color;
    uniform mat4 world;
    uniform mat4 PV;
    varying vec3 vColor;

    void main() {
      vColor = color;
      gl_Position = PV * world * position;
    }
  `,
  fs: `
    precision highp float;
    varying vec3 vColor;

    void main() {
      gl_FragColor = vec4(vColor, 1);
    }
  `
})

const mesh = new Mesh(geometry, program)
const scene = new Scene()
scene.add(mesh)
program.uniforms.PV = Mat4.multiply(Mat4.ortho(-2, 2, -2, 2, -2, 2), Mat4.lookAt([0, 0, 1], [0, 0, 0], [0, 1, 0]))

let x = 0, y = 0, z = 0
const rad = r => r * Math.PI / 180
function draw() {
  if (x >= 45) {
    x = y = z = 0
  } else if (y >= 90) {
    x += 0.5
  } else {
    y += 0.5
  }

  program.uniforms.world = Mat4.multiply(
    Mat4.fromYRotation(rad(y)),
    Mat4.multiply(Mat4.fromXRotation(rad(x)), Mat4.fromZRotation(rad(z)))
  )
  program.uniforms.world[12] = -1
  renderer.render(scene)

  program.uniforms.world = Mat4.multiply(
    Mat4.fromZRotation(rad(z)),
    Mat4.multiply(Mat4.fromXRotation(rad(x)), Mat4.fromYRotation(rad(y)))
  )
  program.uniforms.world[12] = 1
  renderer.render(scene, { clear: false })

  requestAnimationFrame(draw)
}

draw()
```

上面动画中，左边立方体是按照体轴旋转，右边立方体是安装固定轴旋转。

欧拉角的优点很明显，易于人类使用，我们可以轻松理解，而且欧拉角使用 3 个数字的存储定向可以节省内存。

### 规范欧拉角

欧拉角的一个缺点是，定向不是唯一的，比如旋转 10 度和旋转 360 + 10 度是相同的。要解决这个问题，我们需要使用规范欧拉角，它将偏航和翻滚角限制在 $(-180°, 180°]$，俯仰角限制在 $[-90°, 90°]$ ，现在任何定向规范欧拉角都只有一个欧拉角三元组表示。但是会有一个奇点，我们还需要规定如果俯仰角为正负 90 度时，翻滚角为 0，这在万向节死锁小节中解释。所以规范欧拉角需要满足如下规定。

```js
-180 < Yaw <= 180
-90 <= Pitch <= 90
-180 < Roll <= 180

if (Pitch == -90 || Pitch == 90) Roll = 0
```

### 插值

欧拉角的另一个缺点是插值问题。在两个定向之间插值，给定参数 `t` 它的大小是 0 到 1。如果它为 0.5 我们就可以获得两个定向中间的一个定向。但是欧拉角有两个方向可以插值。 

![](https://user-images.githubusercontent.com/25923128/123501374-fd5abf80-d676-11eb-859c-0be5ed05494c.png)

如上图所示，这两个定向之间相差 20 度，如果我们插值简单的线性插值，那么会绕一大圈旋转 340 度，而不是 20 度。要解决这个问题，我们需要将插值角度限制在 $(-180°, 180°]$ 之间。

```js
function wrapPi(rad) {
  if (Math.abs(rad) <= Math.PI) {
    const PI2 = Math.PI * 2
    rad -= (Math.floor((rad + Math.PI) / PI2) * PI2)
  }
  return rad
}

function lerp(rad1, rad2, t) {
  return rad1 + t * wrapPi(rad2 - rad1)
}
```

有了上面工具，我们可以找到两个角度之间插值的最短弧。但是这并不能完全解决问题，它还会收到万向节死锁影响。

## 万向节死锁

万向节死锁（Gimbal lock）是欧拉角根本性的问题，我们并不能通过一些方法来解决这个问题。无论用什么顺序（XYZ，YZX 等）去旋转，只要第二个轴旋转角度是正负 90 度就会发生万向节死锁问题。当第二轴旋转正负 90 度时，第一个轴和第三个轴将会重叠在一起，也就是说这时候丢失了一个自由度，只有两个旋转自由度。我们很难自己去想象这种情形，建议查看这个[演示动画](https://www.bilibili.com/video/av756302699/)。

现在有 ZYX 顺序的旋转，其中 Y 轴旋转为 90 度。我们可以看到下图中 X 轴的旋转和 Z 轴的旋转对相同轴的旋转。 

![](https://user-images.githubusercontent.com/25923128/123503022-dd30fd80-d682-11eb-8cc9-aa5a6d801154.png)

因为欧拉角是按照体轴旋转，旋转顺序是父子关系，父轴旋转会带动子轴旋转，上图中 Y 轴旋转 90 度，带动它的子轴 X 轴旋转 90 度，使 X 轴与 Z 轴重合。

我们也可以从公式来验证这一点。

$$
\begin{aligned}
  E&=R_z(b) * R_y(\frac{\pi}{2}) *R_x(a) \\
  &=\begin{bmatrix}
   0 & cos(b)sin(a)-cos(a)sin(b) & sin(a)sin(b)+cos(a)cos(b) \\
   0 & sin(a)sin(b)+cos(a)cos(b) & cos(a)sin(b)-cos(b)sin(a) \\
   -1 & 0 & 0
  \end{bmatrix} \\
  &=\begin{bmatrix}
   0 & sin(a-b) & cos(a-b) \\
   0 & cos(a-b) & -sin(a-b) \\
   -1 & 0 & 0
  \end{bmatrix} \\
  &=R_y(\frac{\pi}{2}) * R_x(a-b)
\end{aligned}
$$

通过上面公式我们可以发现，绕三个轴旋转，其实最终是绕两个轴旋转，我们丢失了一个轴自由度。

需要注意的是万向节死锁问题，并不是说有欧拉角无法描述的定向。而是两个定向之间的插值问题，如果看了上方视频，可以发现当第二个轴旋转 90 度时，让它再旋转到另一个定向，会发生不自然的旋转，这可能就会照成物体突然晃动等问题。如下图所示，我们期望的是第二个旋转，而不是第一个不自然的旋转。

![](https://user-images.githubusercontent.com/25923128/123503690-14a1a900-d687-11eb-8a48-5761e06e8e5f.png)

要避免万向节死锁问题，我们可以用四元数来描述定向，这将在下一篇文章介绍。

## 欧拉角转矩阵

## 矩阵转欧拉角
