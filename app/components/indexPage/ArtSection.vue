<template>
    <div class="content-section">
        <h2 class="section-header">Art</h2>
        <div class="project-display">
            <div class="depth-image-container" draggable="false">
                <ParallaxWindowMousetrack src="/assets/index/poolcore.webp" depth="/assets/index/poolcore-depth.webp"
                    :sensitivity-x="0.02" :sensitivity-y="0.02" :show-warning="false"/>
                <UIKitWarningTag class="feature-tag" v-if="showMouseWarning"
                    msg="Your device does not support mouse interactions. Parallax effect may not work." />
                <small v-if="!showMouseWarning">Try moving your cursor around.</small>
            </div>
            <p>
                The above is a recreation of a frame in the second scene in my render collection
                inspired by the poolcore style. I use blender and mostly open-sourced assets like bridge for renders.
            </p>
        </div>
    </div>
</template>

<script lang="ts" setup>
const showMouseWarning = ref(false);

onMounted(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');

    const handler = (e: MediaQueryListEvent) => {
        showMouseWarning.value = !e.matches;
    };

    media.addEventListener('change', handler);
    onUnmounted(() => media.removeEventListener('change', handler));

    showMouseWarning.value = !media.matches;
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
.project-display {
    .depth-image-container {
        text-align: center;
        user-select: none;
        margin: 2rem 0;

        .vuedepthviewer__container {
            width: 80%;
            height: auto;
            display: block;
            margin: 2rem auto;
            margin-bottom: 1rem;
            position: relative;

            :deep(canvas) {
                border-radius: 1rem;
            }
        }

        :deep(.vuedepthviewer__img) {
            width: 100%;
            height: auto;
            border-radius: 1rem;
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