<template>
    <div ref="containerRef" class="reveal-container" @mousedown="startDragging" @touchstart="startDragging">
        <div class="layer background-layer">
            <slot name="background"></slot>
        </div>

        <div class="layer foreground-layer" :style="{ width: `${sliderPercent}%` }">
            <div class="content-wrapper" :style="{ width: `${containerWidthRem}rem` }">
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
    overflow: hidden;
    user-select: none;
    -webkit-user-drag: none;

    .layer {
        width: 100%;
        pointer-events: none;

        &.background-layer {
            position: relative;
            // Background layer determines the container's natural height
        }

        &.foreground-layer {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            z-index: 2;
            overflow: hidden;
            border-right: 0.125rem solid white;
        }
    }

    .content-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        // Ensure foreground content matches background layer dimensions exactly
    }

    .slider-handle {
        position: absolute;
        top: 0;
        bottom: 0;
        z-index: 3;
        transform: translateX(-50%);

        .handle-line {
            width: 0.125rem;
            height: 100%;
            background: white;
        }

        .handle-circle {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 2.5rem;
            height: 2.5rem;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.3);
        }
    }
}

/* Ensure the slotted images/content align perfectly */
:deep(img), :deep(video), :deep(canvas) {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top left;
}
</style>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';

const sliderPercent = ref(50);
const isDragging = ref(false);
const containerRef = ref<HTMLElement | null>(null);
const containerWidth = ref(0);
const containerWidthRem = computed(() => {
    if (typeof window === 'undefined') return containerWidth.value / 16;
    const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    return containerWidth.value / rootFontSize;
});

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
