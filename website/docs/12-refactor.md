# 代码重构

现在我们每写一个例子都要写一堆模版代码非常麻烦。这篇文章就来将代码封装重构下，代码封装主要参考 [ogl](https://github.com/oframe/ogl) 和 [threejs](https://github.com/mrdoob/three.js)。

## Renderer

渲染器用来渲染一个场景。

```js
class Renderer {
  constructor() {
    this.gl = createGl()
    this.gl.enable(this.gl.DEPTH_TEST)
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
```

## Scene

一个场景中有一堆的 `Mesh`。

```js
class Scene {
  constructor() {
    this.children = []
  }

  add(child) {
    if (this.children.find(c => c === child)) return
    this.children.push(child)
  }

  remove(child) {
    this.children = this.children.filter(c => c !== child)
  }
}
```

## Mesh

`Mesh` 也就是我们要渲染的模型。它是 `geometry` 和 `program` 的组合。

```js
class Mesh {
  constructor(geometry, program) {
    this.geometry = geometry
    this.program = program
  }

  draw(renderer) {
    this.program.use()
    this.geometry.draw(renderer, this.program, renderer.gl.TRIANGLES)
  }
}
```

## Geometry

```js
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
```

```js
class BoxGeometry extends Geometry {
  constructor() {
    super(createBox(1, 1, 1, 1, 1, 1))
  }
}
```

## Program

```js
class Program {
  constructor(renderer, { vs, fs, uniforms = {}, cullFace = renderer.gl.BACK } = {}) {
    const gl = renderer.gl

    this.renderer = renderer
    this.uniforms = uniforms
    this.cullFace = cullFace
    this.program = gl.createProgram()

    const v = createShader(gl, gl.VERTEX_SHADER, vs)
    const f = createShader(gl, gl.FRAGMENT_SHADER, fs)
    gl.attachShader(this.program, v)
    gl.attachShader(this.program, f)
    gl.linkProgram(this.program)
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(this.program))
    }
    gl.deleteShader(v)
    gl.deleteShader(f)

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

    if (this.cullFace) {
      gl.enable(gl.CULL_FACE)
    } else {
      gl.disable(gl.CULL_FACE)
    }

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
```
