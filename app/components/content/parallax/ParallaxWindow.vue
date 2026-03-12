<template>
    <span ref="rootElement" class="prose-img-container image-like">
        <WebglCanvas v-if="!prefersReducedMotion" ref="webglCanvasRef" class="image-like-content" :width="512"
            :height="512" :fragment-source="shaderSource" :uniforms="uniforms" :auto-render="false" />
        <img v-else class="image-like-content" :src="fallbackImageSrc" :alt="alt" />
        <div v-if="alt" class="prose-img-caption">
            <strong>Fig.</strong>
            <span class="caption-text">{{ alt }}</span>
        </div>
    </span>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import WebglCanvas from '~/components/content/utility/WebglCanvas.vue';
import { resolveAssetSrc } from '~/utils/route-utils';

const props = withDefaults(defineProps<{
    albedo: string,
    depth: string,
    src?: string,
    alt?: string,
    offsetX?: number,
    offsetY?: number,
    sensitivityX?: number,
    sensitivityY?: number,
    viewHeight?: number
}>(), {
    alt: "",
    offsetX: 0,
    offsetY: 0,
    sensitivityX: 0.004,
    sensitivityY: 0.004,
    viewHeight: 1
});

const route = useRoute();

// Resolve asset path: if starts with /, use as-is; otherwise pass through resolveAssetSrc
const resolvePath = (path: string): string => {
    if (path.startsWith('/')) return path;
    return resolveAssetSrc(path, route.path);
};

// Derive albedo and depth from src if provided
const derivedAlbedo = computed(() => {
    if (props.src) {
        const resolvedSrc = resolvePath(props.src);
        const ext = resolvedSrc.match(/\.[^.]+$/)?.[0] || '';
        return resolvedSrc.replace(ext, `-albedo${ext}`);
    }
    return resolvePath(props.albedo);
});

const derivedDepth = computed(() => {
    if (props.src) {
        const resolvedSrc = resolvePath(props.src);
        const ext = resolvedSrc.match(/\.[^.]+$/)?.[0] || '';
        return resolvedSrc.replace(ext, `-depth${ext}`);
    }
    return resolvePath(props.depth);
});

// Fallback image source (use albedo when reduced motion is enabled)
const fallbackImageSrc = computed(() => props.src ? resolvePath(props.src) : derivedAlbedo.value);

const webglCanvasRef = ref<InstanceType<typeof WebglCanvas> | null>(null);
const rootElement = ref<HTMLElement | null>(null);
const imageAspectRatio = ref<number | null>(null);
const prefersReducedMotion = ref(false);
let resizeObserver: ResizeObserver | null = null;
let resizeRaf = 0;
let lastCanvasSize = { width: 0, height: 0 };

// Shader source URL
const shaderSource = '/assets/shaders/parallax-component.glsl';

// Uniforms for the parallax effect
const uniforms = computed(() => ({
    u_texture: { tag: 'sampler2D', src: derivedAlbedo.value },
    u_depth: { tag: 'sampler2D', src: derivedDepth.value },
    u_resolution: { tag: 'vec2', x: 512, y: 512 }, // Default canvas size
    u_offset: { tag: 'vec2', x: currentOffsetX.value, y: currentOffsetY.value },
    u_sensitivity: { tag: 'vec2', x: props.sensitivityX, y: props.sensitivityY },
    u_viewHeight: { tag: 'float', value: props.viewHeight }
}));

onMounted(async () => {
    // Check for prefers-reduced-motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.value = mediaQuery.matches;

    if (!prefersReducedMotion.value) {
        // Load the albedo image to get aspect ratio and dimensions
        const img = new Image();
        img.onload = () => {
            imageAspectRatio.value = img.width / img.height;

            // Set up resize observer to handle canvas size changes
            // We'll need to find the canvas element created by WebGLCanvas
            const canvas = document.querySelector('canvas'); // Find the canvas created by WebGLCanvas
            if (canvas) {
                resizeObserver = new ResizeObserver(() => {
                    if (resizeRaf) cancelAnimationFrame(resizeRaf);
                    resizeRaf = requestAnimationFrame(() => {
                        resizeRaf = 0;
                        const width = canvas.clientWidth;
                        const height = canvas.clientHeight;
                        if (width === lastCanvasSize.width && height === lastCanvasSize.height) return;
                        lastCanvasSize = { width, height };
                        // In this implementation, we'd need to pass updated uniforms 
                        // to the webgl canvas when dimensions change
                    });
                });
                resizeObserver.observe(canvas);
            }
        };
        img.src = derivedAlbedo.value;
    } else {
        // Set aspect ratio from fallback image when reduced motion is enabled
        const img = new Image();
        img.onload = () => {
            imageAspectRatio.value = img.width / img.height;
        };
        img.src = fallbackImageSrc.value;
    }
});

onBeforeUnmount(() => {
    if (resizeRaf) cancelAnimationFrame(resizeRaf);
    resizeRaf = 0;
    resizeObserver?.disconnect();
    resizeObserver = null;
});

// Define reactive refs to track the offset values
const currentOffsetX = ref(props.offsetX);
const currentOffsetY = ref(props.offsetY);

// Helper function to draw with current uniforms
const drawWithUniforms = () => {
    if (webglCanvasRef.value && webglCanvasRef.value.draw) {
        webglCanvasRef.value.draw(uniforms.value);
    }
};

// Watch for changes in uniforms and redraw when they change
watch(uniforms, () => {
    drawWithUniforms();
}, { deep: true });

// Define a render function that updates the offset values and redraws
const render = (offsetX: number = 0, y: number = 0) => {
    // Update the reactive offset values
    currentOffsetX.value = offsetX;
    currentOffsetY.value = y;

    // Redraw with the updated uniforms
    drawWithUniforms();
};

// Define a method to get the actual DOM eleent
const getDOMElement = (): HTMLElement | null => {
    // If user prefers reduced motion, we use an img element
    if (prefersReducedMotion.value && rootElement.value) {
        // Find the img element within this component
        const imgElement = rootElement.value.querySelector('img') as HTMLElement;
        return imgElement || rootElement.value;
    }

    // Otherwise, return the WebGL canvas element
    return webglCanvasRef.value?.canvas_ref?.value || rootElement.value || null;
};

defineExpose({
    render,
    getDOMElement
});
</script>

<style lang="scss" scoped>
@use '~/assets/theme.scss' as *;

.prose-img-container {
    margin: var(--margin-image-block) auto;
    display: flex;
    flex-direction: column;
    align-items: center;

    .prose-img-caption {
        margin-top: 0.5rem;
        display: block;
        width: max-content;
        text-align: center;

        span {
            margin-left: 0.25rem;
        }
    }
}

canvas,
img {
    aspect-ratio: v-bind(imageAspectRatio);
}

.image-like-content {
    display: block;
    width: 80%;
    margin: 0 auto;
    border-radius: var(--border-radius-image);
}

@media (max-width: $critical-width) {
    .image-like-content {
        width: 100%;
    }
}
</style>
