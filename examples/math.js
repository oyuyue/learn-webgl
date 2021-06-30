class Mat4 {

  static identity(out = []) {
    return Object.assign(out, [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ])
  }

  static translate(a, v, out = []) {
    let x = v[0],
      y = v[1],
      z = v[2];
    let a00, a01, a02, a03;
    let a10, a11, a12, a13;
    let a20, a21, a22, a23;
  
    if (a === out) {
      out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
      out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
      out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
      out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
      a00 = a[0];
      a01 = a[1];
      a02 = a[2];
      a03 = a[3];
      a10 = a[4];
      a11 = a[5];
      a12 = a[6];
      a13 = a[7];
      a20 = a[8];
      a21 = a[9];
      a22 = a[10];
      a23 = a[11];
  
      out[0] = a00;
      out[1] = a01;
      out[2] = a02;
      out[3] = a03;
      out[4] = a10;
      out[5] = a11;
      out[6] = a12;
      out[7] = a13;
      out[8] = a20;
      out[9] = a21;
      out[10] = a22;
      out[11] = a23;
  
      out[12] = a00 * x + a10 * y + a20 * z + a[12];
      out[13] = a01 * x + a11 * y + a21 * z + a[13];
      out[14] = a02 * x + a12 * y + a22 * z + a[14];
      out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }
  
    return out;
  }

  static fromTranslation(v, out = []) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
  }

  static fromXRotation(rad) {
    const s = Math.sin(rad)
    const c = Math.cos(rad)
    return [
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1
    ]
  }

  static fromYRotation(rad) {
    const s = Math.sin(rad)
    const c = Math.cos(rad)
    return [
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1
    ]
  }

  static fromZRotation(rad) {
    const s = Math.sin(rad)
    const c = Math.cos(rad)
    return [
      c, s, 0, 0,
      -s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]
  }

  static multiply(a, b, out = []) {
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return out;
  }

  static lookAt(eye, target, up, out = []) {
      const eyeX = eye[0], eyeY = eye[1], eyeZ = eye[2];
      const upX = up[0], upY = up[1], upZ = up[2];
      const targetX = target[0], targetY = target[1], targetZ = target[2];
      let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;

      z0 = eyeX - targetX;
      z1 = eyeY - targetY;
      z2 = eyeZ - targetZ;
      len = z0 * z0 + z1 * z1 + z2 * z2
      if (len > 0) {
        len = 1 / Math.sqrt(len)
        z0 *= len;
        z1 *= len;
        z2 *= len;
      } else {
        return Mat4.identity(out)
      }

      x0 = upY * z2 - upZ * z1;
      x1 = upZ * z0 - upX * z2;
      x2 = upX * z1 - upY * z0;
      len = x0 * x0 + x1 * x1 + x2 * x2;
      if (len > 0) {
        len = 1 / Math.sqrt(len);
        x0 *= len;
        x1 *= len;
        x2 *= len;
      } else {
        return Mat4.identity(out)
      }

      y0 = z1 * x2 - z2 * x1;
      y1 = z2 * x0 - z0 * x2;
      y2 = z0 * x1 - z1 * x0;

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

class Vec3 extends Array {
  constructor(x = 0, y = x, z = x) {
    super(x, y, z)
  }

  get x() { return this[0] }
  get y() { return this[1] }
  get z() { return this[2] }

  set x(v) { this[0] = v }
  set y(v) { this[1] = v }
  set z(v) { this[2] = v }
}

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
    const s = 1 / Math.hypot(out[0], out[1], out[2], out[3])
    out[0] *= s
    out[1] *= s
    out[2] *= s
    out[3] *= s

    return out
  }

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
