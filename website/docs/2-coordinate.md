# 坐标系

WebGL 的坐标系和 canvas 2d 的不太一样。因为 WebGL 是 OpenGL 子集，所以 WebGL 坐标系和 OpenGL 坐标系性值一样。

```js
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
```

![image](https://user-images.githubusercontent.com/25923128/120576159-e993b300-c454-11eb-881c-dd2b169a9f36.png)

canvas 2d 的坐标原点在左上角，X 轴和 Y 轴的正值分别向右和向下。

WebGL 的坐标系和 OpenGL 一样，它更符合我们的常识一点。

![image](https://user-images.githubusercontent.com/25923128/120579185-a982ff00-c459-11eb-9d8e-0fa6de2103d3.png)

原点在正中间，右边为 X 轴正方向，上面为 Y 轴正方向。

当然 WebGL 中还有一个 Z 轴，Z 轴有两种形式，一种是正值朝外，另一种是正值朝内。

当 Z 轴正值朝外，称为坐标系为右手坐标系，当 Z 轴正值朝内称为左手坐标系。可以伸出双手像下图一样比划下，就知道为什么称为左手坐标系和右手坐标系了。

![image](https://user-images.githubusercontent.com/25923128/120896520-85d7d880-c654-11eb-9876-62aae30a6a6d.png)

左手坐标系和右手坐标系还有一个区别，是它们的旋转正方向。当绕 Z 轴旋转 90° 时，是顺时针还是逆时针旋转呢？

还是伸出双手，握拳，大拇指伸出，大拇指指向旋转轴的正方向，其他手指的弯曲方向就是旋转正方向。

![image](https://user-images.githubusercontent.com/25923128/120897567-714a0f00-c659-11eb-939d-f1e539ff8f41.png)

## 标准化设备坐标

可以发现上图中 X，Y 轴的范围是 `-1` 到 `1`。OpenGL 中 X、Y、Z 轴的的范围是 `-1` 到 `1`，任何在范围外的坐标都会被丢弃/裁剪，不会显示在屏幕上。

我们称为**标准化设备坐标(Normalized Device Coordinates, NDC)**。你可以使用下方方法把范围外值转换为 `-1` 到 `1`。

```js
const canvasWidth = 500 // 画布宽度
const x = 100 // x 点的值

const two = x / canvasWidth * 2 // 变为 0 -> 2
const clipX = two - 1 // 0 -> 2 变为 -1 -> +1
```

## WebGL 的坐标系

那么 WebGL 是左手坐标系还是右手坐标系呢？答案为**都不是**。

```js
const point1  = [0.5, 0.5, 0.1] // 分别是 X，Y，Z 的值
const point2 = [0.5, 0.5, -0.2]
```

现在有上面两个点。它们 Z 轴先后顺序，取决于渲染的顺序，如果后渲染 point1 则 point1 覆盖 point2，如果后渲染 point2 则 point2 覆盖 point1。

## 深度缓存映射

上面这种情况是因为没有启用深度测试，可以像下面一样开启。

```js
const canvas = document.createElement('canvas')
const gl = canvas.getContext('webgl')
gl.enable(gl.DEPTH_TEST) // 开启深度测试
```

深度测试就是将图形的 Z 值**映射存储**到深度缓存区中，这样在我们在 OpenGL 中画各种图形时，我们就知道这个图形离我们近还是远，离我们越近的点会覆盖离我们远的点。

开启了深度测试，无论 point1 和 point2 渲染顺序如何，point2 始终会覆盖 point1。也就是 Z 值小的点会覆盖 Z 值大的点，也就是说 OpenGL 是**左手坐标系**。

## 改变坐标系

OpenGL 中还有个 `depthRange` 函数，它接收两个参数 `depthRange(zNear, zFar)` 两个参数都是数字，都必须是 `0` 到 `1` 之间的数字。默认情况下为 `depthRange(0, 1)`，这个函数用来设置深度缓存的范围。

```js
const canvas = document.createElement('canvas')
const gl = canvas.getContext('webgl')
gl.depthRange(1, 0) // 反转默认值
gl.enable(gl.DEPTH_TEST)
```

如果按照上方设置了深度缓存范围，再来渲染 point1 和 point2 我们就发现，无论顺序如何 point1 始终会覆盖 point2 了，OpenGL 变成了右手坐标系。

深度缓存的范围是 `0` 到 `1`，它会将 Z 值（`-1` 到 `1`）按照下方这个公式映射为 `0` 到 `1`。

```js
depth = n + (f - n) * (z + 1) / 2 
// n 和 f 是 depthRange 函数设置的。n 是 near，f 是 far。
```

但是如果真的在 WebGL 中设置 `depthRange(1, 0)` 你会发现**没有任何效果**。 这是 WebGL 和 OpenGL 的差异之处，根据 [WebGL 1.0 的规范](https://www.khronos.org/registry/webgl/specs/1.0/#VIEWPORT_DEPTH_RANGE)。

> **6.12 Viewport Depth Range**
>
> The WebGL API does not support depth ranges with where the near plane is mapped to a value greater than that of the far plane. A call to depthRange will generate an INVALID_OPERATION error if zNear is greater than zFar.

也就是在 WebGL 中 `depthRange` 的 `zNear` 不允许小于 `zFar`。

要把 WebGL 变成右手坐标系，可以用如下方法。

```js
gl.clearDepth(0) // 设置默认值
gl.depthFunc(gl.GREATER) // 设置比较函数
gl.clear(gl.DEPTH_BUFFER_BIT) // 使用默认值刷新深度缓冲区
```

将深度缓存设置成 `0`（默认值是 `1`）并用 clear 重置深度缓存。然后设置深度比较函数为大于（默认值是小于），这样就可以让 Z 值大的顶点覆盖小的顶点了。

## WebGL 常用坐标系

一般情况下我们也不会使用 `depthRange`，`clearDepth` 这些函数。也就是说默认 WebGL 应该是左手坐标系。这里就是让大家非常混乱的地方，实际上开发中都是使用的右手坐标系。

当然并不是右手坐标系比左手坐标系好，而是**右手坐标系**是 OpenGL 的惯例。例如微软的 DirectX 中惯用的是左手坐标系。

## 总结

WebGL 的坐标系和 OpenGL 一样，在开发中常用的是右手坐标系，但是在 NDC 中却是使用的左手坐标系，所以在代码中一般会把 Z 轴的值乘以 `-1`，翻转一下。
