# 欧拉角和万向节死锁

前面我们使用矩阵来表示旋转，在[变换](/6-transform.md)章节中我们还推算出来绕任意轴旋转的矩阵。

矩阵形式的优点是它是图形 API 使用的形式，我们无论用什么形式表示旋转，但是最终都需要转换成矩阵形式。我们还可以对矩阵求逆，求出反向旋转的矩阵，而且旋转矩阵是正交矩阵，求它的逆矩阵只需要转置一下就行了。但是矩阵形式也有很多缺点，比如矩阵使用 9 个数字表示旋转，占用较多内存。而且矩阵形式难以阅读，我们很难看出来一个矩阵到底是表示什么样的旋转。

## 欧拉角

我们还可以用欧拉角来表示旋转，称作欧拉角是因为欧拉证明，任何一个 3D 空间的旋转，都可以拆分为沿着自身三个坐标轴的旋转。我们一般称为这三个旋转为**偏航-俯仰-翻滚**（Yaw-Pitch-Roll 或 Heading-Pitch-Bank），我们可以理解为左右摇头-上下点头-左右歪头。也就是分别绕 Y 轴、X 轴和 Z 轴旋转。当然旋转的顺序也不一定非要是 YXZ，也可以 XYZ 等其他旋转顺序，比如 ThreeJS 的 Euler 默认顺序就是 [XYZ](https://github.com/mrdoob/three.js/blob/dev/src/math/Euler.js#L319)。

![image](https://user-images.githubusercontent.com/25923128/123463150-c2786d80-d61d-11eb-97a3-c692be22b365.png)

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
    Mat4.fromZRotation(rad(z)),
    Mat4.multiply(Mat4.fromXRotation(rad(x)), Mat4.fromYRotation(rad(y)))
  )
  program.uniforms.world[12] = 1
  renderer.render(scene)

  program.uniforms.world = Mat4.multiply(
    Mat4.fromYRotation(rad(y)),
    Mat4.multiply(Mat4.fromXRotation(rad(x)), Mat4.fromZRotation(rad(z)))
  )
  program.uniforms.world[12] = -1
  renderer.render(scene, { clear: false })

  requestAnimationFrame(draw)
}

draw()
```

上图中，左边立方体是按照体轴旋转，右边立方体是安装固定轴旋转。我们也可以发现他们的旋转顺序刚好相反。
