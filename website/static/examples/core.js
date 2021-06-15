class Renderer {
  constructor() {
    this.gl = createGl()
    this.gl.enable(this.gl.DEPTH_TEST)
    this.gl.enable(this.gl.CULL_FACE)
  }

  render(scene) {
    const gl = this.gl
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    scene.children.forEach(mesh => {
      mesh.draw(this)
    })
  }
}

class Program {
  constructor(renderer, { vs, fs, uniforms = {} } = {}) {
    this.renderer = renderer
    const gl = renderer.gl
    this.uniforms = uniforms

    const v = createShader(gl, gl.VERTEX_SHADER, vs)
    const f = createShader(gl, gl.FRAGMENT_SHADER, fs)
    this.program = gl.createProgram()
    gl.attachShader(this.program, v)
    gl.attachShader(this.program, f)
    gl.linkProgram(this.program)
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(this.program))
    }

    this.uniformMap = new Map()
    const numUnis = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS)
    for (let i = 0; i < numUnis; i++) {
      const uniform = gl.getActiveUniform(this.program, i)
      this.uniformMap.set(uniform, gl.getUniformLocation(this.program, uniform.name))
    }

    this.attributeMap = new Map()
    const numAttribs = gl.getProgramParameter(this.program, gl.ACTIVE_ATTRIBUTES)
    for (let i = 0; i < numAttribs; i++) {
      const attribute = gl.getActiveAttrib(this.program, i)
      this.attributeMap.set(attribute, gl.getAttribLocation(this.program, attribute.name))
    }
  }

  use() {
    const gl = this.renderer.gl
    gl.useProgram(this.program)

    this.uniformMap.forEach((loc, { name, type }) => {
      const value = this.uniforms[name]

      if (!value) throw new Error(`${name} is not provided`)

      switch (type) {
        case 5126:
            return value.length ? gl.uniform1fv(loc, value) : gl.uniform1f(loc, value); // FLOAT
        case 35664:
            return gl.uniform2fv(loc, value); // FLOAT_VEC2
        case 35665:
            return gl.uniform3fv(loc, value); // FLOAT_VEC3
        case 35666:
            return gl.uniform4fv(loc, value); // FLOAT_VEC4
        case 35670: // BOOL
        case 5124: // INT
        case 35678: // SAMPLER_2D
        case 35680:
            return value.length ? gl.uniform1iv(loc, value) : gl.uniform1i(loc, value); // SAMPLER_CUBE
        case 35671: // BOOL_VEC2
        case 35667:
            return gl.uniform2iv(loc, value); // INT_VEC2
        case 35672: // BOOL_VEC3
        case 35668:
            return gl.uniform3iv(loc, value); // INT_VEC3
        case 35673: // BOOL_VEC4
        case 35669:
            return gl.uniform4iv(loc, value); // INT_VEC4
        case 35674:
            return gl.uniformMatrix2fv(loc, false, value); // FLOAT_MAT2
        case 35675:
            return gl.uniformMatrix3fv(loc, false, value); // FLOAT_MAT3
        case 35676:
            return gl.uniformMatrix4fv(loc, false, value); // FLOAT_MAT4
      }
    })
  }
}

class Geometry {
  constructor(attributes) {
    this.drawRange = { start: 0, count: 0 }
    this.attributes = Object.create(null)

    Object.keys(attributes).forEach((k) => this.setAttribute(k, attributes[k]))
  }

  setAttribute(name, attribute) {
    attribute.size = attribute.size || 3
    attribute.target = attribute.target || 0x8892
    attribute.stride = attribute.stride || 0
    attribute.offset = attribute.offset || 0
    attribute.normalized = attribute.normalized || false
    attribute.type = attribute.type || attribute.value.constructor === Float32Array ? 0x1406 : attribute.value.constructor === Uint16Array ? 0x1403 : 0x1405
    attribute.count = attribute.count || (attribute.stride ? attribute.value.byteLength / attribute.stride : attribute.value.length / attribute.size)
    this.attributes[name] = attribute

    if (name === 'index') {
      this.drawRange.count = attribute.count
    } else if (!this.attributes.index) {
      this.drawRange.count = Math.max(this.drawRange.count, attribute.count)
    }
  }

  draw(renderer, program, mode = 0x0004) {
    const gl = renderer.gl

    const index = this.attributes.index
    if (index) {
      if (index.buffer) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index.buffer)
      } else {
        index.buffer = gl.createBuffer()
        gl.bindBuffer(index.target, index.buffer)
        gl.bufferData(index.target, index.value, gl.STATIC_DRAW)
      }
    }

    program.attributeMap.forEach((loc, { name }) => {
      const item = this.attributes[name]
      if (!item) throw new Error(`Cannot found attribute ${name} in geometry`)

      if (!item.buffer) {
        item.buffer = gl.createBuffer()
        gl.bindBuffer(item.target, item.buffer)
        gl.bufferData(item.target, item.value, gl.STATIC_DRAW)
      }

      gl.bindBuffer(item.target, item.buffer)
      gl.vertexAttribPointer(loc, item.size, item.type, item.normalized, item.stride, item.offset)
      gl.enableVertexAttribArray(loc)
    })

    if (index) {
      gl.drawElements(mode, this.drawRange.count, index.type, this.drawRange.start)
    } else {
      gl.drawArrays(mode, this.drawRange.start, this.drawRange.count)
    }
  }
}

class PlaneGeometry extends Geometry {
  constructor() {
    super(createPlane())
  }
}

class BoxGeometry extends Geometry {
  constructor() {
    super(createBox(1, 1, 1, 1, 1, 1))
  }
}

class Node {
  constructor() {
    this._parent = null
    this.children = []

    this.position = new Vec3()
    this.rotation = new Vec3()
    this.scale = new Vec3(1)
    this.up = new Vec3(0, 1, 0)

    this.matrix = new Mat4()
    this.worldMatrix = new Mat4()
  }

  set parent(node) {
    if (!node || this._parent === node) return
    if (this._parent) {
      this._parent.removeChild(this)
    }
    node.add(this)
    this._parent = node
  }

  get parent() {
    return this._parent
  }

  add(child) {
    if (this.children.find(c => c === child)) return
    child._parent = this
    this.children.push(child)
  }

  remove(child) {
    this.children = this.children.filter(c => c !== child)
    child._parent = null
  }
}

class Scene extends Node {}

class Camera extends Node {

}

class Mesh extends Node {
  constructor(geometry, program) {
    super()
    this.geometry = geometry
    this.program = program
  }

  draw(renderer) {
    this.program.use()
    this.geometry.draw(renderer, this.program, renderer.gl.TRIANGLES)
  }
}

function createPlane(width = 1, height = 1, widthSegments = 1, heightSegments = 1) {
  widthSegments = Math.floor(widthSegments)
  heightSegments = Math.floor(heightSegments)
  const segWidth = width / widthSegments
  const segHeight = height / heightSegments
  const halfWidth = width / 2
  const halfHeight = height / 2
  const maxWS = widthSegments + 1
  const maxHS = heightSegments + 1

  const numPoints = maxWS * maxHS
  const position = new Float32Array(numPoints * 3)
  const normal = new Float32Array(numPoints * 3)
  const uv = new Float32Array(numPoints * 2)
  const index = []

  let x, y, num = 0
  for (let i = 0; i < maxHS; i++) {
    y = i * segHeight - halfHeight
    for (let j = 0; j < maxWS; j++, num++) {
      x = j * segWidth - halfWidth
      position[num * 3] = x
      position[num * 3 + 1] = -y
      position[num * 3 + 2] = 0
      normal[num * 3] = 0
      normal[num * 3 + 1] = 0
      normal[num * 3 + 2] = 1
      uv[num * 2] = j / widthSegments
      uv[num * 2 + 1] = 1 - i / heightSegments
    }
  }

  let a, b, c, d
  for (let i = 0; i < heightSegments; i++) {
    for (let j = 0; j < widthSegments; j++) {
      a = j + maxWS * i;
      b = j + maxHS * (i + 1);
      c = b + 1;
      d = a + 1;
      index.push(a, b, c, a, c, d)
    }
  }

  return createGeometryResult(
    position,
    numPoints > 65536 ? new Uint32Array(index) : new Uint16Array(index),
    normal,
    uv
  )
}

function createBox(width = 1, height = 1, depth = 1, widthSeg = 1, heightSeg = 1, depthSeg = 1) {
  const segWidth = width / widthSeg
  const segHeight = height / heightSeg
  const segDepth = height / depthSeg
  const halfWidth = width / 2
  const halfHeight = height / 2
  const halfDepth = depth / 2

  const position = []
  const index = []

  let numVertex = 0
  buildPlane(widthSeg, heightSeg, segWidth, segHeight, halfWidth, halfHeight, halfDepth, 1, -1, 0, 1, 2)
  buildPlane(widthSeg, heightSeg, segWidth, segHeight, halfWidth, halfHeight, -halfDepth, -1, -1, 0, 1, 2)

  buildPlane(depthSeg, heightSeg, segDepth, segHeight, halfDepth, halfHeight, -halfWidth, 1, -1, 2, 1, 0)
  buildPlane(depthSeg, heightSeg, segDepth, segHeight, halfDepth, halfHeight, halfWidth, -1, -1, 2, 1, 0)

  buildPlane(widthSeg, depthSeg, segWidth, segDepth, halfWidth, halfDepth, -halfHeight, 1, -1, 0, 2, 1)
  buildPlane(widthSeg, depthSeg, segWidth, segDepth, halfWidth, halfDepth, halfHeight, -1, -1, 0, 2, 1)

  function buildPlane(uSeg, vSeg, uLen, vLen, halfU, halfV, depth, uDir, vDir, ix, iy, iz) {
    const maxU = uSeg + 1
    const maxV = vSeg + 1

    let x, y, pos = []
    for (let i = 0; i < maxV; i++) {
      y = i * vLen - halfV
      for (let j = 0; j < maxU; j++) {
        x = j * uLen - halfU
        pos[ix] = x * uDir
        pos[iy] = y * vDir
        pos[iz] = depth
        position.push(...pos)
      }
    }

    let a, b, c, d
    for (let i = 0; i < vSeg; i++) {
      for (let j = 0; j < uSeg; j++) {
        a = numVertex + j + maxU * i
        b = numVertex + j + maxV * (i + 1)
        c = b + 1
        d = a + 1
        index.push(a, b, c, a, c, d)
      }
    }

    numVertex += (maxU * maxV)
  }

  return createGeometryResult(
    new Float32Array(position),
    numVertex > 65536 ? new Uint32Array(index) : new Uint16Array(index),
  )
}

function createGeometryResult(
  position,
  index,
  normal,
  uv,
  positionSize = 3,
  normalSize = 3,
  uvSize = 2,
) {
  const res = Object.create(null)

  if (position) res.position = { size: positionSize, value: position, target: 0x8892 }
  if (normal) res.normal = { size: normalSize, value: normal, target: 0x8892 }
  if (uv) res.uv = { size: uvSize, value: uv, target: 0x8892 }
  if (index) res.index = { size: 1, value: index, target: 0x8893 }

  return res
}

function createGl(width = 350, height = 350) {
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl')
  const dpr = window.devicePixelRatio || 1

  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  canvas.width = dpr * width
  canvas.height = dpr * height
  gl.viewport(0, 0, canvas.width, canvas.height)

  document.body.append(canvas)
  return gl
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    throw new Error(
      "could not compile shader -> " + source + gl.getShaderInfoLog(shader)
    );
  }
  return shader;
}
