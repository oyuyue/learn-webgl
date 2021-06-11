class Mat4 {
  constructor() {
    this.value = []
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


