<template>
    <div class="content-section">
        <h2 class="section-header">Art</h2>
        <div class="project-display">
            <div class="depth-image-container" draggable="false">
                <RevealSlider v-if="!showMouseWarning">
                    <template #foreground>
                        <ParallaxWindowMousetrack albedo="/assets/index/poolcore-blank.webp"
                            depth="/assets/index/poolcore-depth.webp" :sensitivity-x="0.02" :sensitivity-y="0.02" />
                    </template>
                    <template #background>
                        <ParallaxWindowMousetrack src="/assets/index/poolcore.webp"
                        :sensitivity-x="0.02" :sensitivity-y="0.02"/>
                    </template>
                </RevealSlider>
                <RevealSlider v-else>
                    <template #foreground>
                        <ParallaxWindowScrolltrack albedo="/assets/index/poolcore-blank.webp"
                            depth="/assets/index/poolcore-depth.webp":sensitivity="0.3" :offset="0.2" />
                    </template>
                    <template #background>
                        <ParallaxWindowScrolltrack src="/assets/index/poolcore.webp" :sensitivity="0.3" :offset="0.2" />
                    </template>
                </RevealSlider>
                <small v-if="!showMouseWarning">Try moving your cursor around.</small>
            </div>
            <p>
                The above is a recreation of a frame in the second scene in my render collection
                inspired by the poolcore style. I use blender and mostly open-sourced assets like bridge for renders.
            </p>
            <div class="cat-img-container">
                <div class="depth-image-container" id="cat-parallax" draggable="false">
                    <ParallaxWindowMousetrack v-if="!showMouseWarning" src="/assets/index/Cat.webp"
                        :sensitivity-x="0.02" :sensitivity-y="0.02" :view-height=".45" :offset-y="-2" />
                    <ParallaxWindowScrolltrack v-else src="/assets/index/Cat.webp" :sensitivity="0.2" :view-height="0.7"
                        :offset="-.5" :angle="0.45" />
                </div>
                <p>I use a A7II (ILCE-7M2) for photography. This is a potrait of a random cute cat my grandma always
                    play with at Changfeng Park, Changning. </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import RevealSlider from '../utils/RevealSlider.vue';

const showMouseWarning = ref(false);
const catContainerRef = ref<HTMLElement | null>(null);
const isCompactLayout = ref(false);

const checkContainerWidth = () => {
    if (catContainerRef.value) {
        const containerWidth = catContainerRef.value.offsetWidth;
        const viewportWidth = window.innerWidth;
        isCompactLayout.value = (containerWidth / viewportWidth) < 0.6;
    }
};

onMounted(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');

    const handler = (e: MediaQueryListEvent) => {
        showMouseWarning.value = !e.matches;
    };

    media.addEventListener('change', handler);
    onUnmounted(() => media.removeEventListener('change', handler));

    showMouseWarning.value = !media.matches;

    // Check container width on mount and resize
    checkContainerWidth();
    window.addEventListener('resize', checkContainerWidth);
    onUnmounted(() => window.removeEventListener('resize', checkContainerWidth));
});
</script>

<style lang="scss" scoped>
.content-section {
    margin: 2rem 0;
}

.section-header {
    margin-top: 3rem;
    margin-bottom: 1rem;
}

.feature-tag {
    margin: 1rem auto;
    width: 80%;
}

.cat-img-container {
    display: flex;
    align-items: center;
    gap: 2rem;

    #cat-parallax {
        flex: 1;
        flex-basis: 60%;
        min-width: 0;
    }

    > p {
        flex: 1;
        flex-basis: 40%;
        min-width: 0;
    }
}

.project-display {
    .depth-image-container {
        text-align: center;
        user-select: none;
        margin: 2rem 0;


        small {
            display: block;
            margin-top: 0.5rem;
            color: var(--text-muted);
        }

        p {
            margin-top: 1.5rem;
        }
    }
}
</style>