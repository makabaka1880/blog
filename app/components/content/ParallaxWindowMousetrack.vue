<template>
    <div ref="elementRef" class="image-like">
        <ParallaxWindow :albedo="derivedAlbedo" :depth="derivedDepth" :alt="props.alt" :sensitivity-x="props.sensitivityX"
            :sensitivity-y="props.sensitivityY" ref="pwindow" :reverse-depth="props.reverse" :view-height="props.viewHeight"
            :offset-x="props.offsetX" :offset-y="props.offsetY" />
        <div v-if="!hasMouse && props.showWarning" class="no-mouse-overlay" @click="isWarningVisible = !isWarningVisible">
            <Icon name="uil:exclamation-triangle" size="1.2em" />
        </div>
        <WarningTag v-if="!hasMouse && isWarningVisible" class="feature-tag" :collapsible="false"
            msg="Your device does not support mouse interactions. Parallax effect may not work." />
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useElementMouse } from '~/utils/useElementMouse';
import WarningTag from '~/components/ui/kit/WarningTag.vue';

const props = withDefaults(defineProps<{
    albedo?: string,
    depth?: string,
    src?: string,
    alt?: string,
    sensitivityX?: number,
    sensitivityY?: number,
    reverse?: boolean,
    showWarning?: boolean,
    viewHeight?: number,
    offsetX?: number,
    offsetY?: number,
    scaleX?: number,
    scaleY?: number
}>(), {
    albedo: undefined,
    depth: undefined,
    src: undefined,
    alt: "",
    reverse: true,
    sensitivityX: 0.04,
    sensitivityY: 0.04,
    showWarning: true,
    viewHeight: 1,
    offsetX: 0,
    offsetY: 0,
    scaleX: 1,
    scaleY: 1
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

const pwindow = ref<{ render: (x: number, y: number) => void } | null>(null);
const elementRef = ref<HTMLElement | null>(null);
const isWarningVisible = ref(false);

// Detect if device supports mouse hover interactions
const hasMouse = ref(true);

// Track if element is in viewport
const isInViewport = ref(true);
let intersectionObserver: IntersectionObserver | null = null;

onMounted(() => {
    hasMouse.value = window.matchMedia('(hover: hover)').matches;
    console.log(hasMouse)

    // Setup Intersection Observer to track viewport visibility
    if (elementRef.value && 'IntersectionObserver' in window) {
        intersectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    isInViewport.value = entry.isIntersecting;
                });
            },
            { threshold: 0 }
        );
        intersectionObserver.observe(elementRef.value);
    }
});

onUnmounted(() => {
    if (intersectionObserver) {
        intersectionObserver.disconnect();
    }
});

const { mouseX, mouseY } = useElementMouse(elementRef);

// Linear interpolation function
function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

watch([mouseX, mouseY, isInViewport], ([newX, newY, inViewport]) => {
    if (pwindow.value && pwindow.value.render) {
        // Center the mouse when not in viewport
        if (!inViewport) {
            pwindow.value.render(0, 0);
            return;
        }

        // Normalize mouse values from [0, 1] to [-1, 1] using lerp
        const normalizedX = lerp(-1, 1, newX);
        const normalizedY = lerp(-1, 1, newY);
        pwindow.value.render(normalizedX, normalizedY);
    }
});
</script>

<style lang="scss" scoped>
.image-like {
    position: relative;
    display: flex;
    flex-direction: column;

}

.no-mouse-overlay {
    position: absolute;
    top: 0.5rem;
    left: 12%;
    padding: 0.4rem;
    color: var(--color-warning-text);
    display: flex;
    align-items: center;
    cursor: pointer;
    z-index: 99;
}

.feature-tag {
    /* Change from margin-top to absolute positioning */
    position: absolute;
    top: 3.5rem;
    /* Sit it just below the icon */
    left: 12%;
    z-index: 100;
    /* Higher than the icon overlay */
    max-width: 80%;
    background-color: var(--color-warning-bg);
}
</style>
