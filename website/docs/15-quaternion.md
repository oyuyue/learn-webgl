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

### 共轭和逆

和复数一样四元数的共轭表示为 $\bold{q^*}$ ，它是将矢量部分变负得到的， $[w \quad (-x, -y, -z)]$ ，四元数和它的共轭表示的是相反的旋转，因为共轭是将矢量变负，也就是将翻转旋转轴，但是旋转方向没变。

四元数的逆表示为 $\bold{q^{-1}}$ ，它是四元数的共轭除以四元数的大小得到的。

$$
\bold{q^{-1}} = \frac{q^*}{\| q\| }
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

![image](https://user-images.githubusercontent.com/25923128/123831146-99feb500-d936-11eb-993f-c1b04fb2ce48.png)

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

## 二重四元数

除普通的四元数外，几何代数中还衍生出来了一个二重四元数（Dual Quaternion）。它不仅能够表示 3D 旋转，还能够表示 3D 空间中的任何的刚体运动（Rigid Motion），即旋转、平移、反射和均匀缩放。和普通四元数一样，二重四元数同样可以表示为 $q=a+bi+cj+dk$ ，但是 $a, b, c, d$ 不再是实数而是[二元数](https://zh.wikipedia.org/wiki/%E4%BA%8C%E5%85%83%E6%95%B0)。

## 四元数转欧拉角

## 欧拉角转四元数

## 四元数转矩阵

## 矩阵转四元数
