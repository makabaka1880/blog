<template>
    <div class="image-like">
        <ParallaxWindow :albedo="derivedAlbedo" :depth="derivedDepth" :alt="props.alt" :sensitivity-y="props.sensitivity"
            :sensitivity-x="props.sensitivity" ref="pwindow" :reverse-depth="true" :view-height="props.viewHeight" />
    </div>
</template>

<script setup lang="ts">
import { useScroll } from '@vueuse/core';

const props = withDefaults(defineProps<{
    albedo?: string,
    depth?: string,
    src?: string,
    alt?: string,
    sensitivity?: number,
    reverse?: boolean,
    angle?: number,
    offset?: number,
    scale?: number,
    viewHeight?: number
}>(), {
    albedo: undefined,
    depth: undefined,
    src: undefined,
    alt: "",
    sensitivity: .2,
    reverse: false,
    angle: 0,
    offset: 0,
    scale: 1,
    viewHeight: 1
});

// Derive albedo and depth from src if provided
const derivedAlbedo = computed(() => {
    if (props.src) {
        const ext = props.src.match(/\.[^.]+$/)?.[0] || '';
        return props.src.replace(ext, `-albedo${ext}`);
    }
    return props.albedo;
});

const derivedDepth = computed(() => {
    if (props.src) {
        const ext = props.src.match(/\.[^.]+$/)?.[0] || '';
        return props.src.replace(ext, `-depth${ext}`);
    }
    return props.depth;
});

const { y } = useScroll(window);
const pwindow = ref<{ render: (x: number, y: number) => void } | null>(null);

const progress = computed(() => {
    // Access y to create reactive dependency
    const scrollY = y.value;
    const el = pwindow.value?.$el;
    if (!el) return -1; // default if not rendered yet

    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const h = rect.height;

    if (rect.bottom <= 0) return -1;       // fully passed
    if (rect.top >= vh) return 1;        // not yet entered

    // element is partially visible
    let p = ((vh - rect.top) / (vh + h)) * 2 - 1;
    return Math.max(-1, Math.min(1, -p));
});

let renderInterval: number | null = null;

watch(progress, (newVal) => {
    if (pwindow.value && pwindow.value.render) {
        const adjustedValue = props.scale * newVal + props.offset;
        pwindow.value.render(Math.sin(props.angle) * adjustedValue, Math.cos(props.angle) * adjustedValue);
    }
});

onUnmounted(() => {
    if (renderInterval !== null) {
        clearInterval(renderInterval);
    }
});
</script>
