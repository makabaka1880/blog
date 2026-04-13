<template>
    <BaseBox background-char='👀' :box-type="'spoiler'" :box-class="`spoiler-box`">
        <template #header>
            SPOILER
        </template>
        <div class="spoiler-content-wrapper">
            <div class="spoiler-blurred" :class="{ 'revealed': isRevealed }">
                <slot />
            </div>
            <button v-if="!isRevealed" class="spoiler-reveal-button" @click="revealSpoiler">
                REVEAL SPOILER
            </button>
            <button v-else class="spoiler-hide-button" @click="hideSpoiler">
                HIDE SPOILER
            </button>
        </div>
    </BaseBox>
</template>

<script lang="ts" setup>
import BaseBox from './BaseBox.vue'
import { ref } from 'vue'

const isRevealed = ref(false)

const revealSpoiler = () => {
    isRevealed.value = true
}

const hideSpoiler = () => {
    isRevealed.value = false
}
</script>

<style lang="scss" scoped>
.spoiler-box {
    background-color: var(--color-spoiler-background);
    border-color: var(--color-spoiler-border);
    --box-header-color: var(--color-spoiler-text);
    --box-bg-char-color: var(--color-spoiler-overlay);
    --box-bg-char-opacity: 0.15;
}

.spoiler-content-wrapper {
    position: relative;
    width: 100%;
}

.spoiler-blurred {
    filter: blur(8px);
    transition: filter 0.3s ease;
    pointer-events: none;
    user-select: none;

    &.revealed {
        filter: blur(0);
        pointer-events: auto;
        user-select: auto;
    }
}

.spoiler-reveal-button,
.spoiler-hide-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;

    padding: 0.75rem 1.5rem;
    border: 2px solid var(--color-spoiler-border);
    border-radius: var(--border-radius-button);
    background-color: var(--color-spoiler-background);
    color: var(--color-spoiler-text);
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    font-size: var(--font-size-sm);
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background-color: var(--color-spoiler-text);
        color: var(--color-spoiler-background);
        border-color: var(--color-spoiler-text);
    }

    &:active {
        transform: translate(-50%, -50%) scale(0.98);
    }
}

.spoiler-hide-button {
    position: relative;
    top: auto;
    left: auto;
    transform: none;
    margin-top: 1rem;
    display: block;
    margin-left: auto;
    margin-right: auto;

    &:active {
        transform: scale(0.98);
    }
}
</style>