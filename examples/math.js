class Mat4 {

  constructor() {
    this.value = []
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
  
}

class Vec3 {
  constructor(x = 0, y = x, z = x) {
    this.value = [x, y, z]
  }

  get x() {
    return this.value[0]
  }

  get y() {
    return this.value[1]
  }

  get z() {
    return this.value[2]
  }

  set x(v) {
    this.value[0] = v
  }

  set y(v) {
    this.value[1] = v
  }

  set z(v) {
    this.value[2] = v
  }
}
