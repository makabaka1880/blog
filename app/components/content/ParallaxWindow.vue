<template>
    <canvas class="image-like-content" ref="parallaxCanvas"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, watchEffect } from 'vue';

const props = withDefaults(defineProps<{
    src: string,
    depth: string,
    offsetX?: number,
    offsetY?: number,
    sensitivityX?: number,
    sensitivityY?: number,
    reverseDepth?: boolean
}>(), {
    offsetX: 0,
    offsetY: 0,
    sensitivityX: 0.004,
    sensitivityY: 0.004,
    reverseDepth: false
});

const parallaxCanvas = ref<HTMLCanvasElement | null>(null);
let renderFn: ((offsetX: number, offsetY: number) => void) | null = null;
const imageAspectRatio = ref<number | null>(null);

// --- WebGL helper functions ---
function loadTexture(gl: WebGLRenderingContext, url: string): Promise<{ texture: WebGLTexture; width: number; height: number }> {
    return new Promise(resolve => {
        const image = new Image();
        image.onload = () => {
            const tex = gl.createTexture()!;
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            resolve({ texture: tex, width: image.width, height: image.height });
        };
        image.src = url;
    });
}

function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

function setupGeometry(gl: WebGLRenderingContext, program: WebGLProgram) {
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const posAttrib = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posAttrib);
    gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 0, 0);
}

// --- Shader setup ---
async function setupShader(canvas: HTMLCanvasElement) {
    if (!canvas) return null;
    const gl = canvas.getContext('webgl');
    if (!gl) return null;

    // vertex shader
    const vertSrc = `
          attribute vec4 a_position;
          varying vec2 v_uv;
          void main() {
              gl_Position = a_position;
              v_uv = a_position.xy * 0.5 + 0.5;
          }
      `;
    const fragSrc = await fetch('/assets/shaders/parallax-component.glsl')
        .then(r => r.text())
        .catch(() => 'precision mediump float; void main() { gl_FragColor = vec4(1,0,0,1); }');

    const vertShader = compileShader(gl, gl.VERTEX_SHADER, vertSrc);
    const fragShader = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc);
    if (!vertShader || !fragShader) return null;

    const program = gl.createProgram()!;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    setupGeometry(gl, program);

    const albedoResult = await loadTexture(gl, props.src);
    const depthResult = await loadTexture(gl, props.depth);

    // Set aspect ratio from image dimensions
    imageAspectRatio.value = albedoResult.width / albedoResult.height;

    const uniforms = {
        uOffset: gl.getUniformLocation(program, 'u_offset'),
        uSampler: gl.getUniformLocation(program, 'u_texture'),
        uDepth: gl.getUniformLocation(program, 'u_depth'),
        uRes: gl.getUniformLocation(program, 'u_resolution'),
        uImageRes: gl.getUniformLocation(program, 'u_imageRes'),
        uSensitivity: gl.getUniformLocation(program, 'u_sensitivity'),
        uImageScale: gl.getUniformLocation(program, 'u_imageScale'),
        uImageTranslate: gl.getUniformLocation(program, 'u_imageTranslate'),
        uHorizontalScale: gl.getUniformLocation(program, 'u_horizontalScale'),
        uAlignmentOffset: gl.getUniformLocation(program, 'u_alignmentOffset'),
        uDepthCenter: gl.getUniformLocation(program, 'u_depthCenter'),
        uDepthPower: gl.getUniformLocation(program, 'u_depthPower'),
        uDepthCenter2: gl.getUniformLocation(program, 'u_depthCenter2'),
        uRotationPivot: gl.getUniformLocation(program, 'u_rotationPivot'),
        uReverseDepth: gl.getUniformLocation(program, 'u_reverseDepth')
    };

    const render = (offsetX: number = props.offsetX, offsetY: number = props.offsetY) => {
        if (!canvas) return;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = canvas.clientWidth * dpr;
        canvas.height = canvas.clientHeight * dpr;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Feed in the provided offsets
        gl.uniform2f(uniforms.uOffset, offsetX, offsetY);
        gl.uniform2f(uniforms.uRes, canvas.width, canvas.height);
        gl.uniform2f(uniforms.uImageRes, albedoResult.width, albedoResult.height);
        gl.uniform2f(uniforms.uSensitivity, props.sensitivityX, props.sensitivityY);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, albedoResult.texture);
        gl.uniform1i(uniforms.uSampler, 0);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, depthResult.texture);
        gl.uniform1i(uniforms.uDepth, 1);

        gl.uniform1i(uniforms.uReverseDepth, props.reverseDepth ? 1 : 0);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    return { render };
}

onMounted(async () => {
    if (!parallaxCanvas.value) return;
    const shader = await setupShader(parallaxCanvas.value);
    if (shader) {
        renderFn = shader.render;
        const resizeObserver = new ResizeObserver(() => {
            if (renderFn) renderFn(0, 0);
        });
        resizeObserver.observe(parallaxCanvas.value);
    }
});

defineExpose({
    render: (offsetX: number = 0, offsetY: number = 0) => {
        if (renderFn) renderFn(offsetX, offsetY);
    },
    $el: parallaxCanvas
});
</script>

<style lang="scss" scoped>
canvas {
    aspect-ratio: v-bind(imageAspectRatio);
}

.image-like-content {
    display: block;
    width: 80%;
    border-radius: 1rem;
    margin: 0rem auto;
}
</style>