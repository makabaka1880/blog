<template>
    <div class="canvas-wrapper" @mousemove="onMouseMove" @mouseleave="onMouseLeave">
        <WebglCanvas ref="webglCanvas" :uniforms="uniforms" :width="width" :height="height"
            :style="{ aspectRatio: width / height }">
            <slot />
        </WebglCanvas>

        <!-- Crosshair lines -->
        <div v-if="hovering" class="crosshair horizontal" :style="{ top: `${cursor.y}px` }"></div>
        <div v-if="hovering" class="crosshair vertical" :style="{ left: `${cursor.x}px` }"></div>

        <!-- UV display -->
        <div v-if="hovering" class="uv-label" :style="{ left: `${cursor.x + 8}px`, top: `${cursor.y + 8}px` }">
            X {{ uv.x.toFixed(0) }}px <br /> Y {{ uv.y.toFixed(0) }}px
        </div>
    </div>
</template>

<script setup lang="ts">
import type { UniformDTO } from '~/utils/canvas-uniforms'
import { ref } from 'vue'
import WebglCanvas from '~/components/content/utility/WebglCanvas.vue'

const props = defineProps<{
    dim?: [number, number]
    uniforms: Record<string, UniformDTO>
}>()

const width = props.dim?.[0] ?? 512
const height = props.dim?.[1] ?? 512

const webglCanvas = ref<InstanceType<typeof WebglCanvas> | null>(null)

const hovering = ref(false)
const cursor = ref({ x: 0, y: 0 })
const uv = ref({ x: 0, y: 0 })

function onMouseMove(event: MouseEvent) {
    const canvasEl = webglCanvas.value?.$el as HTMLCanvasElement
    const wrapperEl = canvasEl?.parentElement
    if (!canvasEl || !wrapperEl) return

    const canvasRect = canvasEl.getBoundingClientRect()
    const wrapperRect = wrapperEl.getBoundingClientRect()

    // Calculate centering offset
    const offsetX = (wrapperRect.width - canvasRect.width) / 2
    const offsetY = (wrapperRect.height - canvasRect.height) / 2

    // Get position relative to canvas
    const canvasX = event.clientX - canvasRect.left
    const canvasY = event.clientY - canvasRect.top

    // Check if mouse is within canvas bounds
    const isInsideCanvas =
        canvasX >= 0 && canvasX <= canvasRect.width &&
        canvasY >= 0 && canvasY <= canvasRect.height

    if (!isInsideCanvas) {
        hovering.value = false
        return
    }

    // Position relative to wrapper (with offset for centering)
    const wrapperX = canvasX + offsetX
    const wrapperY = canvasY + offsetY

    cursor.value = { x: wrapperX, y: wrapperY }

    // Normalize to [0, 1] for UV coordinates
    if (props.dim) {
        // Use scaled coordinates when dim is provided
        uv.value = {
            x: canvasX / canvasRect.width * props.dim[0],
            y: canvasY / canvasRect.height * props.dim[1]
        }
    } else {
        // Use actual pixel coordinates from top-left when dim is not provided
        uv.value = {
            x: canvasX,
            y: canvasY
        }
    }

    hovering.value = true
}


function onMouseLeave() {
    hovering.value = false
}
</script>

<style scoped>
.canvas-wrapper {
    width: 80%;
    max-width: 100%;
    aspect-ratio: 1 / 1;
    margin: 1rem auto;
    position: relative;
    background-color: var(--color-card-background);
    display: flex;
    align-items: center;
    justify-content: center;
}

:deep(canvas) {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
}

/* Crosshair lines */
.crosshair {
    position: absolute;
    background-color: rgba(255, 0, 0, 0.8);
    pointer-events: none;
}

.crosshair.horizontal {
    height: 1px;
    width: 100%;
    transform: translateY(-0.5px);
}

.crosshair.vertical {
    width: 1px;
    height: 100%;
    transform: translateX(-0.5px);
}

/* UV label */
.uv-label {
    position: absolute;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    font-size: 0.8rem;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    pointer-events: none;
    white-space: nowrap;
}

.canvas-wrapper {
    cursor: crosshair;
}
</style>
