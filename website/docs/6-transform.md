# 变换

[上一篇文章](/5-shader.md)的最后我们渲染了一个正方形，但是只能看见它的正面。要看到它的其他面就需要对它进行变换处理了。

在进行 3D 变换之前，我们先来看下 2D 的变换。我们会用下面这个模板代码执行多个不同的变换。

```js
const canvas = document.createElement('canvas')
canvas.width = canvas.height = 300;
document.body.appendChild(canvas)
const ctx = canvas.getContext('2d')

transform = {下面的变换函数}

const points = [[0,0],[0,100],[100,100],[100,0]] // 正方形的 4 个顶点
ctx.beginPath()
points.forEach(p => ctx.lineTo(...transform(p))) 
// "transform" 函数为下方小节指定的变换函数
// 下面的 "transform" 函数返回新的坐标位置
ctx.closePath()
ctx.fillStyle='rgba(0,255,255,1)'
ctx.fill()
```

上面代码申明了一个正方形的 4 个顶点，然后使用下面个各种变换函数处理这 4 个顶点，返回新的顶点，最终处理渲染后的正方形。

## 2D 平移

平移相信大家都知道怎么做，例如我们想把这个正方形沿 X 轴移动 10px，Y 轴 10px。

```js
function translate([x, y], dx = 10, dy = 10) {
  return [x + dx, y + dy]
}
```

上面代码就实现了移动正方形的功能，在原有位置上加上指定的位移量。

## 2D 缩放

要将一个元素，只需要将它的坐标乘上一个缩放因子就行了，比如这个正方形缩放 0.5 倍，它的新坐标就为 `[[0,0],[0,50],[50,50],[50,0]]`。

![image](https://user-images.githubusercontent.com/25923128/121117746-3f989a00-c84b-11eb-86ee-e284c758bad6.png)

我们可以使用两个缩放因子来分别缩放 X 轴和 Y 轴。

```js
function scale([x, y], xs = 1, ys = xs) {
  return [x * xs, y * ys]
}
```

## 2D 反射

反射也叫镜像，它可以用来翻转物体，和照镜子效果一样。实现起来也比较简单使用上方缩放方法将 `x` 轴或 `y` 轴缩放 `-1` 倍（也就是垂直或水平镜像）就行了。

## 2D 错切

错切可以用来倾斜物体，它会不均匀的拉伸物体，物体错切后它的面积和体积不会发生变化。

执行错切的一个思路是将一个坐标的倍数加到另一个坐标上，比如下面将 1 倍的 Y 坐标加到 X 坐标上。

```js
function skew([x, y]) {
  return [x + 1 * y, y]
}
```

![image](https://user-images.githubusercontent.com/25923128/121117699-255ebc00-c84b-11eb-86c0-63fee61d149d.png)

我们知道 CSS 里面也有错切方法，不过 CSS 中的 `skew` 函数支持设置倾斜角度。

```css
div {
  transform: skew(30deg);
}
```

我们可以稍微改造下，来支持度数参数。

```js
function skew([x, y], sx = 0, sy = 0) {
  const rad = r => r * Math.PI / 180
  return [x + Math.tan(rad(sx)) * y, y + Math.tan(rad(sy)) * x]
}
```

我们首先把角度变为弧度，然后利用 `tan` 函数来计算具体倾斜量，因为 `tan` 等于对边比临边，再乘上临边就是需要的倾斜量了。

## 2D 旋转

旋转是这几个变换中最难的一个。要知道如何旋转一个物体，我们可以从下面这幅图开始。

![image](https://user-images.githubusercontent.com/25923128/121728695-3136d080-cb20-11eb-8307-3f81ff836e85.png)

根据三角函数，我们知道 P 点的 `x` 为 `r * cos(a)`，`y` 为 `r * sin(a)`。我们将 P 点旋转 `a` 得到 P' 点，同样可以知道 P' 点的坐标为 `[r * cos(a + b), r * sin(a + b)]`。

根据三角函数两角和公式。

```js
sin(a +- b) = sin(a) * cos(b) +- cos(a) * sin(b)
cos(a +- b) = cos(a) * cos(b) -+ sin(a) * sin(b)
```

我们将 P' 点坐标分解为。

```js
P' = [r * cos(a + b), r * sin(a + b)]
p' = [r * (cos(a) * cos(b) - sin(a) * sin(b)), r * (sin(a) * cos(b) + cos(a) * sin(b))]

P' = [P.x * cos(b) - P.y * sin(b), P.x * sin(b) + P.y * cos(b)]
```

现在我们得到了旋转公式，套用公式就可以写出旋转变换函数。

```js
function rotate([x, y], deg = 0) {
  const rad = deg * Math.PI / 180
  return [
     x * Math.cos(rad) - y * Math.sin(rad), 
     x * Math.sin(rad) + y * Math.cos(rad)
  ]
}
```

![image](https://user-images.githubusercontent.com/25923128/121117617-019b7600-c84b-11eb-9677-04020c5ae3cd.png)

## 矩阵

## 齐次坐标

## 3D 变换
