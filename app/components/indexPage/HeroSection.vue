<template>
    <div class="hero-section">
        <div class="title-div">
            <div class="title-col">
                <h2>Hi There 👋</h2>
                <GlitchedElement ref="glitched">
                    <h1>{{ blogConfig.title }}</h1>
                </GlitchedElement>
            </div>
            <span> #{{ displayHex }}</span>
        </div>
        <p>Welcome To the Teal Blog.</p>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import * as THREE from 'three';
import blogConfig from '~~/blog.config';

const displayHex = ref("000000");
const glitched = ref<any>(null); // ref to control glitch

const animateHex = (startValue: number, endValue: number, duration: number, onComplete?: () => void) => {
    const startTime = performance.now();

    const update = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const ease = 1 - Math.pow(1 - progress, 20);
        const currentNumeric = Math.floor(startValue + (endValue - startValue) * ease);
        displayHex.value = currentNumeric.toString(16).padStart(6, '0').toUpperCase();

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            // Animation finished
            onComplete?.();
        }
    };

    requestAnimationFrame(update);
};

onMounted(() => {
    const root = document.documentElement;
    const primaryColor = getComputedStyle(root).getPropertyValue('--color-primary').trim();

    if (primaryColor) {
        const color = new THREE.Color(primaryColor);
        const targetHex = color.getHex();

        // Start glitch
        glitched.value?.startGlitch?.();

        // Animate hex and stop glitch when done
        animateHex(0, targetHex, 2000, () => {
            glitched.value?.stopGlitch?.();
        });
    }
});
</script>

<style lang="scss" scoped>
@use "~/assets/theme.scss" as *;

.title-div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    p {
        margin-bottom: 1.5rem;
    }

    .title-col {

        h1 {
            margin-top: 0;
            margin-bottom: 2rem;
        }


    }

    span {
        font-family: monospace;
        font-size: 1.5rem;
        margin-left: 0.5rem;
    }
}

@media (max-width: $critical-width) {
    .title-div {
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        text-align: left;

        span {
            margin-left: 0;
            margin-top: 0.5rem;
        }
    }
}
</style>