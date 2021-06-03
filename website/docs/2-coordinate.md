# 坐标系

WebGL 的坐标系和 canvas 2d 的不太一样。

```js
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
```

![image](https://user-images.githubusercontent.com/25923128/120576159-e993b300-c454-11eb-881c-dd2b169a9f36.png)

canvas 2d 的坐标原点在左上角，X 轴和 Y 轴的正值分别向右和向下。

WebGL 集成了 OpenGL 的坐标系，它更符合我们的常识一点。

![image](https://user-images.githubusercontent.com/25923128/120579185-a982ff00-c459-11eb-9d8e-0fa6de2103d3.png)
