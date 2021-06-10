class Renderer {
  constructor() {
    this.gl = createGl()
  }

  render(scene) {

  }
}

class Scene {
  constructor() {}
}

class Program {
  constructor(renderer, { vs, fs } = {}) {
    this.renderer = renderer
    const gl = renderer.gl

    const v = createShader(gl, gl.VERTEX_SHADER, vs)
    const f = createShader(gl, gl.FRAGMENT_SHADER, fs)
    this.program = gl.createProgram()
    gl.attachShader(this.program, v)
    gl.attachShader(this.program, f)
    gl.linkProgram(this.program)
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(this.program))
    }

    const numAttribs = gl.getProgramParameter(this.program, gl.ACTIVE_ATTRIBUTES)
    this.attributeMap = new Map()
    for (let i = 0; i < numAttribs; i++) {
      const attribute = gl.getActiveAttrib(this.program, i)
      const loc = gl.getAttribLocation(this.program, attribute)
      this.attributeMap.set(attribute, loc)
    }
  }

  use() {
    this.renderer.gl.useProgram(this.program)
  }
}

class Geometry {
  constructor() {}
}

class PlaneGeometry extends Geometry {
  constructor() {
    super()
    this.drawRange = { start: 0, count: 0 }
    this.attributes = createPlane()

    Object.keys(this.attributes).forEach((k) => {
      const item = this.attributes[k]
      item.count = item.count || (item.stride ? item.data.byteLength / item.stride : item.data.length / item.size)
      item.buffer = gl.createBuffer()
      gl.bindBuffer(item.target, item.buffer)
      gl.bufferData(item.target, item.data, gl.STATIC_DRAW)

      if (key === 'index') {
        this.drawRange.count = item.count
      } else if (!this.attributes.index) {
        this.drawRange.count = Math.max(this.drawRange.count, item.count)
      }
    })
  }

  draw(renderer, program) {
    const gl = renderer.gl

    program.attributeMap.forEach((loc, { name }) => {
      const item = this.attributes[name]
      if (!item) throw new Error(`Cannot found attribute ${name} in geometry`)

      gl.bindBuffer(item.target, item.buffer)
      gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(loc)
    })

    if (this.attributes.index) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.attributes.index.buffer)
    }

    if (this.attributes.index) {
      gl.drawElements()
    } else {
      gl.drawArrays()
    }
  }
}

class Mesh {
  constructor(geometry, program) {
    this.geometry = geometry
    this.program = program
  }

  draw() {
    
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

  let x, y, num
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

  if (position) res.position = { size: positionSize, data: position, target: 0x8892 }
  if (normal) res.normal = { size: normalSize, data: normal, target: 0x8892 }
  if (uv) res.uv = { size: uvSize, data: uv, target: 0x8892 }
  if (index) res.index = { size: 1, data: index, target: 0x8893 }

  Object.values(res).forEach(v => {
    v.stride = v.offset = 0
    v.normalized = false
    v.type = v.data.constructor === Float32Array
              ? 0x1406
              : v.data.constructor === Uint16Array
              ? 0x1403
              : 0x1405
  })

  return res
}

function createGl(width = 500, height = 500) {
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('gl')
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
