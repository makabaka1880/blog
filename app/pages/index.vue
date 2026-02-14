<template>
    <section class="hero">
        <!-- ART LAYER -->
        <DrinkAnimation class="art" />

        <!-- CONTENT LAYER -->
        <div class="content">
            <small id="draggable-hint" class="disp-wide" @click="onHintClick"><- This is draggable</small>

                    <div id="hero-section">
                        <IndexPageHeroSection />
                        <IndexPageLatestPostsSection :articles="recentArticles" />
                        <IndexPageScrollIndicator :hidden="showAuthorSection" />
                    </div>

                    <div ref="authorTrigger" class="section-trigger">
                        <section ref="authorRef" class="author-section" :class="{
                            'scroll-up': showAuthorSection,
                            'strip-active': stripVisible
                        }">
                            <canvas ref="stripCanvas"
                                :class="{ 'strip-canvas': true, 'strip-active': stripVisible }"></canvas>
                            <IndexPageAuthorSection />
                            <IndexPageTechStackSection />
                            <IndexPageScrollIndicator :hidden="showArtSection" />
                            <div ref="artTrigger" class="section-trigger">
                                <section ref="artRef" class="art-section" :class="{ 'scroll-up': showArtSection }">
                                    <IndexPageArtSection />

                                </section>
                            </div>
                        </section>
                    </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue';
import { useScroll, useIntersectionObserver } from '@vueuse/core';
import { useDrinkEvents } from '~/composables/useDrinkEvents';
import { setupStripShader } from '~/utils/indexPage/parallaxLoader';

const recentArticles = ref<any[]>([]);
const showAuthorSection = ref(false);
const showArtSection = ref(false);
const stripCanvas = ref<HTMLCanvasElement | null>(null);
const authorTrigger = ref<HTMLElement | null>(null);
const artTrigger = ref<HTMLElement | null>(null);
const authorRef = ref<HTMLElement | null>(null);
const artRef = ref<HTMLElement | null>(null);

// Use VueUse scroll tracking
const { y } = useScroll(window);
let shaderRender: ((y: number) => void) | undefined = undefined;



// Use drink events
const { emit } = useDrinkEvents();

definePageMeta({
    layout: 'default-unsafe',
})

const stripVisible = computed(() => {
    return showAuthorSection.value && !showArtSection.value
});

onMounted(async () => {
    const result = await queryCollection('articles').select('title', 'description', 'createTime', 'path').order('createTime', 'DESC');
    const allArticles = await result.all();
    recentArticles.value = allArticles.slice(0, 3);
    const canvasRenderer = await setupStripShader(stripCanvas.value!)!;
    shaderRender = canvasRenderer?.render;
    const handleResize = (canvas: HTMLCanvasElement) => {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = canvas.clientWidth * dpr;
        canvas.height = canvas.clientHeight * dpr;
        if (shaderRender) shaderRender(y.value);
    };
    handleResize(stripCanvas.value!);
    const resizeObserver = new ResizeObserver(() => {
        if (stripCanvas.value) handleResize(stripCanvas.value);
    });
    resizeObserver.observe(stripCanvas.value!);
    watch(y, (newY) => {
        if (shaderRender) {
            shaderRender(newY);
        }
    });
});
useIntersectionObserver(
    authorTrigger,
    ([entry]) => {
        if (entry) {
            showAuthorSection.value = entry.isIntersecting;
        }
    },
    { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
);

useIntersectionObserver(
    artTrigger,
    ([entry]) => {
        if (entry) {
            showArtSection.value = entry.isIntersecting;
        }
    },
    { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
);
// const triggerOffset = .4; // 20% of viewport
// watch(y, () => {
//     const vh = window.innerHeight;
//     const threshold = vh * (1 - triggerOffset);

//     if (authorRef.value) {
//         const rect = authorRef.value.getBoundingClientRect();
//         // rect.top is relative to the viewport
//         // If the top of the element is above our threshold line
//         showAuthorSection.value = rect.top < threshold;
//     }

//     if (artRef.value) {
//         const rect = artRef.value.getBoundingClientRect();
//         showArtSection.value = rect.top < threshold;
//     }
// });

function onHintClick() {
    emit('hint-click');
}
</script>

<style lang="scss" scoped>
@use '~/assets/theme' as *;

html,
body {
    scroll-behavior: smooth;
    scroll-snap-type: y mandatory;
    height: 100%;
    margin: 0;
}

/* ROOT */
.hero {
    display: flex;
    align-items: center;
}

#hero-section {
    min-height: 100vh;
}

.hero,
.author-section,
.art-section {
    scroll-snap-align: start;
}

.section-trigger {
    position: relative;
    min-height: 1px;
}

/* ---------------- ART ---------------- */
.art {
    position: fixed;
    left: 0;
    top: 50%;
    width: 45vw;
    opacity: 0.6;
    transform: translateY(-50%);
    pointer-events: none;
    z-index: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    mix-blend-mode: darken;

    :deep(canvas) {
        pointer-events: auto;
    }
}

/* ---------------- CONTENT ---------------- */
.content {
    position: relative;
    z-index: 1;
    width: 50vw;
    margin-left: calc(45vw);
    margin-top: 15vh;
    margin-bottom: 15vh;
}

/* ---------------- AUTHOR SECTION ---------------- */
.author-section {
    position: relative;
    opacity: 0;
    transform: translateY(80%);
    transition: all 0.3s ease-out;
}

/* Canvas strip */
.strip-canvas {
    position: absolute;
    top: -5%;
    left: calc(-45vw);
    width: 100vw;
    height: 40rem;
    pointer-events: none;
    z-index: -1;
    // filter: hue-rotate(#{$base-hue}deg);
    opacity: 0;
    transition: opacity 0.3s ease-out;
}

/* Active text color */
.author-section.strip-active * {
    color: var(--color-background) !important;
}

/* Fade in strip when author section scrolls up */
.strip-canvas.strip-active {
    opacity: 1;
}

/* Author section visible */
.author-section.scroll-up {
    opacity: 1;
    transform: translateY(0);
}

/* ---------------- ART SECTION ---------------- */
.art-section {
    opacity: 0;
    transform: translateY(10%);
    transition: opacity 0.3s ease-out, transform 0.3s ease-out;
}

.art-section.scroll-up {
    opacity: 1;
    transform: translateY(0);
}

/* ---------------- MOBILE ---------------- */
@media (max-width: $critical-width) {
    .hero {
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
    }

    .strip-canvas {
        left: -10vw;
        width: 120vw;
        height: 20rem;
    }

    .art {
        position: fixed;
        inset: 0;
        width: 100%;
        transform: translateY(20vh) translateX(10vw) scale(1.4);
        opacity: 0.1;
        filter: blur(1px);
        z-index: -1;
    }

    .content {
        margin: 10vh 10vw;
        width: auto;
    }

    .strip-canvas {
        top: -10%;
        height: 100%;
        width: 100vw;
        filter: brightness(50%);
    }
}

#draggable-hint {
    cursor: pointer;
}
</style>