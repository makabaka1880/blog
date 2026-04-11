<template>
    <canvas ref="canvas_ref" :width="width" :height="height" class="webgl-canvas" />
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, useSlots, watch } from 'vue'
import {
    createWebGLContext,
    createShader,
    createProgram,
    createFullScreenTriangle,
} from '~/utils/canvas-utils'
import {
    type GPUUniform,
    type UniformDTO,
    compileUniformDTO,
    createTextureUnitAllocator,
    httpImageLoad,
    bindUniform
} from '~/utils/canvas-uniforms'

interface Props {
    width?: number
    height?: number
    uniforms?: Record<string, UniformDTO>
    autoRender?: boolean
    fragmentSource?: string
    updatableUniforms?: string[]
}

const props = withDefaults(defineProps<Props>(), {
    width: 512,
    height: 512,
    autoRender: true,
    uniforms: () => ({}),
    updatableUniforms: () => []
})

// Template refs
const canvas_ref = ref<HTMLCanvasElement | null>(null)

// WebGL context and program
let gl: WebGLRenderingContext | null = null
let program: WebGLProgram | null = null
let position_buffer: WebGLBuffer | null = null
let position_attribute_location: number | null = null

// Track initialization state
let initialized = false;

// Store uniforms and allocator for dynamic updates
let allocator: ReturnType<typeof createTextureUnitAllocator> | null = null;
let gpuUniforms: Record<string, GPUUniform> = {};

// Extract shader code from slot
function extractTexts(): string {
    const slots = useSlots()
    const default_slot = slots.default?.()

    if (!default_slot) return ''

    const rawText = default_slot.flatMap(extractText).join('\n')
    
    // Remove backticks and 'glsl' language identifier if present
    // This handles cases like ```glsl ...code... ```
    const cleaned = rawText
        .replace(/```glsl/g, '')  // Remove opening ```glsl
        .replace(/```/g, '')      // Remove closing ```
        .trim()
    
    return cleaned
}

function extractText(node: any): string[] {
    if (!node) return []
    if (typeof node === 'string') return [node]
    if (typeof node.children === 'string') return [node.children]
    if (Array.isArray(node.children)) {
        return node.children.flatMap(extractText)
    }
    if (node.children && typeof node.children.default === 'function') {
        return node.children.default().flatMap(extractText)
    }
    return []
}

// Default vertex shader
const default_vertex_shader_code = `attribute vec2 a_position;
uniform vec2 u_resolution;
varying vec2 v_uv;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_uv = a_position * 0.5 + 0.5;  // Convert from [-1,1] to [0,1]
}
`

// Initialize WebGL
async function initWebGL() {
    if (!canvas_ref.value) {
        console.error('Canvas element not available')
        return
    }

    gl = createWebGLContext(canvas_ref.value, { alpha: false })
    if (!gl) {
        console.error('WebGL not supported')
        return
    }

    // Get fragment shader from slot
    let fragment_shader_code = extractTexts()
    if (props.fragmentSource) {
        try {
            fragment_shader_code = await fetch(props.fragmentSource)
                .then(response => response.text())
        } catch (error) {
            console.error('Failed to fetch fragment shader source:', error)
            return
        }
    }

    if (!fragment_shader_code.trim()) {
        console.warn('No fragment shader code provided in slot')
        return
    }

    // Create vertex shader
    const vertex_shader = createShader(gl, gl.VERTEX_SHADER, default_vertex_shader_code)
    if (!vertex_shader) {
        console.error('Failed to create vertex shader')
        return
    }

    // Create fragment shader from slot content
    const fragment_shader = createShader(gl, gl.FRAGMENT_SHADER, fragment_shader_code)
    if (!fragment_shader) {
        console.error('Failed to create fragment shader')
        return
    }

    // Create program
    program = createProgram(gl, vertex_shader, fragment_shader)
    if (!program) {
        console.error('Failed to create WebGL program')
        return
    }

    position_attribute_location = gl.getAttribLocation(program, 'a_position')
    if (position_attribute_location < 0) {
        console.error('Could not get attribute location for a_position')
        return
    }

    position_buffer = createFullScreenTriangle(gl)
    if (!position_buffer) {
        console.error('Failed to create position buffer')
        return
    }

    // Use the program
    gl.useProgram(program)

    // MARK: Uniforms
    allocator = createTextureUnitAllocator(gl)
    try {
        gpuUniforms = Object.fromEntries(
            Object.entries(props.uniforms).map(([key, value]) => [
                key,
                compileUniformDTO(gl!, value, allocator!.getOrCreateTexture, httpImageLoad)
            ])
        )
    } catch (error) {
        console.error('Failed to compile uniform DTOs:', error)
        return
    }

    // Allocate and bind uniforms
    for (const [uniformName, gpuUniform] of Object.entries(gpuUniforms)) {
        const location = gl.getUniformLocation(program, uniformName)
        if (location !== null) {
            try {
                bindUniform(gpuUniform, gl, location)
            } catch (error) {
                console.error(`Failed to bind uniform ${uniformName}:`, error)
                return
            }
        } else {
            console.warn(`Could not get location for uniform: ${uniformName}`)
        }
    }

    // Set up position attribute
    gl.enableVertexAttribArray(position_attribute_location)
    gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer)
    gl.vertexAttribPointer(position_attribute_location, 2, gl.FLOAT, false, 0, 0)

    // Only mark as initialized after all steps are successful
    initialized = true;
    draw();
}

// Draw function to render the scene
function draw(newUniforms?: Record<string, UniformDTO>) {
    if (!gl || !program || !initialized) {
        console.warn('WebGL context, program not initialized, or not properly initialized');
        return;
    }

    // If new uniforms are provided, use them temporarily for this draw call
    if (newUniforms && allocator) {
        try {
            // Compile and bind the new uniforms temporarily
            const newGpuUniforms: Record<string, GPUUniform> = Object.fromEntries(
                Object.entries(newUniforms).map(([key, value]) => [
                    key,
                    compileUniformDTO(gl!, value, allocator!.getOrCreateTexture, httpImageLoad)
                ])
            );

            // Bind the new uniforms
            for (const [uniformName, gpuUniform] of Object.entries(newGpuUniforms)) {
                const location = gl.getUniformLocation(program, uniformName)
                if (location) {
                    bindUniform(gpuUniform, gl, location)
                } else {
                    console.warn(`Could not get location for uniform: ${uniformName}`)
                }
            }
        } catch (error) {
            console.error('Error binding temporary uniforms:', error);
            return;
        }
    } else {
        try {
            for (const [uniformName, gpuUniform] of Object.entries(gpuUniforms)) {
                const location = gl.getUniformLocation(program, uniformName)
                if (location) {
                    bindUniform(gpuUniform, gl, location)
                } else {
                    console.warn(`Could not get location for uniform: ${uniformName}`)
                }
            }
        } catch (error) {
            console.error('Error binding original uniforms:', error);
            return;
        }
    }

    // Set viewport and clear
    gl.viewport(0, 0, props.width, props.height)
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    // Draw the full-screen triangle
    gl.drawArrays(gl.TRIANGLES, 0, 3)
}

// Private function to update uniforms for internal use
function updateUniforms(newUniforms: Record<string, UniformDTO>) {
    if (!gl || !program || !allocator || !initialized) {
        console.warn('WebGL context, program, allocator not initialized, or not properly initialized');
        return;
    }

    try {
        // Only update uniforms that are marked as updatable
        const uniformsToUpdate = props.updatableUniforms.length > 0
            ? Object.fromEntries(
                Object.entries(newUniforms).filter(([key]) => 
                    props.updatableUniforms.includes(key)
                )
            )
            : newUniforms;

        // Compile the new uniforms
        const newGpuUniforms: Record<string, GPUUniform> = Object.fromEntries(
            Object.entries(uniformsToUpdate).map(([key, value]) => [
                key,
                compileUniformDTO(gl!, value, allocator!.getOrCreateTexture, httpImageLoad)
            ])
        );

        // Update the stored gpuUniforms with new values
        for (const [uniformName, gpuUniform] of Object.entries(newGpuUniforms)) {
            gpuUniforms[uniformName] = gpuUniform;
        }
    } catch (error) {
        console.error('Error updating uniforms:', error);
    }
}

// Clean up WebGL resources
function cleanupWebGL() {
    if (canvas_ref.value) {
        canvas_ref.value.removeEventListener('webglcontextlost', handleContextLost);
        canvas_ref.value.removeEventListener('webglcontextrestored', handleContextRestored);
    }
    
    if (gl) {
        if (program) {
            gl.deleteProgram(program)
            program = null
        }
        if (position_buffer) {
            gl.deleteBuffer(position_buffer)
            position_buffer = null
        }
    }
    gl = null
    initialized = false; // Reset initialization state
}

onMounted(async () => {
    try {
        await initWebGL()

        // Handle WebGL context loss
        if (gl && canvas_ref.value) {
            canvas_ref.value.addEventListener('webglcontextlost', handleContextLost, false);
            canvas_ref.value.addEventListener('webglcontextrestored', handleContextRestored, false);
        }

        // Watch for changes in uniforms prop and update accordingly
        if (props.autoRender) {
            watch(
                () => props.uniforms,
                (newUniforms) => {
                    if (initialized) {  // Only update if properly initialized
                        updateUniforms(newUniforms)
                        draw()
                    }
                },
                { deep: true }
            )
        }
    } catch (error) {
        console.error('Error initializing WebGL:', error)
    }
})

// Handle WebGL context lost event
function handleContextLost(event: Event) {
    console.warn('WebGL context lost');
    event.preventDefault(); // Try to prevent the context from being lost
    initialized = false; // Mark as not initialized
}

// Handle WebGL context restored event
async function handleContextRestored() {
    console.log('WebGL context restored');
    // Reinitialize WebGL after context is restored
    await initWebGL();
    if (initialized) {
        draw();
    }
}

onUnmounted(() => {
    cleanupWebGL()
})

defineExpose({
    draw,
    canvas_ref
})
</script>

<style scoped>
.webgl-canvas {
    display: block;
    width: min-content;
    max-width: 100%;
}
</style>