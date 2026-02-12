<template>
    <div ref="elementRef" class="image-like">
        <ParallaxWindow :src="props.src" :depth="props.depth" :sensitivity-x="props.sensitivityX"
            :sensitivity-y="props.sensitivityY" ref="pwindow" :reverse-depth="props.reverse" />
        <div v-if="!hasMouse && props.showWarning" class="no-mouse-overlay" @click="isWarningVisible = !isWarningVisible">
            <Icon name="uil:exclamation-triangle" size="1.2em" />
        </div>
        <WarningTag v-if="!hasMouse && isWarningVisible" class="feature-tag" :collapsible="false"
            msg="Your device does not support mouse interactions. Parallax effect may not work." />
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useElementMouse } from '~/utils/useElementMouse';
import WarningTag from '../uikit/WarningTag.vue';

const props = withDefaults(defineProps<{
    src: string,
    depth: string,
    sensitivityX?: number,
    sensitivityY?: number,
    reverse?: boolean,
    showWarning?: boolean
}>(), {
    reverse: true,
    sensitivityX: 0.04,
    sensitivityY: 0.04,
    showWarning: true
});

const pwindow = ref<any>(null);
const elementRef = ref<HTMLElement | null>(null);
const isWarningVisible = ref(false);

// Detect if device supports mouse hover interactions
const hasMouse = ref(true);

onMounted(() => {
    hasMouse.value = window.matchMedia('(hover: hover)').matches;
});

const { mouseX, mouseY } = useElementMouse(elementRef);

watch([mouseX, mouseY], ([newX, newY]) => {
    if (pwindow.value && pwindow.value.render) {
        pwindow.value.render(newX, newY);
    }
});
</script>

<style lang="scss" scoped>
.image-like {
    position: relative;
    display: flex;
    flex-direction: column;

}

.no-mouse-overlay {
    position: absolute;
    top: 0.5rem;
    left: 12%;
    padding: 0.4rem;
    color: var(--color-warning-text);
    display: flex;
    align-items: center;
    cursor: pointer;
    z-index: 99;
}

.feature-tag {
    /* Change from margin-top to absolute positioning */
    position: absolute;
    top: 3.5rem;
    /* Sit it just below the icon */
    left: 12%;
    z-index: 100;
    /* Higher than the icon overlay */
    max-width: 80%;
    background-color: var(--color-warning-bg);
}
</style>