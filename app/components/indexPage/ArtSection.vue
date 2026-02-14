<template>
    <div class="content-section">
        <h2 class="section-header">Art</h2>
        <div class="project-display">
            <div class="depth-image-container" id="poolcore-container" draggable="false">
                <RevealSlider v-if="!showMouseWarning">
                    <template #foreground>
                        <ParallaxWindowMousetrack albedo="/assets/index/poolcore-blank.webp"
                            depth="/assets/index/poolcore-depth.webp" :sensitivity-x="0.005" :sensitivity-y="0.005" />
                    </template>
                    <template #background>
                        <ParallaxWindowMousetrack src="/assets/index/poolcore.webp" :sensitivity-x="0.005"
                            :sensitivity-y="0.005" />
                    </template>
                </RevealSlider>
                <RevealSlider v-else>
                    <template #foreground>
                        <ParallaxWindowScrolltrack albedo="/assets/index/poolcore-blank.webp"
                            depth="/assets/index/poolcore-depth.webp" :sensitivity="0.3" :offset="0.2" />
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
                    <ParallaxWindowMousetrack v-if="!showMouseWarning" class="class-parallax-img"
                        src="/assets/index/cat.webp" :sensitivity-x="0.01" :sensitivity-y="0.01" :view-height=".45"
                        :offset-y="-5" />
                    <ParallaxWindowScrolltrack v-else src="/assets/index/cat.webp" class="class-parallax-img"
                        :sensitivity="0.2" :view-height="0.7" :offset="-.5" :angle="0.45" />
                </div>
                <div id="cat-parallax-text">
                    <h3>Photography</h3>
                    <div>
                        <p>I use a A7II (ILCE-7M2) for photography. This is a potrait of a random cute cat my grandma
                            always
                            play with at Changfeng Park, Changning. </p>
                        <p>Most of the time I don't do still photography; I do VFX and composition for my friends. I use
                            davinci and
                            blender on my M2 MBP 2022 13-inch.</p>
                    </div>
                </div>
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
@use "assets/theme.scss" as *;

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
    margin: 2rem auto;
    display: grid;
    gap: .5rem;
    align-items: center;

    /* Mobile: Vertical Stack */
    grid-template-areas:
        "title"
        "image"
        "description";

    #cat-parallax {
        grid-area: image;
    }

    #cat-parallax-text {
        display: contents;
    }

    h3 {
        grid-area: title;
        margin: 0;
    }

    p {
        grid-area: description;
        margin: 0;
    }

    @media (min-width: #{$critical-width}) {
        // Define a 2-column, 2-row grid
        grid-template-columns: 40% 1fr;
        grid-template-rows: auto auto;
        grid-template-areas:
            "image title"
            "image description";
        gap: 5vw;

        #cat-parallax {
            grid-row: 1 / span 2;
        }

        #cat-parallax-text {
            display: flex;
            flex-direction: column;
            justify-content: center;
            grid-area: auto; // Reset area
            grid-column: 2; // Force to second column
            grid-row: 1 / span 2; // Span both rows to match image height
            gap: 1rem;
            width: 100%;
        }

        h3,
        p {
            grid-area: auto;
        }
    }
}

.project-display {
    .depth-image-container {
        text-align: center;
        user-select: none;

        &#poolcore-container {
            margin: 2rem 0;
        }


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