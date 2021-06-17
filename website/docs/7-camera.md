# 摄像机

想象一个场景，场景中有很多的物体排列在不同的位置。我们拿个摄像机从不同角度拍摄这个场景，摄像机拍到的就是最终渲染在屏幕上的内容。OpenGL 中并没有相机的概念，需要我们自己完成。摄像机也被称为眼，从哪个角度去拍或从哪个角度去看。

在深入之前，我们先来看下是怎么在代码中使用的。

```js
const camera = new Camera()

camera.position.x = 0.5
camera.position.y = 0.5
camera.position.z = 0.5
// 设置相机的位置

camera.lookAt([0, 0, 0])
// 设置相机看向原点

const matLoc = gl.getUniformLocation(program, 'uMat')
gl.uniformMatrix4fv(matLoc, false, camera.viewMatrix)
// 获取和设置 uniform

gl_Position = uMat * aPos;
// 在顶点着色器中将顶点乘上这个矩阵
```

要用相机去拍摄一个场景，我们需要知道相机的位置和相机拍摄的目标。上面代码中首先创建了一个相机实例，然后设置相机的位置，并让相机看向原点。`camera.viewMatrix` 就是根据相机的位置和看向方向生成的矩阵，我们只需要将这个矩阵应用在物体上，最终渲染出来的画面就是相机拍下来的画面。

如果场景中的物体和相机一起移动，例如向前移动 10 米，那么相机拍摄出来的画面和移动前还是一样的。在 OpenGL 中有个惯例，就是将相机位置固定在原点，并且朝着 -Z 方向看。为了将相机移动到惯例位置，我们需要两个步骤。

1. 将相机移动到原点
2. 旋转相机，让它看向 -Z 位置。

![image](https://user-images.githubusercontent.com/25923128/122237222-be4ba200-cef1-11eb-90ea-f8afb4c4ea4b.png)

## 视图矩阵

上方的 `camera.viewMatrix` 矩阵一般称为视图矩阵，它可以让场景中的物体对相机做逆变换，向相机相反的位置移动和旋转。上面有提到场景中的物体和相机一起移动和旋转，那么相机拍摄的画面和移动前拍摄的画面是一样的。相机向前移动，那么场景中的物体就要向后移动，物体要和相机的变换相反。

第一步将相机移动到原点很简单，[变换](/6-transform.md)中有讲过，矩阵最右边那一列，就是平移的量。我们这里设置负的相机位置，这样就可以将相机移动到原点了。

```js
[
  1, 0, 0, -Px,
  0, 1, 0, -Py,
  0, 0, 1, -Pz,
  0, 0, 0, 1
]
```

第二步旋转相机，让它看向 -Z 位置，也就是要将相机的坐标轴和全局的坐标轴对齐。我们需要先求出相机它自己的坐标轴，如下图所示。

![image](https://user-images.githubusercontent.com/25923128/122186917-19b16c00-cec1-11eb-8e56-0656ac73309e.png)

相机的坐标系还是[右手坐标系](/2-coordinate.md)，看向 -Z 方向。

我们可以通过相机的位置减去目标的位置并归一化得到相机坐标轴中的 Z 轴，我们不需要坐标轴的长度只要它的方向，所以将它归一化为单位矢量。

:::info

这里会用到矢量的各种计算，如果对矢量不太了解，可以回顾下[矢量和矩阵](/3-vector-matrix.md)章节。

:::

```js
Z = normalize(cameraPosition - targetPosition)
```

我们需要一个 `up` 矢量来求出剩下两个轴，一般这个矢量是 `[0, 1, 0]` 也就是全局坐标系的 Y 轴。我们可以用它来叉成相机 Z 轴求出 X 轴。

```js
X = normalize(cross(up, Z))
```

知道了 X 和 Z 轴，那么 Y 轴就可以直接用 Z 轴叉乘 X 轴来求得。

```js
Y = cross(Z, X)
```

![image](https://user-images.githubusercontent.com/25923128/122206321-d14f7980-ced3-11eb-96da-fec42df5015e.png)

那么旋转矩阵如下所示。

```js
rotation = [
  Xx, Yx, Zx, 0,
  Xy, Yy, Zy, 0,
  Xz, Yz, Zz, 0,
  0,  0,  0,  1
]
```

我们可以用上面矩阵分别乘上全局坐标的 X、Y 和 Z 轴。

```js
rotation * [1, 0, 0, 0] = X

rotation * [0, 1, 0, 0] = Y

rotation * [0, 0, 1, 0] = Z
```

我们可以发现上面矩阵将全局坐标轴变成了相机的坐标轴。可是我们需要将相机的坐标轴变成全局的坐标轴，需要它的逆矩阵。[变换](/6-transform.md)中我们提到过旋转矩阵是正交矩阵，它的逆矩阵就是它的转置矩阵，所以我们只需要将上面矩阵转置一下，就可以获得最终的旋转矩阵。

```js
[
  Xx, Xy, Xz, 0,
  Yx, Yy, Yz, 0,
  Zx, Zy, Zz, 0,
  0,  0,  0,  1
]
```

现在我们已经求出了平移和旋转矩阵，是先平移后旋转，所以我们将旋转矩阵乘上平移矩阵就是最终的视图矩阵（`viewMatrix`）了。

```js
viewMatrix = R * T
           = [
              Xx, Xy, Xz, 0,
              Yx, Yy, Yz, 0,
              Zx, Zy, Zz, 0,
              0,  0,  0,  1
            ] * [
              1, 0, 0, -Px,
              0, 1, 0, -Py,
              0, 0, 1, -Pz,
              0, 0, 0, 1
            ]

           = [
             Xx, Xy, Xz, X · -P
             Yx, Yy, Yz, Y · -P
             Zx, Zy, Zz, Z · -P
             0,  0,  0, 1
           ]
```

我们可以将这个矩阵封装到我们的工具库中，后面就可以直接使用了。

```js
class Mat4 {
  static identity(out = []) {
    return Object.assign(out, [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ])
  }

  static lookAt(eye, target, up, out = []) {
      const eyeX = eye[0], eyeY = eye[1], eyeZ = eye[2];
      const upX = up[0], upY = up[1], upZ = up[2];
      const targetX = target[0], targetY = target[1], targetZ = target[2];
      let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;

      // 相机 Z 轴
      z0 = eyeX - targetX;
      z1 = eyeY - targetY;
      z2 = eyeZ - targetZ;
      // 归一化 Z 轴
      len = z0 * z0 + z1 * z1 + z2 * z2
      if (len > 0) {
        len = 1 / Math.sqrt(len)
        z0 *= len;
        z1 *= len;
        z2 *= len;
      } else {
        // 相机和目标在同一位置
        return Mat4.identity(out)
      }

      // 叉积 up 和 Z 轴，求出 X 轴
      x0 = upY * z2 - upZ * z1;
      x1 = upZ * z0 - upX * z2;
      x2 = upX * z1 - upY * z0;
      // 归一化 X 轴
      len = x0 * x0 + x1 * x1 + x2 * x2;
      if (len > 0) {
        len = 1 / Math.sqrt(len);
        x0 *= len;
        x1 *= len;
        x2 *= len;
      } else {
        // up 与 Z 平行
        return Mat4.identity(out)
      }

      // Z 叉乘 X，求出 Y 轴
      y0 = z1 * x2 - z2 * x1;
      y1 = z2 * x0 - z0 * x2;
      y2 = z0 * x1 - z1 * x0;

      // OpenGL 中矩阵是列主序
      out[0] = x0;
      out[1] = y0;
      out[2] = z0;
      out[3] = 0;
      out[4] = x1;
      out[5] = y1;
      out[6] = z1;
      out[7] = 0;
      out[8] = x2;
      out[9] = y2;
      out[10] = z2;
      out[11] = 0;
      out[12] = -(x0 * eyeX + x1 * eyeY + x2 * eyeZ);
      out[13] = -(y0 * eyeY + y1 * eyeY + y2 * eyeZ);
      out[14] = -(z0 * eyeZ + z1 * eyeY + z2 * eyeZ);
      out[15] = 1;

      return out;
  }
}
```

一般将这个方法称为 `lookAt`，它接收相机位置（也称为眼）、看向的目标位置和一个上矢量，返回一个视图矩阵，可以将相机移动到原点并看向 -Z 方向。

有了 `lookAt` 工具方法，我们可以来完成一开始写的 `Camera` 类了。

```js
class Vec3 extends Array {
  constructor(x = 0, y = x, z = x) {
    super(x, y, z)
  }

  get x() { return this[0] }
  get y() { return this[1] }
  get z() { return this[2] }

  set x(v) { this[0] = v }
  set y(v) { this[1] = v }
  set z(v) { this[2] = v }
}

class Camera {
  constructor() {
    this.position = new Vec3()
    this.up = new Vec3(0, 1, 0)
    this.viewMatrix = Mat4.identity()
  }

  lookAt(target) {
    Mat4.lookAt(this.position, target, this.up, this.viewMatrix)
  }
}
```

## 渲染立方体

现在就用上面刚完成的 `Camera`，来渲染上篇文章中的立方体吧。我们将相机放在 `[0.5, 0.5, 0.5]` 的位置，让它看向 `[0, 0, 0]` 原点位置。上篇文章中我们封装了 `createBox` 工具方法，现在就可以直接用了，它默认会返回 `[-0.5, -0.5, -0.5]` 到 `[0.5, 0.5, 0.5]` 中心在坐标原点，长宽高都是 1 的立方体。

```js {29-33} run
const gl = createGl()

const program = createProgramFromSource(gl, `
attribute vec4 aPos;
uniform mat4 uMat;

void main() {
  gl_Position = uMat * aPos;
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

const [posLoc] = createAttrBuffer(gl, program, 'aPos', box.position.value)
gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(posLoc)

const camera = new Camera()
camera.position.x = camera.position.y = camera.position.z = 0.5
camera.lookAt([0, 0, 0])
const matLoc = gl.getUniformLocation(program, 'uMat')
gl.uniformMatrix4fv(matLoc, false, camera.viewMatrix)

gl.enable(gl.DEPTH_TEST)
gl.enable(gl.CULL_FACE)
gl.clearColor(0, 0, 0, 0)
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
gl.drawElements(gl.TRIANGLES, box.index.value.length, gl.UNSIGNED_SHORT, 0)

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

:::info

片段着色器中的 `gl_FragCoord` 后面再详细讲解，这里用到的 `z` 值是当前片段的深度，在之前[坐标系](/2-coordinate.md)深度缓存映射中有提到，它的值的范围是 0 到 1。

:::

我们可以看到立方体的几个角消失了，这是因为我们将相机位置设置到 `[0.5, 0.5, 0.5]`，那么立方体就要向反方向移动 `0.5`，我们在[坐标系](/2-coordinate.md)中有提到，OpenGL 的 X、Y 和 Z 轴范围是 `-1` 到 `1`，任何超出这个范围的部分就会被裁剪丢弃，我们让立方体反方向移动 `0.5` 刚好让立方体移动到坐标系的边缘，然后对立方体进行旋转，刚好就立方体的一部分超出了这个范围，导致这一部分被裁剪丢弃。

如何解决这个问题呢？能不能扩展坐标系范围，让物体坐标可以超过 `-1` 和 `1`？这正是下篇文章要讲的内容！
