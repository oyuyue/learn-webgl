class Program {
  constructor() {}
}


function createCanvas(append = true) {
  const canvas = document.createElement('canvas')
  canvas.width = 800
  canvas.height = 800
  if (append) document.body.appendChild(canvas)
  return canvas
}

function getGl(canvas) {
  if (!canvas) canvas = createCanvas()
  const gl = canvas.getContext('webgl')
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
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
