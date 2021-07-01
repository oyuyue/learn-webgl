# 四元数

[上篇文章](/14-euler-gimbal.md)介绍了使用欧拉角表示定向，但是欧拉角有万向节死锁问题，我们可以使用的四元数来解决这个问题。四元数比较复杂，在介绍四元数之前让我们来看看和它相关的一些内容。

## 轴-角

根据欧拉旋转定理，任何三维旋转都可以找到一个轴 $\hat{n}$ 和对这个轴的旋转角度 $\theta$ 表示。对于两个定向 R1 和 R2，存在一个轴 $\hat{n}$，进行一次旋转 $\theta$，就可以将 R1 旋转到 R2。欧拉角用三个数字表示对三个基本坐标轴的旋转量。轴-角形式使用 4 个数字，1 个表示旋转角度的标量，3 个数字表示三维坐标轴的单位矢量。

## 指数映射

上面轴-角的旋转轴使用的是单位矢量，我们可以让旋转角度乘上旋转轴而不丢失任何信息，来产生一个矢量 $e=\theta \hat{n}$ ，这就是指数映射形式，它只用 3 个数字表示定向。我们可以通过 $\theta = \|e \|$ 获取旋转角度，归一化 $e$ 获取旋转轴。

## 复数

复数（Complex Number）表示为 $z=a+bi$ ，其中 $a$ 称为实部， $b$ 称为虚部分， $i^2$ 等于 $-1$ 。

### 加减法

复数加减法是将的对应分量相加减。

$$
z1 \pm z2=(a1 \pm a2) + (b1 \pm b2)i
$$

### 乘法

用分配律来计算两个复数乘积。

$$
\begin{aligned}
z1z2&=(a1+b1i)(a2+b2i) \\
&=a1a2 + a1b2i + a2b1i + b1b2i^2 \\
&=a1a2-b1b2+(a2b1+a1b2)i
\end{aligned}
$$

### 模长和共轭

复数的模长等于 $\|z\| =\sqrt{a^2+b^2}$ 。共轭是将虚部变成负 $z=a-bi$ 。复数和它的共轭相乘可以得到它的模长的平方。

$$
\begin{aligned}
  \| z \|^2 &= (a+bi)(a-bi) \\
  &=a^2-abi+abi+b^2 \\
  &=a^2+b^2
\end{aligned}
$$

### 极坐标型

我们可以将复数画在二维坐标轴上。

![](https://user-images.githubusercontent.com/25923128/123728977-cbd83300-d8c6-11eb-8faf-0855a379b6e4.png)

从上图 $z=a+bi$ 就像一个二维矢量，我们可以发现 $a=cos(\theta)*\|z\|$ 和 $b=sin(\theta)*\|z\|$ ，我们可以将复数写成 $z=\|z\|(cos(\theta)+isin(\theta))$ 。 

根据[欧拉公式](https://zh.wikipedia.org/wiki/%E6%AC%A7%E6%8B%89%E5%85%AC%E5%BC%8F)。

$$
e^{i\theta}=cos(\theta)+isin(\theta)
$$

![](https://user-images.githubusercontent.com/25923128/123728837-90d5ff80-d8c6-11eb-9b44-663b8b7c7d07.png)

我们令 $r=\|z\|$ ，那么可以将复数写成 $z=re^{i\theta}$ ，如果我们只考虑旋转可以将缩放因子 $r$ 设为 $1$ 。我们可以将二维矢量看成一个复数 $v=x+yi$ ，让它乘上 $z=e^{i\theta}$ 就可以旋转 $\theta$ 度了。

$$
v'=e^{i\theta}v
$$

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

这篇文章只是简单介绍下四元数，如果想深入了解四元数请阅读[这篇文章](https://krasjet.github.io/quaternion/quaternion.pdf)。通过[这个视频](https://www.youtube.com/watch?v=d4EgbgTm0Bg&ab_channel=3Blue1Brown)可视化四元数。[这个网站](https://eater.net/quaternions/)可以在线交互四元数。

:::

### 纯四元数

纯四元数是只有虚部的四元数。因为纯四元数仅由虚部，我们可以将任意的 3D 矢量转换为纯四元数。

$$
\bold{q} = [0, \bold{v}]
$$

### 四元数大小/模长

和矢量一样四元数也有大小并且计算方式也一样。

$$
\| \bold{q} \| = \| [w \quad (x, y, z)] \| = \sqrt{w^2 + x^2 + y^2 + z^2}
$$

我们只关心旋转量，也就是矢量是单位矢量。

$$
\begin{aligned}
\| q \| &= \| [w, v] \| \\
&=\sqrt{cos(\frac{\theta}{2})^2 + (sin(\frac{\theta}{2})n)^2} \\
&=\sqrt{1} \\
&=1
\end{aligned}
$$

我们使用四元数的目的是为了表示定向，所以我们这里使用的四元数都是长度为 1 的四元数。

### 单位四元数

如果一个四元数的大小是 1，那么这个四元数就被称为单位四元数。我们可以将一个四元数除以它的大小得到一个单位四元数。

$$
U_q = \frac{q}{\| q \| }
$$

### 共轭和逆

和复数一样四元数的共轭表示为 $\bold{q^*}$ ，它是将矢量部分变负得到的， $[w \quad (-x, -y, -z)]$ ，四元数和它的共轭表示的是相反的旋转，因为共轭是将矢量变负，也就是将翻转旋转轴，但是旋转方向没变。

四元数的逆表示为 $\bold{q^{-1}}$ ，它是四元数的共轭除以四元数的大小得到的。

$$
\bold{q^{-1}} = \frac{q^*}{\| q\| }
$$

因为我们只关心旋转，旋转轴是单位矢量四元数大小也是 1，所以对于我们来说四元数的逆和共轭是相等的。

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
  q1q2&=(ae-bf-cg-dh)+ \\
  &\quad\: (be+af-dg+ch)i+ \\
  &\quad\: (ce+df+ag-bh)j+ \\
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

如果我们将四元数看成矢量形式 $\bold{v}=[b,c,d]$ ，$\bold{u}=[f,g,h]$ 我们还可以将乘法写成下面形式。

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
\| ab \| =\| a \| * \| b \|
$$
$$
(ab)^{-1}=b^{-1}a^{-1}
$$

### 四元数和旋转

假设有一个矢量或点，我们将它定义为纯四元数 $p = [0, v]$ 。将这个点旋转 $\theta$ 度，我们用另一个四元数 $q = [cos(\frac{\theta}{2}) \quad sin(\frac{\theta}{2}) * \hat{u}]$ 表示。我们可以用下面这个式子将 $p$ 旋转 $\theta$ 度得到 $p'$ 。

$$
p'=qpq^*=qpq^{-1}=[0, cos(\theta)v+(1-cos(\theta))(u \cdot v)u+sin(\theta)(u \times v)]
$$

多个旋转也可以组合就和矩阵一样，假设现在有两个旋转四元数，先旋转 $a$ 后旋转 $b$ ，这相当于它们的乘积 $ba$ 执行单次旋转，旋转顺序是由内到外。

$$
\begin{aligned}
  p'&=b(apa^{-1})b^{-1} \\
  &=(ba)p(ba)^{-1}
\end{aligned}
$$

### 旋转的矩阵形式

我们还可以将 $v'=qvq^*$ 写成矩阵形式，在上面乘法小节中我们求出四元数的左乘和右乘矩阵形式。将 $v$ 右乘 $q^*$ 和左乘 $q$ 的矩阵形式就可以得到的 $v'$ ，那么 $q$ 和 $q*$ 矩阵形式相乘就可以得到四元数 $q$ 表示的旋转矩阵形式了。 $q=a+bi+cj+dk$ 并且 $a^2+b^2+c^2+d^2=1$ 我们可以得出如下矩阵。

$$
\begin{aligned}
qvq^*&=L(q)R(q^*)v \\
&=\begin{bmatrix}
   a & -b & -c & -d \\
   b & a & -d & c \\
   c & d & a & -b \\
   d & -c & b & a
\end{bmatrix}
\begin{bmatrix}
   a & b & c & d \\
   -b & a & -d & c \\
   -c & d & a & -b \\
   -d & -c & b & a
\end{bmatrix}
  v \\
  &=\begin{bmatrix}
    1 & 0 & 0 & 0 \\
    0 & 1-2c^2-2d^2 & 2bc-2ad & 2ac+2bd \\
    0 & 2bc+2ad & 1-2b^2-2d^2 & 2cd-2ab \\
    0 & 2bd-2ac & 2ab+2cd & 1-2b^2-2c^2
  \end{bmatrix}
  v
\end{aligned}
$$

矩阵的最外圈不会对 $v$ 进行任何变换，所以提取上方矩阵中 `3x3` 旋转的部分，就是四元数 3D 旋转矩阵形式了。

$$
\begin{bmatrix}
  1-2c^2-2d^2 & 2bc-2ad & 2ac+2bd \\
  2bc+2ad & 1-2b^2-2d^2 & 2cd-2ab \\
  2bd-2ac & 2ab+2cd & 1-2b^2-2c^2
\end{bmatrix}
$$

### 旋转差

我们还可以利用四元数乘法计算两个四元数之间的差值，也就是一个方向旋转到另一个方向的角位移。 $da=b$ 中 $d$ 就是 $a$ 旋转到 $b$ 的角位移。

$$
\begin{aligned}
  (da)a^{-1}&= ba^{-1} \\
  d(aa^{-1})&=ba^{-1} \\
  d[1,(0,0,0)]&=ba^{-1} \\
  d&=ba^{-1}
\end{aligned}
$$

### 点积

和矢量一样，四元数点积的结果也是一个标量。

$$
\begin{aligned}
  q1 \cdot q2&=[w1 v1] \cdot [w2 v2] \\
  &=w1w2 + v1 \cdot v2 \\
  &=w1w2+x1x2+y1y2+z1z2
\end{aligned}
$$

对于单位四元数，它们的大小 $-1 <= a \cdot b <= 1$ 。$q1 \cdot q2$ 的绝对值越大， $q1$ 和 $q2$ 表示的角位移就越相似。

### 指数形式

和复数一样四元数，单位四元数 $u=[0,u]$ 也可以写成 $e^{u\theta}$ 形式。 对于任意四元数 $q=[cos(\theta), sin(\theta)u]$ ，那么 $log(q)=log(e^{u\theta})=[0,u\theta]$ 。我们还可以给单位四元数取 $t$ 次幂。

$$
q^t=(e^{u\theta})^t=e^{u(t\theta)}=[cos(t\theta), sin(t\theta)u]
$$

对于标量 $a$ ， $a^0=1; a^1=a$ 。$t$ 从 0 变到 1，$a^t$ 从 1 变到 $a$ 。四元数取幂也类似 $q^t$ 从 $[1,\bold{0}]$ 变化到 $q$ 。我们可以通过 $t$ 来控制旋转度数的倍数，不过需要注意 $q^8$ 可能不是原来旋转角度的 8 倍，因为四元数不能表示多圈旋转，而且它会使用最短弧表示角位移，也就是如果 $q$ 表示 30 度，$q^8$ 不会旋转 240 度，而是逆着旋转 120 度。我们可以用下面代码计算 $q^t$ 的值。

```js
function interpolate([w, x, y, z], t) {
  // [cos(ta), sin(ta)u]
  if (Math.abs(w) < 0.999) {
    const alpha = Math.acos(w) // θ / 2
    const newAlpha = alpha * t
    w = Math.cos(newAlpha)
    const mult = Math.sin(newAlpha) / Math.sin(alpha)
    x *= mult
    y *= mult
    z *= mult
  }
  return [w,x,y,z]
}
```

### Lerp

Lerp 表示线性插值它会沿着一条直线进行插值。

$Lerp(q_0, q_1, t)=q_0+t(q_1-q_0)=(1-t)q_0+tq_1$

![](https://user-images.githubusercontent.com/25923128/123822122-936c3f80-d92e-11eb-8a6c-907041a0b31f.png)

可以看到它是沿着一条直线进行插值的，但是这样插值出来的四元数并不是单位四元数。

### Nlerp

线性插值的结果不是单位四元数，但是我们可以在插值完毕后再将它变成单位四元数，这个被称为正规化线性插值 Nlerp。

```js
class Quat {
  static lerp(a, b, t, out = []) {
    const ax = a[0], ay = a[1], az = a[2], aw = a[3];
    const bx = b[0], by = b[1], bz = b[2], bw = b[3];
    const cosom = ax * bx + ay * by + az * bz + aw * bw;
    const k0 = 1 - t;
    const k1 = cosom >= 0 ? t : -t;

    out[0] = k0 * ax + k1 * bx
    out[1] = k0 * ay + k1 * by
    out[2] = k0 * az + k1 * bz
    out[3] = k0 * aw + k1 * bw

    const s = 1 / Math.hypot(out[0], out[1], out[2], out[3]) // 1 / ||out||
    out[0] *= s
    out[1] *= s
    out[2] *= s
    out[3] *= s

    return out
  }
}
```

上面代码可以对两个单位四元数进行线性插值，返回的也是单位四元数。上面代码中当两个四元数的点积小于 0 时会将其中一个四元数变负，原因请看下面的 Slerp。

Nlerp 插值仍然有一定问题，当需要插值的弧比较大时，角速度会有显著的变化。下图中线性插值是等长的，但是它们的弧长完全不相等。

![](https://user-images.githubusercontent.com/25923128/123914331-e0ddc080-d9b1-11eb-8d84-f568544ba3d6.png)

### Slerp

四元数的一个优势就是球面线性插值 Slerp，它可以提供两个定向之间平滑的插值。它是对两个四元数的夹角进行插值，这样就可以不改变四元数的大小。

和线性插值一样我们首先需要求出两个四元数之间的夹角差，上面我们已经求过了，两个四元数的差如下。

$$
\Delta q=q_1q_0^{-1}
$$

然后需要计算这个差的倍数，也就是旋转量。

$$
(\Delta q)^t
$$

然后通过四元数乘法组合来旋转 $q_0$ ，就得到夹角插值结果了。

$$
Slerp(q_0,q_1,t)=(q_1q_0^{-1})^tq_0
$$

我们还可以想象两个二维矢量，将 $v_t$ 看成是 $v_0$ 和 $v_1$ 的线性组合。

![](https://user-images.githubusercontent.com/25923128/123828581-3a070f00-d934-11eb-9df3-25debac23182.png)

也就是存在 $a$ 和 $b$ ，让 $v_t=av_0+bv_1$ ， 其中 $v_0$ 和 $v_1$ 都是单位矢量，我们可以做下图。

![](https://user-images.githubusercontent.com/25923128/123831146-99feb500-d936-11eb-993f-c1b04fb2ce48.png)

通过上图我们可以看出来 $sin(\theta)=\frac{sin(t\theta)}{b}$ ，求得 $b=\frac{sin(t\theta)}{sin(\theta)}$ 。类似的方法我们可以求出 $a=\frac{sin((1-t)\theta)}{sin(\theta)}$ 。

$$
v_t=av_0+bv_1=\frac{sin((1-t)\theta)}{sin(\theta)}v_0+\frac{sin(t\theta)}{sin(\theta)}v_1
$$

同样的思路我们扩展到四元数空间，可以重新得到 Slerp 函数。

$$
Slerp(q_0,q_1,t)=\frac{sin((1-t)\theta)}{sin(\theta)}q_0+\frac{sin(t\theta)}{sin(\theta)}q_1
$$

其中 $\theta$ 是两个四元数之间的夹角，和二维矢量一样我们可以通过 $arccos(q_0 \cdot q_1)$ 得到。

之前说过 $q$ 和 $-q$ 表示的是同一个方向，但是在 Slerp 上可能会产生不同的结果。解决方法是选择 $q_0$ 和 $q_1$ 的符号，使得 $q_0 \cdot q_1$ 非负也就是非钝角，如果点积小于 0 就反转其中一个四元数，这样就始终选择从 $q_0$ 到 $q_1$ 的最短旋弧。

![](https://user-images.githubusercontent.com/25923128/123832544-075f1580-d938-11eb-9de0-fdca0c113855.png)

```js
class Quat {
  static slerp(a, b, t, out = []) {
    const ax = a[0], ay = a[1], az = a[2], aw = a[3];
    let bx = b[0], by = b[1], bz = b[2], bw = b[3];
    let theta, cosom, absCosom, sinom, k0, k1;

    // a · b
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    absCosom = Math.abs(cosom)
    if (1 - absCosom > 0.000001) {
      // slerp
      theta = Math.acos(absCosom) // θ = arccos(a · b)
      sinom = 1 / Math.sin(theta)
      k0 = Math.sin((1 - t) * theta) * sinom
      k1 = Math.sin(t * theta) * sinom
    } else {
      // lerp
      k0 = 1 - t
      k1 = t
    }

    k1 = (cosom >= 0) ? k1 : -k1;
    out[0] = k0 * ax + k1 * bx
    out[1] = k0 * ay + k1 * by
    out[2] = k0 * az + k1 * bz
    out[3] = k0 * aw + k1 * bw

    return out;
  }
}
```

我们将式子变成了上面函数，需要注意的是如果两个四元数夹角非常接近我们使用线性插值，不然 Slerp 会除 0。

## 二重四元数

除普通的四元数外，几何代数中还衍生出来了一个二重四元数（Dual Quaternion）。它不仅能够表示 3D 旋转，还能够表示 3D 空间中的任何的刚体运动（Rigid Motion），即旋转、平移、反射和均匀缩放。和普通四元数一样，二重四元数同样可以表示为 $q=a+bi+cj+dk$ ，但是 $a, b, c, d$ 不再是实数而是[二元数](https://zh.wikipedia.org/wiki/%E4%BA%8C%E5%85%83%E6%95%B0)。

## 四元数转矩阵

上面我们已经求出四元数 3D 旋转矩阵形式。

$$
\begin{bmatrix}
  1-2y^2-2z^2 & 2xy-2wz & 2wy+2xz \\
  2xy+2wz & 1-2x^2-2z^2 & 2yz-2wx \\
  2xz-2wy & 2wx+2yz & 1-2x^2-2y^2
\end{bmatrix}
$$

所以直接将这个矩阵变成代码就行了。

```js
class Mat4{
  static fromQuat([x, y, z, w], out = []) {
    const x2 = x + x, y2 = y + y, z2 = z + z;
    const xx = x * x2, yy = y * y2, zz = z * z2;
    const yx = y * x2, zx = z * x2, zy = z * y2;
    const wx = w * x2, wy = w * y2, wz = w * z2;

    out[0] = 1 - yy - zz
    out[1] = yx + wz
    out[2] = zx - wy
    out[3] = 0
    out[4] = yx - wz
    out[5] = 1 - xx - zz
    out[6] = zy + wx
    out[7] = 0
    out[8] = zx + wy
    out[9] = zy - wx
    out[10] = 1 - xx - yy
    out[11] = 0
    out[12] = 0
    out[13] = 0
    out[14] = 0
    out[15] = 1
    return out
  }
}
```

## 矩阵转四元数

矩阵转四元数同样还是利用上方求出的四元数矩阵，有多种方式通过矩阵的项求解四元数的分量，我们来看一种常用的方式，因为是单位四元数，所以 $x^2+y^2+z^2+w^2=1$ 。

$$
m_{11}+m_{22}+m_{33}=3-4x^2-4y^2-4z^2=4w^2-1
$$

通过将矩阵对角线的 3 项相加可以得到的 $w$ 分量的值，通过 $w$ 分量和矩阵剩下其他项我们可以求出四元数的其他分量。

$$
\begin{aligned}
  m_{32}-m_{23} &=2wx+2yz-2yz+2wx=4wx \\
  m_{13}-m_{31} &=2wy+2xz-2xz+2wy=4wy \\
  m_{21}-m_{12} &=2xy+2wz-2xy+2wz=4wz
\end{aligned}
$$

我们可以发现将上面式子的结果除去 $4w$ 就可以得到剩下的分量了。不过如果 $w$ 等于 $0$ ，那么就不能除 $w$ 了，我们还需要找到其他组合，通过除 x、y 或 z 来求出四元数。

$$
\begin{aligned}
  m_{11}-m_{22}-m_{33} &=4x^2-1 \\
  -m_{11}+m_{22}-m_{33} &=4y^2-1 \\
  -m_{11}-m_{22}+m_{33} &=4z^2-1
\end{aligned}
$$

为了获取稳定的四元数，我们应该选择 $x,y,z,w$ 中绝对值最大的。

```js
class Quat {
  static fromMat3(m, out=[]) {
    const fTrace = m[0] + m[4] + m[8];
    let fRoot;

    if (fTrace > 0) {
      // |w| > 1/2
      fRoot = Math.sqrt(fTrace + 1.0); // 2w
      out[3] = 0.5 * fRoot;
      fRoot = 0.5 / fRoot; // 1/(4w)
      out[0] = (m[5] - m[7]) * fRoot
      out[1] = (m[6] - m[2]) * fRoot
      out[2] = (m[1] - m[3]) * fRoot
    } else {
      // |w| <= 1/2
      let i = 0; // x
      if (m[4] > m[0]) i = 1; // y > x
      if (m[8] > m[i * 3 + i]) i = 2; // z > xy
      let j = (i + 1) % 3;
      let k = (i + 2) % 3;

      fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
      out[i] = 0.5 * fRoot;
      fRoot = 0.5 / fRoot;
      out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
      out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
      out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
    }

    return out
  }
}
```

上面代码将 `3x3` 的旋转矩阵转换成四元数。

## 欧拉角转四元数

将欧拉角转换成四元数和欧拉角转换成矩阵类似，我们找到绕 3 个基本轴的旋转四元数，然后将它们相乘就行了。四元数可以写成这种形式 $[cos(\frac{\theta}{2}) \quad (sin(\frac{\theta}{2})x, sin(\frac{\theta}{2})y, sin(\frac{\theta}{2})z)]$ 我们可以轻松得到 XYZ 轴旋转的四元数。

$$
\begin{aligned}
  X&=[cos(x/2),(sin(x/2),0,0)] \\
  Y&=[cos(y/2),(0,sin(y/2),0)] \\
  Z&=[cos(z/2),(0,0,sin(z/2))]
\end{aligned}
$$

然后将这三个四元数相乘就可以将欧拉角转换成四元数了，不过不同顺序的欧拉角四元数相乘的顺序也不同。

```js
class Quat {
  static fromEuler(x, y, z, out = [], order = 'yxz') {
    x *= 0.5; z *= 0.5; y *= 0.5;
    const sx = Math.sin(x), cx = Math.cos(x);
    const sy = Math.sin(y), cy = Math.cos(y);
    const sz = Math.sin(z), cz = Math.cos(z);

    switch (order) {
      case "xyz":
        out[0] = sx * cy * cz + cx * sy * sz;
        out[1] = cx * sy * cz - sx * cy * sz;
        out[2] = cx * cy * sz + sx * sy * cz;
        out[3] = cx * cy * cz - sx * sy * sz;
        break;

      case "xzy":
        out[0] = sx * cy * cz - cx * sy * sz;
        out[1] = cx * sy * cz - sx * cy * sz;
        out[2] = cx * cy * sz + sx * sy * cz;
        out[3] = cx * cy * cz + sx * sy * sz;
        break;

      case "yxz":
        out[0] = sx * cy * cz + cx * sy * sz;
        out[1] = cx * sy * cz - sx * cy * sz;
        out[2] = cx * cy * sz - sx * sy * cz;
        out[3] = cx * cy * cz + sx * sy * sz;
        break;

      case "yzx":
        out[0] = sx * cy * cz + cx * sy * sz;
        out[1] = cx * sy * cz + sx * cy * sz;
        out[2] = cx * cy * sz - sx * sy * cz;
        out[3] = cx * cy * cz - sx * sy * sz;
        break;

      case "zxy":
        out[0] = sx * cy * cz - cx * sy * sz;
        out[1] = cx * sy * cz + sx * cy * sz;
        out[2] = cx * cy * sz + sx * sy * cz;
        out[3] = cx * cy * cz - sx * sy * sz;
        break;

      case "zyx":
        out[0] = sx * cy * cz - cx * sy * sz;
        out[1] = cx * sy * cz + sx * cy * sz;
        out[2] = cx * cy * sz - sx * sy * cz;
        out[3] = cx * cy * cz + sx * sy * sz;
        break;

      default:
        throw new Error('Unknown angle order ' + order);
    }

    return out;
  }
}
```

## 四元数转欧拉角

我们可以结合[上篇文章](/14-euler-gimbal.md)求出旋转矩阵和这篇文章上面求出的四元数旋转矩阵来讲四元数转换成欧拉角。

$$
\begin{bmatrix}
  cos(H)cos(B)+sin(H)sin(P)sin(B) & sin(H)sin(P)cos(B)-sin(B)cos(H) & sin(H)cos(P) \\
  sin(B)cos(P) & cos(P)cos(B) & -sin(P) \\
  cos(H)sin(P)sin(B)-sin(H)cos(B) & sin(B)sin(H)+cos(H)sin(P)cos(B) & cos(H)cos(P)
\end{bmatrix}
$$

$$
\begin{bmatrix}
  1-2y^2-2z^2 & 2xy-2wz & 2wy+2xz \\
  2xy+2wz & 1-2x^2-2z^2 & 2yz-2wx \\
  2xz-2wy & 2wx+2yz & 1-2x^2-2y^2
\end{bmatrix}
$$

可以发现 $-sin(P) = 2yz-2wx$ 那么 $p=arcsin(-2(yz-wx))$ ，和上篇文章一样的我们可以通过矩阵的其他项分别求出 Heading 和 Bank，还有处理 Patch 为正负 90 度的时候。

```js
class Quat {
  static toEuler([x, y, z, w], out = []) {
    const sp = -2 * (y * z - w * x)

    if (Math.abs(sp) < 0.99999) {
      out[0] = Math.asin(sp)
      out[1] = Math.atan2(x * z + w * y, 0.5 - x * x - y * y)
      out[2] = Math.atan2(x * y + w * z, 0.5 - x * x - z * z)
    } else {
      out[0] = Math.PI * (sp < 0 ? -0.5 : 0.5)
      out[1] = Math.atan2(w * y - x * z, 0.5 - y * y - z * z)
      out[2] = 0
    }

    return out // [x, y, z]
  }
}
```
