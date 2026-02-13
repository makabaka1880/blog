<template>
    <div ref="containerRef" class="reveal-container" @mousedown="startDragging" @touchstart="startDragging">
        <div class="layer background-layer">
            <slot name="background"></slot>
        </div>

        <div class="layer foreground-layer" :style="{ width: `${sliderPercent}%` }">
            <div class="content-wrapper" :style="{ width: containerWidth + 'px' }">
                <slot name="foreground"></slot>
            </div>
        </div>

        <div class="slider-handle" :style="{
            left: `${sliderPercent}%`,
            cursor: isDragging ? 'grabbing' : 'grab'
        }">
            <div class="handle-line"></div>
            <div class="handle-circle">
                <span class="icon">↔</span>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.reveal-container {
    position: relative;
    width: 100%;
    /* Removed aspect-ratio: 16 / 9; */
    /* Removed border-radius: 1rem; */
    overflow: hidden;
    user-select: none;
    -webkit-user-drag: none;

    .layer {
        /* background-layer stays relative so it expands the container height */
        position: relative; 
        width: 100%;
        pointer-events: none;

        &.foreground-layer {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%; // Matches the height of the background layer
            z-index: 2;
            overflow: hidden;
            border-right: 2px solid white;
        }
    }

    .content-wrapper {
        height: 100%;
        // Ensures the inner image doesn't try to shrink
        display: flex;
        align-items: flex-start;
    }

    .slider-handle {
        position: absolute;
        top: 0;
        bottom: 0;
        z-index: 3;
        transform: translateX(-50%);
        // Removed transition for snappier dragging (optional)

        .handle-line {
            width: 2px;
            height: 100%;
            background: white;
        }

        .handle-circle {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40px;
            height: 40px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        }
    }
}

/* Ensure the slotted images/content aren't being squashed */
:deep(img), :deep(video), :deep(canvas) {
    display: block;
    width: 100%;
    height: auto;
    object-fit: contain;
}
</style>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const sliderPercent = ref(50);
const isDragging = ref(false);
const containerRef = ref<HTMLElement | null>(null);
const containerWidth = ref(0);

const updateWidth = () => {
    if (containerRef.value) containerWidth.value = containerRef.value.offsetWidth;
};

const startDragging = (e: MouseEvent | TouchEvent) => {
    isDragging.value = true;
    handleMove(e); // Update immediately on click
};

const stopDragging = () => {
    isDragging.value = false;
};

const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging.value || !containerRef.value) return;

    const rect = containerRef.value.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const position = ((x - rect.left) / rect.width) * 100;

    sliderPercent.value = Math.min(Math.max(position, 0), 100);
};

onMounted(() => {
    updateWidth();
    window.addEventListener('resize', updateWidth);

    // Listen on window so drag continues even if mouse leaves the container
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('mouseup', stopDragging);
    window.addEventListener('touchend', stopDragging);
});

onUnmounted(() => {
    window.removeEventListener('resize', updateWidth);
    window.removeEventListener('mousemove', handleMove);
    window.removeEventListener('touchmove', handleMove);
    window.removeEventListener('mouseup', stopDragging);
    window.removeEventListener('touchend', stopDragging);
});
</script>
