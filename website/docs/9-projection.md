# 投影矩阵

不知道大家有没有觉得[盒子](/7-box.md)章节中渲染的立方体看起来有点奇怪。我们在现实世界中看到的物体都是近大远小，但是我们没有做透视处理立方体远近都一样大导致看起来有点奇怪。我们这篇文章来学习两种投影方法，分别是正交投影和透视投影。其中透视投影就可以让立方体有近大远小的透视效果。下图是分别使用透视投影和正交投影对同一场景的渲染结果。

![image](https://user-images.githubusercontent.com/25923128/122630761-caee1700-d0f8-11eb-8e56-d4fd5f2a3272.png)

## 正交投影

我们先从比较简单的正交投影开始。投影是降维操作，我们要将三维物体投影到一个平面上（也就是我们的显示器）。最简单的方法就是丢弃 Z 轴，例如我们有个三维点 `[1, 1, 1]` 我们直接丢弃它的 Z 值变成 `[1, 1]`。

我们之前好像也是这样做的 Z 值只是用在深度测试，用来判断哪个点在前哪个点在后，物体的 X 和 Y 不变直接投影到屏幕上，无论距离有多远，物体在屏幕上看起来都是相同的大小。

<img src="https://user-images.githubusercontent.com/25923128/122424343-38972780-cfc1-11eb-8c27-84e6a45c5afb.png" width="400"></img>

正交投影也叫平行投影，它的特点是远近一样大，平行线可以保持平行。这也是三维图形投影到二维平面的最简单的方法，我们也可以非常轻松的写出正交投影矩阵。

```js
[
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 0, 0,
  0, 0, 0, 1
]
```

上方矩阵可以将物体投影到 XY 平面上，它会保持物体的 X、Y 坐标不变将 Z 变成 0。

当然真正的投影矩阵不会这么简单，[上篇文章](/8-camera.md)提到要是能自定义裁剪空间就好了，默认情况下 OpenGL 会将 X、Y 和 Z 轴 `-1` 到 `1` 之外物体全部裁剪丢弃。我们能不能自定义裁剪空间的大小呢？这需要实现一个矩阵将一个自定义空间变到[标准化设备坐标](/2-coordinate.md)，这个就是我们要实现的正交矩阵。

假设在空间中有个盒子，我们可以通过 `left, right, bottom, top, near, far` 指定它的左右下上近远平面，我们要把这个盒子进行缩放，将它的 X、Y 和 Z 缩放到 `-1` 到 `1`，再将它移动到坐标原点，这样我们就可以将这个盒子里面所有物体就变换到了[标准化设备坐标](/2-coordinate.md)。

![image](https://user-images.githubusercontent.com/25923128/122438742-9cbfe880-cfcd-11eb-9029-8498756acd92.png)

我们首先来缩放和移动 X 轴。

X 轴通过 `left` 和 `right` 控制。我们可以通过 `right - left` 获得盒子的宽度，我们要将这个宽度缩放到 `1 - (-1)`，然后再将它移动到原点，也就是将 `left` 和 `right` 移动到了 `-1` 到 `1`。我们可以写一个公式来描述这个过程。

```js
Xn = s * Xe + d
```

其中是 `Xn` 是标准化设备坐标（NDC），`Xe` 是我们盒子所在坐标，`s` 是缩放的值，`d` 是平移的值。我们要将 `right - left` 缩放到 `1 - (-1)`，那么 `s` 就是 `2 / (right - left)`。

```js
Xn = 2 / (right - left) * Xe + d
```

我们再让 `Xn` 等于 `1`，那么 `Xe` 就等于 `right`，因为最终我们就是让 `right` 等于 `1`，`left` 等于 `-1`。

```js
1 = 2 / (right - left) * right + d
```

那么 `d` 就等于。

```js
d = -( (right + left) / (right - left) )
```

所以我们需要先将 X 轴缩放 `2 / (right - left)`，再平移 `-( (right + left) / (right - left) )`。

同样的方法我们可以求出 Y 轴。

```js
Yn = 2 / (top - bottom) * Ye + -( (top + bottom) / (top - bottom) )
```

其中 Z 轴需要特别注意下，它的 `s` 是 `-2 / (far - near)`。我们将 `s` 乘了 `-1`，这相当于翻转了一下 Z 轴，这是因为我们在其他坐标系一直使用的是右手坐标系，但是 NDC 是左手坐标系，这就让我们遇到了[盒子](/7-box.md)章节中面的颜色不一致的问题，所以我们这里翻转一下 Z 轴，也相当于把 NDC 变成右手坐标系，后面我们就可以一直默认使用右手坐标系，不用再关心 NDC 是左手坐标系的问题了。

```js
Zn = -2 / (far - near) * Ze + -( (far + near) / (far - near) )
```

现在我们就可以来构建正交矩阵了。

```js
[
  2 / (r - l), 0,           0,            -(r + l) / (r - l),
  0,           2 / (t - b), 0,            -(t + b) / (t - b),
  0,           0,           -2 / (f - n), -(f + n) / (f - n),
  0,           0,           0,            1,
]
```

我们将它加到我们的工具库里面。

```js
class Mat4 {
  static ortho(left, right, bottom, top, near, far, out = []) {
    const lr = 1 / (left - right);
    const bt = 1 / (bottom - top);
    const nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
  }
}
```

现在将这个矩阵用在上篇文章中的例子里吧。

```js {33-36} run
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
gl.uniformMatrix4fv(matLoc, false, Mat4.multiply(
  Mat4.ortho(-2, 2, -2, 2, -2, 2),
  camera.viewMatrix
))

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

可以看到立方体的角没被裁切了，它颜色翻转了是因为我们翻转了 Z 轴。

## 齐次除法

在介绍透视投影之前，我们再来介绍齐次坐标的另一种用法，就是齐次除法。我们知道在齐次坐标中一个点被表示为 `[x, y, z, w]` 也就是 `[x, y, z, 1]`，OpenGL 会在内部顶点着色器运行完毕之后自动执行齐次除法，它会将 X、Y 和 Z 除去 W，实际上 `[x, y, z, w]` 是表示 `[x / w, y / w, z / w, w / w]` 中的一个点。如果我们对这个点的每一项乘上一个数 A， `[x * A, y * A, z * A, w * A]`，实际上还是表示同一个点 `[x, y, z, w]`。

## 透视投影

透视投影是用的最广泛的投影，它会让平行线不再平行。透视投影是模拟我们的眼睛，将物体渲染成我们平时看到的那样。

![image](https://user-images.githubusercontent.com/25923128/122518968-7d17d700-d044-11eb-93fd-0df59dab10c6.png)

上图中，光线经过晶状体打到视网膜上，视网膜细胞将它们感受到的光转化为神经信号，最终我们就可以看见前方的物体。不过我们并不会完全按照眼睛工作方式来，我们只需要近大远小的透视效果，所以我们把视网膜往前移动，并且不让物体翻转，这样我们就得到了蓝色梯形，我们可以想象它在三维中是一个平截头体形状。

![image](https://user-images.githubusercontent.com/25923128/122520245-f3690900-d045-11eb-98fd-a1788757f6a8.png)

我们要将这个平截头体投影到我们的屏幕上，也就是投影到平截头体的近平面上。

![image](https://user-images.githubusercontent.com/25923128/122523143-4b553f00-d049-11eb-8829-91d538e68b2a.png)

我们可以将平截头体的远平面的宽高往下压，把平截头体压成和正交投影中的盒子形状，然后再做一次正交投影，这样就可以将平截头体变到 NDC 了。

假设在平截头体中有一个点 `[Xe, Ye, Ze]`，我们要将 `Xe` 压缩成 `Xp`，`Ye` 压缩成 `Yp`。

<img src="https://user-images.githubusercontent.com/25923128/122530059-adfe0900-d050-11eb-8f3a-184f4644e37a.png" width="500"></img>

我们首先来压缩 X 轴，如上图，我们首先将它投影到近平面上，我们可以发现与原点的连线形成两个相似三角形，那么 `Xp` 就等于 `-n / Ze * Xe`。

<img src="https://user-images.githubusercontent.com/25923128/122545855-e86fa200-d060-11eb-87bb-eff1ca78038e.png" width="500"></img>

同样的 `Yp` 等于 `-n / Ze * Ye`。

根据齐次除法，我们可以把一个点表示为 `[nx, ny, ?, -z]`，这样实际表示的就是 `[n / -z * x, n / -z * y, ? / -z]` 和上面推导的一样。那么我们可以构建如下矩阵。

```js
[
  n, 0, 0,  0,
  0, n, 0,  0,
  ?, ?, ?,  ?,
  0, 0, -1, 0
]
```

通过上面信息，我们知道了这个矩阵中的 3 行，还有 Z 轴目前还不知道。

如果一个点在近平面上，那么它的 Z 值是不变的。假设近平面一个点 `[x, y, -n, 1]` 将上面矩阵作用到这个点可以得到 `[n * x, n * y, ? , n]`，因为这个点变换后不变，所以 `?` 等于 `-n ^ 2`。

```js
[
  n, 0, 0,  0,
  0, n, 0,  0,
  0, 0, A,  B,
  0, 0, -1, 0
]
```

通过上面信息我们知道 Z 的值和 X 和 Y 是不相关的，我们可以给第三行前两个设置为 0，后两项未知我们设为 A 和 B。用第三行点乘这个点 `[x, y, -n, 1]`

```js
[0, 0, A, B] · [x, y, -n, 1] = -n ** 2

A * -n + B = -n ** 2
```

同样如果一个点在远平面上，那么变换后它的 Z 值是不变的，我们取远平面上一个特殊的点 `[0, 0, -f, 1]` 它变换后不变。我们可以得到另一个式子。

```js
[0, 0, A, B] · [0, 0, -f, 1] = -f ** 2

A * -f + B = -f ** 2
```

解上方两个式子，我们可以求出 A 和 B 的值。

```js
A = n + f

B = n * f
```

那么最终我们就得到了透视到正交的矩阵。

```js
[
  n, 0, 0,     0,
  0, n, 0,     0,
  0, 0, n + f, n * f,
  0, 0, -1,    0
]
```

把平截头体变成盒子后，我们再来做一次正交投影，那么我们就可以得到透视投影矩阵。

```js
Mp = Mo * (Mp -> o)
   = [
      2 / (r - l), 0,           0,            -(r + l) / (r - l),
      0,           2 / (t - b), 0,            -(t + b) / (t - b),
      0,           0,           -2 / (f - n), -(f + n) / (f - n),
      0,           0,           0,            1,
    ] * [
      n, 0, 0,     0,
      0, n, 0,     0,
      0, 0, n + f, n * f,
      0, 0, -1,    0
    ]
    = [
      2 * n / (r - l), 0,               (r + l) / (r - l),  0,
      0,               2 * n / (t - b), (t + b) / (t - b),  0,
      0,               0,               -(f + n) / (f - n), -2 * n * f / (f - n),
      0,               0,               -1,                 0
    ]
```

透视矩阵还有个特点，是我们将平截头体的远平面向下压时，平截头体内点的 Z 会发生变化，变换前点的 Z 值和变换后的 Z 值并不是线性关系，下图中 `Ze` 是变换前的点，`Zn` 是变换后的点。

![image](https://user-images.githubusercontent.com/25923128/122639244-6bf5c580-d12b-11eb-8076-b22fa49e8d7b.png)

我们可以看到在近平面 Z 的精度很高而远平面 Z 的精度很低，Z 值会影响物体的先后顺序，在精度低的地方可能就会照成物体的前后顺序和实际顺序不一致。不过我们一般比较关心近平面的精度，而不关心比较远的地方，所以这种精度分布是比线性精度更好。

### 视野和宽高比

上面我们求出了投影矩阵，不过我们一般不会使用 `left, right, bottom, top, near, far` 来配置投影矩阵，而是使用更自然的 `fovy, aspect, near, far` 来配置。

![image](https://user-images.githubusercontent.com/25923128/122640254-25a36500-d131-11eb-9ecb-df107f81c094.png)

- `fovy` 是 Y 轴的 `field of view` 表示平截头体顶部和底部的角度，这个角度越大看到的范围越大，物体也会越小。
- `aspect` 是 `aspect ratio` 表示视口的宽高比，也就是上方近裁切面的宽高比。
- `near` 是近平面
- `far` 是远平面

另外平截头体会放在 X 和 Y 轴的中间，也就意味着 `right` 等于 `-left`，`top` 等于 `-bottom`。

```js
r + l = 0
r - l = 2 * r

t + b = 0
t - b = 2 * t
```

我们将上面信息带入投影矩阵中。

```js
[
  n / r, 0,     0,                  0,
  0,     n / t, 0,                  0,
  0,     0,     -(f + n) / (f - n), -2 * n * f / (f - n),
  0,     0,     -1,                 0
]
```

我们先来看 ZY 平面，其中 θ 是 fovy 的角度值，我们还知道 `aspect` 是宽高比，也就是 `2r / 2t`。

![image](https://user-images.githubusercontent.com/25923128/122642463-16c2af80-d13d-11eb-8861-aa8b508b88af.png)

我们可以将 fovy 和 aspect 和投影矩阵关联起来。

```js
tan(θ / 2) = t / n

aspect = 2r / 2t = r / t

n / t = 1 / tan(θ / 2)

n / r = 1 / (r / t * t / n) = 1 / (aspect * tan(θ / 2))
```

这样我们就得到了最终的透视投影矩阵。

```js
[
  1 / (aspect * tan(fovy / 2)), 0, 0, 0,
  0, 1 / tan(fovy / 2), 0, 0,
  0, 0, -(f + n) / (f - n), -2 * n * f / (f - n),
  0, 0, -1, 0
]
```

现在我们就可以将这个透视投影矩阵加入到我们的工具库中。一般 `far` 大于 `near` 大于 `0`。

```js
class Mat4 {
  static perspective(fovy, aspect, near, far, out = []) {
    const f = 1 / Math.tan(fovy / 2);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;
    if (far != null && far !== Infinity) {
      const nf = 1 / (near - far);
      out[10] = (far + near) * nf;
      out[14] = 2 * far * near * nf;
    } else {
      out[10] = -1;
      out[14] = -2 * near;
    }
    return out;
  }
}
```

当没有传 `far` 或者 `far` 为 `Infinity` 时，我们生成无限投影矩阵，因为当 `far` 等于无限时 `f + n` 和 `f - n` 也等于无限。

### 渲染立方体

我们现在试试用这个投影矩阵渲染上篇文章中的立方体吧。

```js {30,33-36} run
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
camera.position.x = camera.position.y = camera.position.z = 2
camera.lookAt([0, 0, 0])
const matLoc = gl.getUniformLocation(program, 'uMat')
gl.uniformMatrix4fv(matLoc, false, Mat4.multiply(
  Mat4.perspective(45 * Math.PI / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 1, 100),
  camera.viewMatrix
))

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

可以看到渲染的立方图有了透视效果。
