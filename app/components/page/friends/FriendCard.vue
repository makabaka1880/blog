<template>
    <div class="friendscard">
        <img :src="avater" class="friendscard-avatar" />
        <div class="friendscard-title">
            <strong class="friendscard-title1">{{ name }}</strong>
            <p class="friendscard-titlesub">{{ description }}</p>
        </div>

        <NuxtLink :to="site" class="friendscard-overlay">
            <div class="text-stack">
                <span class="overlay-sub">Continue to</span>
                <span class="overlay-main">{{ sitename }} <span class="arrow">→</span></span>
            </div>
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">
import { objectEntries } from '@vueuse/core';

const props = defineProps<{
    name: string
    avater: string
    sitename: string
    description: string
    site: string
}>();
</script>

<style lang="scss" scoped>
.friendscard {
    position: relative; // Establishes a bounding box for the absolute overlay
    overflow: hidden; // Keeps the overlay matching the card's border radius
    display: flex;
    align-items: center;
    padding: 1rem;
    background-color: var(--color-card-background);
    border-radius: var(--border-radius-box);
    border: 1px var(--color-card-border) solid;
    cursor: pointer; // Indicates the whole card is clickable

    img {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        margin-right: 1rem;
    }

    // Hover state overlay styles
    .friendscard-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        text-decoration: none;

        // Flexbox centering for the overlay text stack
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-left: 4rem;
        align-items: left;

        .text-stack {
            display: flex;
            flex-direction: column;
            align-items: left;

        }

        // Visual effects from Frame 2
        background-color: var(--color-shadow);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);

        opacity: 0;
        transition: opacity 0.3s ease;

        .overlay-sub {
            font-size: 0.8rem;
            color: var(--color-text);

            *:hover {
            }

            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 0.25rem;
        }

        .overlay-main {
            font-size: 1.2rem;
            font-weight: bold;
            letter-spacing: 0.1em;

            .arrow {
                display: inline-block;
                transition: transform 0.2s ease;
            }
        }
    }

    // Activate the overlay on hover
    &:hover {
        .friendscard-overlay {
            opacity: 1;

            color: var(--color-text);

            // Optional subtle micro-interaction: nudge the arrow on hover
            .arrow {
                transform: translateX(4px);
            }
        }
    }
}
</style>