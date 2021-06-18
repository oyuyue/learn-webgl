# 投影矩阵

不知道大家有没有觉得[盒子](/7-box.md)章节中渲染的立方体看起来有点奇怪。我们在现实世界中看到的物体都是近大远小，但是我们没有做透视处理立方体远近都一样大导致看起来有点奇怪。我们这篇文章来学习两种投影方法，分别是正交投影和透视投影。其中透视投影就可以让立方体有近大远小的透视效果。

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

## 透视投影

透视投影用来模拟我们的眼睛，如下图所示。

![image](https://user-images.githubusercontent.com/25923128/122518968-7d17d700-d044-11eb-93fd-0df59dab10c6.png)

光线经过晶状体打到视网膜上，视网膜细胞将它们感受到的光转化为神经信号，最终我们就可以看见前方的物体。不过我们并不会完全按照眼睛工作方式来，我们只需要近大远小的透视效果，所以我们把视网膜往前移动，并且不让物体翻转，这样我们就得到了蓝色梯形，我们可以想象它在三维中是一个平截头体形状。

![image](https://user-images.githubusercontent.com/25923128/122520245-f3690900-d045-11eb-98fd-a1788757f6a8.png)

我们要将这个平截头体投影到我们的屏幕上，也就是投影到平截头体的近平面上。

![image](https://user-images.githubusercontent.com/25923128/122523143-4b553f00-d049-11eb-8829-91d538e68b2a.png)

我们可以将平截头体的远平面的宽高往下压，把平截头体压成和正交投影中的盒子形状，然后再做一次正交投影，这样就可以将平截头体变到 NDC 了。

