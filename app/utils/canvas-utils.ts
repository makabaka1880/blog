/**
 * WebGL Utility Functions
 * Provides helper functions for creating and managing WebGL contexts and programs
 */

export const drawSvgOnCanvas = async (
    ctx: CanvasRenderingContext2D,
    svg: string,
    x: number,
    y: number,
    w: number,
    h: number
) => {
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    await new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, x, y, w, h);
            URL.revokeObjectURL(url);
            resolve();
        };
        img.onerror = () => reject(new Error('Failed to load SVG'));
        img.src = url;
    });
};
export interface WebGLContextOptions {
    antialias?: boolean
    alpha?: boolean
    depth?: boolean
    stencil?: boolean
    preserveDrawingBuffer?: boolean
}

/**
 * Creates a WebGL context with specified options
 */
export function createWebGLContext(
    canvas: HTMLCanvasElement,
    options: WebGLContextOptions = {}
): WebGLRenderingContext | null {
    const contextOptions = {
        antialias: options.antialias ?? true,
        alpha: options.alpha ?? false,
        depth: options.depth ?? false,
        stencil: options.stencil ?? false,
        preserveDrawingBuffer: options.preserveDrawingBuffer ?? false
    }

    const gl =
        canvas.getContext('webgl', contextOptions) ||
        canvas.getContext('experimental-webgl', contextOptions) as WebGLRenderingContext | null

    return gl
}

/**
 * Creates a shader from source code
 */
export function createShader(
    gl: WebGLRenderingContext,
    type: number,
    source: string
): WebGLShader | null {
    const shader = gl.createShader(type)
    if (!shader) {
        console.error(`Failed to create shader of type ${type}`)
        return null
    }

    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
    }

    return shader
}

/**
 * Creates a WebGL program from vertex and fragment shaders
 */
export function createProgram(
    gl: WebGLRenderingContext,
    vertex_shader: WebGLShader,
    fragment_shader: WebGLShader
): WebGLProgram | null {
    const program = gl.createProgram()
    if (!program) {
        console.error('Failed to create program')
        return null
    }

    gl.attachShader(program, vertex_shader)
    gl.attachShader(program, fragment_shader)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program linking error:', gl.getProgramInfoLog(program))
        gl.deleteProgram(program)
        return null
    }

    return program
}

/**
 * Creates a buffer with data
 */
export function createBuffer(
    gl: WebGLRenderingContext,
    target: number,
    data: ArrayBufferView,
    usage: number = gl.STATIC_DRAW
): WebGLBuffer | null {
    const buffer = gl.createBuffer()
    if (!buffer) {
        console.error('Failed to create buffer')
        return null
    }

    gl.bindBuffer(target, buffer)
    gl.bufferData(target, data, usage)

    return buffer
}

/**
 * Creates a full-screen quad (triangle strip) for fragment shader rendering
 */
export function createFullScreenQuad(
    gl: WebGLRenderingContext
): WebGLBuffer | null {
    const positions = new Float32Array([
        -1, -1,  // bottom-left
        1, -1,  // bottom-right
        -1, 1,  // top-left
        1, 1   // top-right
    ])

    return createBuffer(gl, gl.ARRAY_BUFFER, positions)
}

/**
 * Creates a full-screen triangle for fragment shader rendering (more efficient)
 */
export function createFullScreenTriangle(
    gl: WebGLRenderingContext
): WebGLBuffer | null {
    const positions = new Float32Array([
        -1, -1,  // bottom-left
        3, -1,  // bottom-right (extended)
        -1, 3   // top-left (extended)
    ])

    return createBuffer(gl, gl.ARRAY_BUFFER, positions)
}

/**
 * Creates a default vertex shader that renders a full-screen quad
 */
export function createDefaultVertexShader(gl: WebGLRenderingContext): WebGLShader | null {
    const default_vertex_shader_code = `attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_uv = a_position * 0.5 + 0.5;  // Convert from [-1,1] to [0,1]
}
`

    return createShader(gl, gl.VERTEX_SHADER, default_vertex_shader_code)
}

/**
 * Creates a default fragment shader that renders red
 */
export function createDefaultFragmentShader(gl: WebGLRenderingContext): WebGLShader | null {
    const default_fragment_shader_code = `precision mediump float;
varying vec2 v_uv;

void main() {
  gl_FragColor = vec4(v_uv.x, v_uv.y, 0.5, 1.0);
}
`

    return createShader(gl, gl.FRAGMENT_SHADER, default_fragment_shader_code)
}

