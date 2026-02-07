<template>
    <section class="hero">
        <!-- ART LAYER -->
        <div class="art">
            <video v-if="!videoEnded" ref="videoElement" src="/static/drink-1.mp4" autoplay muted playsinline
                draggable="false" @ended="onVideoEnded" />
            <NuxtImg v-else ref="videoElementLoop" format="gif" src="/assets/drink-loop.gif" draggable="false" preload />
        </div>

        <!-- CONTENT LAYER -->
        <div class="content">
            <GlitchedElement ref="glitched">
                <h1>Hi There 👋</h1>
            </GlitchedElement>

            <p>Welcome To the Teal Blog.</p>

            <h2>The Author</h2>
            <p>
                Im Sean, currently a highschooler. I like software
                engineering, computer science, and formal mathematics. I also enjoy
                music, chess, and 3d art.
            </p>

            <h2>Tech Stack</h2>
            <div class="two-cols">
                <div class="two-rows">
                    <div class="grid">
                        <h3>Frontend</h3>
                        <p>SwiftUI / UIKit / Vue / Nuxt</p>
                    </div>
                    <div class="grid">
                        <h3>Backend</h3>
                        <p>Vapor / Express / PostgreSQL</p>
                    </div>
                </div>

                <div class="two-rows">
                    <div class="grid">
                        <h3>Research</h3>
                        <p>Haskell / Lean / Python / R</p>
                    </div>
                    <div class="grid">
                        <h3>Miscellaneous</h3>
                        <p>Rust / C++ / Elixir</p>
                    </div>
                </div>
            </div>

            <h2>Friends</h2>
        </div>
    </section>
</template>


<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

const videoEnded = ref(false);  // Track whether the first video has ended
const glitched = ref<{ startGlitch: () => void; stopGlitch: () => void } | null>(null);

let glitchTimer: number | undefined;
let glitchOn = false;

const stopGlitching = () => {
    if (glitchTimer) {
        clearTimeout(glitchTimer);
        glitchTimer = undefined;
    }
    if (glitchOn) {
        glitched.value?.stopGlitch();
        glitchOn = false;
    }
};

const scheduleGlitch = () => {
    if (videoEnded.value) return;

    const idleMs = 250 + Math.random() * 700;
    glitchTimer = window.setTimeout(() => {
        if (videoEnded.value) return;
        glitchOn = true;
        glitched.value?.startGlitch();

        const glitchMs = 450 + Math.random() * 900;
        glitchTimer = window.setTimeout(() => {
            if (videoEnded.value) return;
            glitched.value?.stopGlitch();
            glitchOn = false;
            scheduleGlitch();
        }, glitchMs);
    }, idleMs);
};

// Function to handle video ending and switch to the next video
const onVideoEnded = () => {
    videoEnded.value = true;  // Mark the video as ended, so the second video will render
    stopGlitching();
};

onMounted(() => {
    scheduleGlitch();
});

onBeforeUnmount(() => {
    stopGlitching();
});

watch(videoEnded, (ended) => {
    if (ended) {
        stopGlitching();
    }
});
</script>

<style lang="scss" scoped>
@use '~/assets/theme' as *;

/* ROOT */
.hero {
    position: relative;
    min-height: 100vh;
}

/* ---------------- ART ---------------- */
/* 🚫 NOT in layout, 🚫 NOT flex child */
.art {
    position: fixed;
    left: 0;
    top: 50%;
    width: 45vw;

    transform: translateY(-50%);
    pointer-events: none;
    z-index: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    mix-blend-mode: darken;

    video,
    img {
        width: 100%;
        height: auto;
    }
}

/* ---------------- CONTENT ---------------- */
.content {
    position: relative;
    z-index: 1;

    max-width: 65ch;
    min-width: 55ch;
    margin-left: calc(75vw - 40em);
    padding: 4rem 4rem 8rem;
}

/* ---------------- GRID ---------------- */
.two-cols {
    display: flex;
    gap: 5rem;
}

/* ---------------- MOBILE ---------------- */
@media (max-width: $critical-width) {
    .art {
        position: absolute;
        inset: 0;
        width: 100%;
        transform: translateY(10vh) scale(1.4);
        opacity: 0.6;
    }

    .content {
        margin-left: 0;
        padding: 2rem;
    }
}
</style>
