# 变换

```js
const canvas = document.createElement('canvas')
canvas.width = canvas.height = 300;
document.body.appendChild(canvas)
const ctx = canvas.getContext('2d')

const points = [[0,0],[0,100],[100,100],[100,0]] // 正方形的 4 个顶点
ctx.beginPath()
points.forEach(p => ctx.lineTo(...transform(p))) 
// "transform" 函数为下方小节指定的变换函数
// 下面的 "transform" 函数返回新的坐标位置
ctx.closePath()
ctx.fillStyle='rgba(0,255,255,1)'
ctx.fill()
```

## 2D 平移

```js
function translate([x, y], dx, dy) {
  return [x + dx, y + dy]
}
```

## 2D 缩放

```js
function scale([x, y], s = 1) {
  return [x * s, y * s]
}
```

![image](https://user-images.githubusercontent.com/25923128/121117746-3f989a00-c84b-11eb-86ee-e284c758bad6.png)


## 2D 反射

## 2D 错切

```js
function skew([x, y]) {
  return [x + 1 * y, y]
}
```

![image](https://user-images.githubusercontent.com/25923128/121117699-255ebc00-c84b-11eb-86c0-63fee61d149d.png)

```css
div {
  transform: skew(30deg);
}
```

```js
function skew([x, y], sx = 0, sy = 0) {
  const rad = r => r * Math.PI / 180
  return [x + Math.tan(rad(sx)) * y, y + Math.tan(rad(sy)) * x]
}
```


## 2D 旋转

![image](https://user-images.githubusercontent.com/25923128/121117579-f34d5a00-c84a-11eb-9a89-10be9215ab55.png)

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

## 3D 变换

## 矩阵

## 齐次坐标


