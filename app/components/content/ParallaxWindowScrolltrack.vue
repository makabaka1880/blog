<template>
    <div class="image-like">
        <ParallaxWindow :src="props.src" :depth="props.depth" :sensitivity-y="props.sensitivity"
            :sensitivity-x="props.sensitivity" ref="pwindow" :reverse-depth="true" />
    </div>
</template>

<script setup lang="ts">
import { useScroll } from '@vueuse/core';

const props = withDefaults(defineProps<{
    src: string,
    depth: string,
    sensitivity?: number,
    reverse?: boolean,
    angle?: number
}>(), {
    sensitivity: .2,
    reverse: false,
    angle: 0,
});

const { y } = useScroll(window);
const pwindow = ref<any>(null);

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
        pwindow.value.render(Math.sin(props.angle) * newVal, Math.cos(props.angle) * newVal);
    }
});

onUnmounted(() => {
    if (renderInterval !== null) {
        clearInterval(renderInterval);
    }
});
</script>
