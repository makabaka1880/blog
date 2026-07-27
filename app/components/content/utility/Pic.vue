<template>
    <span class="prose-img-container image-like">
        <span class="image-click-target" @click="open">
            <img :src="resolvedSrc" :alt="alt" class="image-like-content" />
        </span>
        <div v-if="alt" class="prose-img-caption">
            <strong>Fig.</strong>
            <span class="caption-text">{{ alt }}</span>
        </div>
        <Teleport to="body">
            <div
                v-if="showLightbox"
                class="pic-lightbox-overlay"
                @click="close"
                @wheel.prevent="onWheel"
                @mousemove="onPanMove"
                @mouseup="onPanEnd"
                @mouseleave="onPanEnd"
            >
                <div class="pic-lightbox-toolbar" @click.stop>
                    <button @click="zoomOut">&minus;</button>
                    <span class="zoom-label">{{ Math.round(scale * 100) }}%</span>
                    <button @click="zoomIn">+</button>
                    <button @click="resetZoom">&#x21BA;</button>
                    <button @click="close" class="btn-close">&times;</button>
                </div>
                <div class="pic-lightbox-stage" @click.stop @mousedown="onPanStart">
                    <img
                        :src="resolvedSrc"
                        :alt="alt"
                        class="pic-lightbox-image"
                        :class="{ 'is-panning': isPanning }"
                        :style="imageStyle"
                        draggable="false"
                    />
                </div>
            </div>
        </Teleport>
    </span>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from '#app';
import { resolveAssetSrc } from '~/utils/route-utils';

const props = defineProps({
    src: { type: String, required: true },
    alt: { type: String, default: "" },
    absolute: { type: Boolean, default: false },
});

const route = useRoute();
const resolvedSrc = computed(() => resolveAssetSrc(props.src, route.path, props.absolute));

const showLightbox = ref(false);
const scale = ref(1);
const offsetX = ref(0);
const offsetY = ref(0);
const isPanning = ref(false);
const panStart = ref({ x: 0, y: 0 });
const panOrigin = ref({ x: 0, y: 0 });

const imageStyle = computed(() => ({
    transform: `translate(${offsetX.value}px, ${offsetY.value}px) scale(${scale.value})`,
}));

function open() {
    scale.value = 1;
    offsetX.value = 0;
    offsetY.value = 0;
    showLightbox.value = true;
}

function close() {
    showLightbox.value = false;
}

function zoomIn() {
    scale.value = Math.min(scale.value * 1.5, 10);
}

function zoomOut() {
    scale.value = Math.max(scale.value / 1.5, 0.1);
}

function resetZoom() {
    scale.value = 1;
    offsetX.value = 0;
    offsetY.value = 0;
}

function onWheel(e: WheelEvent) {
    const overlay = e.currentTarget as HTMLElement;
    const rect = overlay.getBoundingClientRect();
    const cx = e.clientX - rect.left - rect.width / 2;
    const cy = e.clientY - rect.top - rect.height / 2;

    const prev = scale.value;
    const delta = e.deltaY < 0 ? 1.1 : 0.9;
    scale.value = Math.max(0.1, Math.min(10, scale.value * delta));

    const ratio = scale.value / prev;
    offsetX.value = offsetX.value * ratio - cx * (ratio - 1);
    offsetY.value = offsetY.value * ratio - cy * (ratio - 1);
}

function onPanStart(e: MouseEvent) {
    if (scale.value <= 1) return;
    isPanning.value = true;
    panStart.value = { x: e.clientX, y: e.clientY };
    panOrigin.value = { x: offsetX.value, y: offsetY.value };
}

function onPanMove(e: MouseEvent) {
    if (!isPanning.value) return;
    offsetX.value = panOrigin.value.x + (e.clientX - panStart.value.x);
    offsetY.value = panOrigin.value.y + (e.clientY - panStart.value.y);
}

function onPanEnd() {
    isPanning.value = false;
}
</script>

<style lang="scss" scoped>
.prose-img-container {
    margin: 2rem auto;
    display: flex;
    flex-direction: column;
    align-items: center;

    .prose-img-caption {
        margin-top: 0.5rem;
        display: block;
        width: 80%;
        text-align: center;

        span {
            margin-left: 0.25rem;
        }
    }
}

.image-click-target {
    display: block;
    width: 80%;
    cursor: pointer;
}

.image-like-content {
    display: block;
    width: 100%;
    max-height: 80vh;
    object-fit: contain;
    border-radius: var(--border-radius-image);
    height: auto;
}
</style>

<style lang="scss">
.pic-lightbox-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.88);
}

.pic-lightbox-toolbar {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 10001;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    button {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 0.5rem;
        border: 1px solid rgba(255, 255, 255, 0.25);
        background: rgba(255, 255, 255, 0.08);
        color: #fff;
        font-size: 1.25rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(6px);
        line-height: 1;

        &:hover {
            background: rgba(255, 255, 255, 0.2);
        }
    }

    .btn-close {
        margin-left: 0.5rem;
        border-color: rgba(255, 255, 255, 0.35);
    }

    .zoom-label {
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.8rem;
        font-family: 'JetBrains Mono', monospace;
        min-width: 3rem;
        text-align: center;
    }
}

.pic-lightbox-stage {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 90vw;
    max-height: 90vh;
    overflow: visible;
}

.pic-lightbox-image {
    display: block;
    max-width: 100%;
    max-height: 90vh;
    width: auto;
    height: auto;
    cursor: grab;
    user-select: none;

    &.is-panning {
        cursor: grabbing;
    }
}
</style>
