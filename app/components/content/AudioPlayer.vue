<template>
    <div class="audio-player-container box-container">
        <em>{{ displayTitle }}</em>
        <div class="audio-player">
            <PlayPauseToggleButton v-model="isPlaying" @toggle="togglePlay" />

            <input type="range" min="0" :max="duration" step="0.01" v-model="currentTime" @input="seek" />

            <span class="time">
                {{ format(currentTime) }} / {{ format(duration) }}
            </span>

            <div class="volume-wrapper">
                <button class="volume-button" type="button" aria-label="Volume">
                    <svg
                        class="volume-icon"
                        viewBox="0 0 119 84"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <g transform="translate(0.904297, 0.560938)" fill="currentColor" fill-rule="nonzero">
                            <path
                                d="M43.8969124,77.0764403 C45.6870347,77.0764403 47.1788033,76.4732469 48.3722182,75.2668602 C49.5656331,74.0604734 50.1623405,72.5751907 50.1623405,70.8110122 L50.1623405,11.853723 C50.1623405,10.0636007 49.5656331,8.55237421 48.3722182,7.32004364 C47.1788033,6.08771306 45.6740628,5.47154777 43.8579967,5.47154777 C42.7164694,5.47154777 41.6527736,5.71152793 40.6669091,6.19148826 C39.6810446,6.6714486 38.591405,7.4821924 37.3979901,8.62371967 L21.714962,23.2171081 C21.4814678,23.4246585 21.2220298,23.5284337 20.9366479,23.5284337 L10.1180826,23.5284337 C6.87510744,23.5284337 4.37801653,24.4364668 2.62680992,26.2525329 C0.875603306,28.068599 0,30.6759511 0,34.0745891 L0,48.473399 C0,51.8979808 0.875603306,54.5183048 2.62680992,56.3343709 C4.37801653,58.150437 6.87510744,59.0584701 10.1180826,59.0584701 L20.9366479,59.0584701 C21.2479736,59.0584701 21.4944397,59.1363015 21.6760463,59.2919643 L37.3979901,74.0410155 C38.5135736,75.1047114 39.5772694,75.8765395 40.5890777,76.3564998 C41.600886,76.8364602 42.7034975,77.0764403 43.8969124,77.0764403 Z M63.9384992,59.9146155 C65.1059702,60.6150982 66.318843,60.8485924 67.5771174,60.6150982 C68.8353917,60.381604 69.8277421,59.7459808 70.5541686,58.7082288 C72.2664595,56.3732866 73.6025653,53.6945891 74.562486,50.6721362 C75.5224066,47.6496833 76.0023669,44.5039974 76.0023669,41.2350783 C76.0023669,37.9402155 75.5224066,34.7815577 74.562486,31.7591048 C73.6025653,28.7366519 72.2664595,26.0449825 70.5541686,23.6840965 C69.8277421,22.6722883 68.8353917,22.0431511 67.5771174,21.796685 C66.318843,21.5502188 65.1059702,21.790199 63.9384992,22.5166255 C62.6931967,23.2949395 61.9602843,24.3910651 61.739762,25.8050023 C61.5192397,27.2189395 61.9278545,28.7690817 62.9656066,30.4554288 C63.9255273,31.9342255 64.6714116,33.6011147 65.2032595,35.4560965 C65.7351074,37.3110783 66.0010314,39.2374056 66.0010314,41.2350783 C66.0010314,43.2327511 65.7351074,45.1525924 65.2032595,46.9946023 C64.6714116,48.8366122 63.9255273,50.4970155 62.9656066,51.9758122 C61.9278545,53.6881031 61.5192397,55.2447312 61.739762,56.6456965 C61.9602843,58.0466618 62.6931967,59.1363015 63.9384992,59.9146155 Z M81.8397223,70.8888436 C83.0331372,71.5633825 84.2784397,71.7709329 85.5756298,71.5114949 C86.8728198,71.2520569 87.8976,70.5256304 88.6499702,69.3322155 C91.296238,65.4147015 93.3328264,61.0431709 94.7597355,56.2176238 C96.1866446,51.3920767 96.9000992,46.3978949 96.9000992,41.2350783 C96.9000992,36.046318 96.1866446,31.0326783 94.7597355,26.1941593 C93.3328264,21.3556403 91.296238,17.0035676 88.6499702,13.1379412 C87.8976,11.9445263 86.8728198,11.2116139 85.5756298,10.939204 C84.2784397,10.666794 83.0331372,10.8808304 81.8397223,11.5813131 C80.5425322,12.3596271 79.7966479,13.4687246 79.6020694,14.9086056 C79.4074909,16.3484866 79.7642182,17.7818817 80.6722512,19.2087907 C82.6439802,22.2961031 84.1746645,25.7271709 85.2643041,29.501994 C86.3539438,33.2768172 86.8987636,37.1878453 86.8987636,41.2350783 C86.8987636,45.2823114 86.3539438,49.1868536 85.2643041,52.9487048 C84.1746645,56.710556 82.6439802,60.1351379 80.6722512,63.2224502 C79.790162,64.6753031 79.4399207,66.1216701 79.6215273,67.5615511 C79.8031339,69.0014321 80.5425322,70.1105296 81.8397223,70.8888436 Z M99.663114,81.8630717 C100.856529,82.5894982 102.121289,82.7905626 103.457395,82.4662651 C104.793501,82.1419676 105.837739,81.3701395 106.590109,80.1507808 C108.925051,76.4408172 110.922724,72.5103312 112.583127,68.359323 C114.243531,64.2083147 115.514777,59.8692139 116.396866,55.3420205 C117.278955,50.8148271 117.72,46.1384569 117.72,41.3129098 C117.72,36.4873626 117.272469,31.8109924 116.377408,27.283799 C115.482347,22.7566056 114.204615,18.4175048 112.544212,14.2664965 C110.883808,10.1154883 108.899107,6.18500231 106.590109,2.47503868 C105.837739,1.2297362 104.793501,0.451422149 103.457395,0.140096529 C102.121289,-0.171229091 100.856529,0.0363213223 99.663114,0.762747769 C98.3918678,1.51511802 97.6524694,2.59827174 97.444919,4.01220893 C97.2373686,5.42614612 97.5616661,6.84656926 98.4178116,8.27347835 C100.337653,11.4126783 101.99157,14.7399709 103.379564,18.255356 C104.767557,21.7707412 105.837739,25.4612469 106.590109,29.3268734 C107.342479,33.1924998 107.718664,37.1878453 107.718664,41.3129098 C107.718664,45.4120304 107.342479,49.394404 106.590109,53.2600304 C105.837739,57.1256569 104.767557,60.8291345 103.379564,64.3704635 C101.99157,67.9117924 100.337653,71.239085 98.4178116,74.3523412 C97.5616661,75.7533064 97.2373686,77.1607577 97.444919,78.5746949 C97.6524694,79.9886321 98.3918678,81.0847577 99.663114,81.8630717 Z"
                            />
                        </g>
                    </svg>
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
    border: 1pt var(--color-border) solid;
    margin-bottom: 2rem;

    .audio-player {
        display: flex;
        align-items: center;
        gap: 0.75em;
        margin-top: 1rem;
    }
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
