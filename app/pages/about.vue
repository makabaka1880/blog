<template>
    <div class="mask-container">
        <div class="tv">
            <video v-if="!videoEnded" ref="videoElement" src="/static/drink-1.mp4" @ended="onVideoEnded" autoplay muted
                playsinline class="mask-video tv" style="mix-blend-mode: multiply" draggable="false" />

            <img v-else ref="videoElementLoop" src="/static/drink-loop.gif" class="mask-video tv"
                style="mix-blend-mode: multiply" draggable="false" />
        </div>
        <div class="title">
            <h1>Hi There 👋</h1>
            <p>Welcome To the Teal Blog.</p>
            <h2>The Author</h2>
            <p>Im Sean, currently a Shanghainese highschooler. I like software engineering, computer science, and formal
                mathematics. I also enjoy music, chess, and 3d art.</p>
            <br />
            <h2>Tech Stack</h2>
            <div class="two-cols">
                <div class="two-rows">
                    <div class="grid">
                        <h3>Frontend</h3>
                        <p>SwiftUI / UIKit / Vue / Nuxt</p>
                    </div>
                    <div class="grid">
                        <h3>Backend</h3>
                        <p>Vapor / Express / PostgresSQL </p>
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
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const videoEnded = ref(false);  // Track whether the first video has ended

// Function to handle video ending and switch to the next video
const onVideoEnded = () => {
    videoEnded.value = true;  // Mark the video as ended, so the second video will render
};
</script>

<style scoped>
.mask-container {
    display: flex;
}

.two-cols {
    display: flex;

    :deep(.grid) {
        margin-right: 5rem;
    }
}

:deep(.tv) {
    filter: brightness(1.01);
    mix-blend-mode: multiply;
    max-width: 45vw;
}
</style>