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

第二步旋转相机，让它看向 -Z 位置，也就是将相机的坐标轴和全局的坐标轴对齐，就比较复杂，我们需要先求出相机它自己的坐标轴。如下图所示。

![image](https://user-images.githubusercontent.com/25923128/122186917-19b16c00-cec1-11eb-8e56-0656ac73309e.png)

相机的坐标系，还是[右手坐标系](/2-coordinate.md)，看向 -Z 方向。

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
Y = normalize(cross(Z, X))
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
      let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
      const eyeX = eye[0], eyeY = eye[1], eyeZ = eye[2];
      const upX = up[0], upY = up[1], upZ = up[2];
      const targetX = target[0], targetY = target[1], targetZ = target[2];

      // 相机位置和相机目标在同一位置，返回单位矩阵
      if (
        Math.abs(eyeX - targetX) < 1e-6 &&
        Math.abs(eyeY - targetY) < 1e-6 &&
        Math.abs(eyeZ - targetZ) < 1e-6
      ) {
        return Mat4.identity(out);
      }

      // 相机 Z 轴
      z0 = eyeX - targetX;
      z1 = eyeY - targetY;
      z2 = eyeZ - targetZ;

      // 归一化 Z 轴
      len = 1 / Math.hypot(z0, z1, z2);
      z0 *= len;
      z1 *= len;
      z2 *= len;

      // 叉积 up 和 Z 轴，求出 X 轴
      x0 = upY * z2 - upZ * z1;
      x1 = upZ * z0 - upX * z2;
      x2 = upX * z1 - upY * z0;

      len = Math.hypot(x0, x1, x2);
      if (!len) {
        // up 和 Z 轴平行
        x0 = 0;
        x1 = 0;
        x2 = 0;
      } else {
        // 归一化 X 轴
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
      }

      // Z 叉乘 X，求出 Y 轴
      y0 = z1 * x2 - z2 * x1;
      y1 = z2 * x0 - z0 * x2;
      y2 = z0 * x1 - z1 * x0;

      len = Math.hypot(y0, y1, y2);
      if (!len) {
        // Z 轴和 X 轴平行
        y0 = 0;
        y1 = 0;
        y2 = 0;
      } else {
        // 归一化 Y 轴
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
      }

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
class Camera {
  constructor() {
    this.position = [0, 0, 0]
    this.up = [0, 1, 0]
    this.viewMatrix = Mat4.identity()
  }

  lookAt(target) {
    Mat4.lookAt(this.position, target, this.up, this.viewMatrix)
  }
}
```
