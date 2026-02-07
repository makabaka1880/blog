<template>
    <div class="audio-player-container box-container">
        <em>{{ displayTitle }}</em>
        <div class="audio-player">
            <button
                class="play-pause-toggle"
                type="button"
                :aria-pressed="isPlaying"
                :aria-label="isPlaying ? 'Pause' : 'Play'"
                @click="togglePlay"
            >
                <SvgIcon v-if="isPlaying" class="icon" name="pause" />
                <SvgIcon v-else class="icon" name="play" />
            </button>

            <input type="range" min="0" :max="duration" step="0.01" v-model="currentTime" @input="seek" />

            <span class="time">
                {{ format(currentTime) }} / {{ format(duration) }}
            </span>

            <div class="volume-wrapper">
                <button class="volume-button" type="button" aria-label="Volume">
                    <SvgIcon class="volume-icon" name="volume" />
                </button>
                <div class="volume-popover">
                    <input class="volume-range" type="range" min="0" max="1" step="0.01" v-model="volume"
                        @input="setVolume" />
                </div>
            </div>

            <audio ref="audio" :src="src" preload="metadata" @timeupdate="updateTime" @play="isPlaying = true"
                @pause="isPlaying = false" @ended="isPlaying = false" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

const props = defineProps<{
    src: string;
    title?: string;
}>();

const audio = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(1);
const displayTitle = computed(() => {
    const explicit = props.title?.trim();
    if (explicit) return explicit;
    const file = props.src.split("/").pop() ?? "";
    const decoded = decodeURIComponent(file);
    return decoded.replace(/\.[^.]+$/, "");
});

const togglePlay = () => {
    if (!audio.value) return;
    audio.value.paused ? audio.value.play() : audio.value.pause();
};

const updateTime = () => {
    if (!audio.value) return;
    currentTime.value = audio.value.currentTime;
};

const seek = () => {
    if (!audio.value) return;
    audio.value.currentTime = currentTime.value;
};

const setVolume = () => {
    if (!audio.value) return;
    audio.value.volume = volume.value;
};

onMounted(() => {
    if (!audio.value) return;
    duration.value = audio.value.duration;
    audio.value.volume = volume.value;
});

watch(volume, () => setVolume());

const format = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
};
</script>

<style lang="scss" scoped>
.audio-player-container {
    padding: 1.5em 1em;
    border: 1.2pt var(--color-border) solid;
    box-shadow: 1px 1px 2px;
    border-radius: 0.5rem;
    margin-bottom: 2rem;

    .audio-player {
        display: flex;
        align-items: center;
        gap: 0.75em;
        margin-top: 1rem;
    }
}

.play-pause-toggle {
    appearance: none;
    border: none;
    background: none;
    padding: 0;
    cursor: pointer;
    color: var(--color-primary, #3d4888);
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.icon {
    display: block;
    width: 1.25rem;
    height: 1.25rem;
}

input[type="range"] {
    flex: 1;
    accent-color: var(--color-accent);
}

.time {
    font-family: monospace;
    font-size: 0.8em;
    opacity: 0.7;
    white-space: nowrap
}

.volume-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
}

.volume-button {
    appearance: none;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0.15rem;
    color: var(--color-accent);
}

.volume-icon {
    display: block;
    width: 1.25rem;
    height: 1.25rem;
}

.volume-popover {
    position: absolute;
    right: 0;
    bottom: 120%;
    padding: 0.4rem 0.6rem;
    background: var(--color-bg);
    border: 1pt var(--color-border) solid;
    border-radius: 0.5rem;
    opacity: 0;
    transform: translateY(6px);
    pointer-events: none;
    transition: opacity 120ms ease, transform 120ms ease;
}

.volume-wrapper:hover .volume-popover,
.volume-wrapper:focus-within .volume-popover {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
}

.volume-range {
    width: 6rem;
    accent-color: var(--color-accent);
}
</style>
