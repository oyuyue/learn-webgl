# 四元数

[上篇文章](/14-euler-gimbal.md)介绍了使用欧拉角表示定向，但是欧拉角有万向节死锁问题，我们可以使用的四元数来解决这个问题。四元数比较复杂，在介绍四元数之前让我们来看看和它相关的一些内容。

## 轴-角

根据欧拉旋转定理，任何三维旋转都可以找到一个轴 $\hat{n}$ 和对这个轴的旋转角度 $\theta$ 表示。对于两个定向 R1 和 R2，存在一个轴 $\hat{n}$，进行一次旋转 $\theta$，就可以将 R1 旋转到 R2。欧拉角用三个数字表示对三个基本坐标轴的旋转量。轴-角形式使用 4 个数字，1 个表示旋转角度的标量，3 个数字表示三维坐标轴的单位矢量。

## 指数映射

## 复数

## 四元数

四元数（Quaternion）由 4 个数字组成，这也是它名字的由来。和复数一样它也是由实部和虚部组成，只不过它有 3 个虚部。

$$
q = a + bi + cj + dk
$$
$$
i^2 = j^2 = k^2 = ijk = -1
$$

:::info

四元数是由哈密顿在 1843 年爱尔兰发现的。当时他正研究扩展复数到更高的维次（复数可视为平面上的点）。他不能做到三维空间的例子，但四维则造出四元数。他于 10 月 16 日跟他的妻子在都柏林的皇家运河（Royal Canal）上散步时突然想到 的方程解。之后哈密顿立刻将此方程刻在附近布鲁穆桥（Brougham Bridge，现称为金雀花桥 Broom Bridge）。

![](https://user-images.githubusercontent.com/25923128/123576809-29a44680-d805-11eb-82d9-39cb80d3dda2.png)

:::

我们还可以将它看成是 1 个标量和 1 个矢量组成。标量用 `w` 表示，`v` 或 `[x, y, z]` 表示矢量。

$$
[w \quad \bold{v}]
$$
$$
[w \quad (x, y, z)]
$$

它和上面介绍的轴-角的关系如下。

$$
[w \quad \bold{v}] = [cos(\frac{\theta}{2}) \quad sin(\frac{\theta}{2}) * \hat{n}]
$$
$$
[w \quad (x, y, z)] = [cos(\frac{\theta}{2}) \quad (sin(\frac{\theta}{2}) * n_x, sin(\frac{\theta}{2}) * n_y, sin(\frac{\theta}{2}) * n_z)]
$$

四元数也可以变负，只要将的 4 个数字都变为负数就行 `[-w (-x, -y, -z)]`，比较有意思的是的正 `q` 和负 `-q`四元数表示的是相同的角位移，因为变负意味着沿轴的另一端反方向旋转。

:::info

这篇文章只是简单介绍下四元数，如果想深入了解四元数请阅读[这篇文章](https://krasjet.github.io/quaternion/quaternion.pdf)。

:::

### 单位四元数

单位四元数表示没有旋转，有两个单位四元数，分别是 `[1 (0, 0, 0)]` 和 `[-1 (0, 0, 0)]` ，当 `θ` 是 `360` 的偶数倍时 `cos(θ / 2) = 1`，当 `θ` 是 `360` 的奇数倍时 `cos(θ / 2) = -1`。但是在数学上，只有 `[1, (0, 0, 0)]` 一个单位四元数。

### 纯四元数

纯四元数是只有虚部的四元数。因为纯四元数仅由虚部，我们可以将任意的 3D 矢量转换为纯四元数。

$$
\bold{q} = [0, \bold{v}]
$$

### 四元数大小

和矢量一样四元数也有大小并且计算方式也一样。

$$
\parallel \bold{q} \parallel = \parallel [w \quad (x, y, z)] \parallel = \sqrt{w^2 + x^2 + y^2 + z^2}
$$

我们只关心旋转量，也就是矢量是单位矢量。

```js
||q|| = ||[w, v]||
      = Math.sqrt(cos(θ / 2) ** 2 + (sin(θ / 2) * n) ** 2)
      = Math.sqrt(1)
      = 1
```

我们使用四元数的目的是为了表示定向，所以我们这里使用的四元数都是长度为 1 的四元数。

### 共轭和逆

和复数一样四元数的共轭表示为 $\bold{q^*}$ ，它是将矢量部分变负得到的， $[w \quad (-x, -y, -z)]$ ，四元数和它的共轭表示的是相反的旋转，因为共轭是将矢量变负，也就是将翻转旋转轴，但是旋转方向没变。

四元数的逆表示为 $\bold{q^{-1}}$ ，它是四元数的共轭除以四元数的大小得到的。

$$
\bold{q^{-1}} = \frac{q^*}{\parallel q\parallel}
$$

和标量一样，四元数乘以它的逆等于单位四元数 `[1, (0, 0, 0)]`。因为我们只关心旋转，旋转轴是单位矢量，四元数大小也是 1，所以对于我们来说四元数的逆和共轭是相等的。

### 加法和减法

和复数一样，四元数的加减法只需要将相应分量相加或相减就可以了。

$$
\begin{aligned}
  q1+q2&=a+bi+cj+dk+e+fi+gj+hk \\
  &=(a+e)+(b+f)i+(c+g)j+(d+h)k
\end{aligned}
$$
$$
q1-q2=(a-e)+(b-f)i+(c-g)j+(d-h)k
$$

### 乘法

四元数和标量相乘，结果是四元数的每个分量都乘以标量。

$$
\begin{aligned}
  sq&=s(a+bi+cj+dk) \\
  &=sa+sbi+scj+sdk
\end{aligned}
$$

四元数与四元数相乘，其结果还是四元数。

$$
\begin{aligned}
  q1q2&=(a+bi+cj+dk)(e+fi+gj+hk) \\
  &=ae+afi+agj+ahk+ \\
  &\quad\: bei+bfi^2+bgij+bhik+ \\
  &\quad\: cej+cfji+cgj^2+chjk+ \\
  &\quad\: dek+dfki+dgkj+dhk^2
\end{aligned}
$$

我们可以利用 $ijk$ 之间的关系来简化上面公式。

![](https://user-images.githubusercontent.com/25923128/123592595-01761100-d820-11eb-82ef-02de3228c071.png)

$$
\begin{aligned}
  q1q2&=(ae-bf-cg-dh)+\\
  &\quad\: (be+af-dg+ch)i+\\
  &\quad\: (ce+df+ag-bh)j+\\
  &\quad\: (de-cf+bg+ah)k
\end{aligned}
$$

观察上面简化后的等式，我们还可以将乘法写成矩阵形式。

$$
q1q2=\begin{bmatrix}
   a & -b & -c & -d \\
   b & a & -d & c \\
   c & d & a & -b \\
   d & -c & b & a
\end{bmatrix}
\begin{bmatrix}
   e \\
   f \\
   g \\
   h
\end{bmatrix}
$$

四元数乘法是不满足交换律的，如果是右乘 $q1$ 将是下面这个矩阵。

$$
q2q1=\begin{bmatrix}
   a & -b & -c & -d \\
   b & a & d & -c \\
   c & -d & a & b \\
   d & c & -b & a
\end{bmatrix}
\begin{bmatrix}
   e \\
   f \\
   g \\
   h
\end{bmatrix}
$$

如果我们将四元数看成矢量形式 $\bold{v}=[b,c,d]$ ，$\bold{u}=[f,g,h]$ 我们还可以将乘法写成下面形式，它也称作格拉斯曼积。

$$
\begin{aligned}
  q1q2&=[ae - v \cdot u, au+ev+v\times u] \\
  &=[ae-bf-cg-dh, \\
  &\quad\: (af+eb+ch-dg, \\
  &\quad\: ag+ec+df-bh, \\
  &\quad\: ah+ed+bg-cf)]
\end{aligned}
$$

四元数乘法可以结合但是不可以交换，四元数乘积的大小等于，它们大小的乘积，四元数乘积的倒数等于相反顺序倒数的乘积。

$$
(ab)c=a(bc)
$$
$$
ab \not = ba
$$
$$
\parallel ab \parallel=\parallel a \parallel * \parallel b \parallel
$$
$$
(ab)^{-1}=b^{-1}a^{-1}
$$

### 差

### 点积

### 插值

## 四元数转欧拉角

## 欧拉角转四元数

## 四元数转矩阵

## 矩阵转四元数
