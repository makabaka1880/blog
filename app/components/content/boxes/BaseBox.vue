<template>
    <div class="box-container" :data-char="backgroundChar" :data-type="boxType" :class="boxClass">
        <div class="box-header">
            <slot name="header">
                {{ headerText }}
            </slot>
        </div>
        <div class="box-content">
            <slot />
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'

interface Props {
    type?: string;
    boxClass?: string;
    headerText?: string;
    backgroundChar?: string;
    boxType?: string;
}

const props = withDefaults(defineProps<Props>(), {
    type: '',
    boxClass: '',
    headerText: '',
    backgroundChar: '',
    boxType: ''
})
</script>

<style lang="scss" scoped>
.box-container {
    position: relative;
    width: 80%;
    margin: 2rem auto;
    padding: 1.5rem;
    border: 0.125rem solid var(--color-text);
    border-radius: var(--border-radius-box);
    background-color: var(--color-card-background);
    overflow: hidden;
    font-family: var(--font-family-base);
}

/* Decorative background glyph */
.box-container::before {
    content: attr(data-char);

    position: absolute;
    top: 1rem;
    left: 1rem;

    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;

    font-size: 8em;
    line-height: 1;

    color: var(--color-box-background-char);

    pointer-events: none;
    user-select: none;

    z-index: 0;
}

/* Header and content above the background glyph */
.box-header,
.box-content {
    position: relative;
    z-index: 1;
}

/* Header styling */
.box-header {
    font-family: 'JetBrains Mono', monospace;
    font-size: var(--font-size-lg);
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 1rem;
    color: var(--color-text);
}

/* Content styling */
.box-content {
    color: var(--color-text);
}

/* Allow box-specific overrides */
:slotted(*) {
    color: var(--color-text);
}
</style>