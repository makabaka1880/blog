<template>
    <div class="box-container">
        <div :class="['qabox-container', type]">
            <span :class="['qabox-label', type]">{{ label }}</span>
            <div class="qabox-content">
                <b>{{ prefix }} </b>
                <slot />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    type: {
        type: String as PropType<'question' | 'answer'>,
        default: 'question'
    }
})

const label = computed(() => props.type === 'question' ? 'Q' : 'A')
const prefix = computed(() => props.type === 'question' ? 'Problem.' : 'Solution.')
</script>

<style lang="scss" scoped>
@use '~/assets/theme' as *;

.box-container {
    margin: 1rem 0;
}

.qabox-container {
    background-color: var(--color-defbox-bg);
    padding: 1rem;
    border: 1px var(--color-border) solid;
    border-radius: 0.5rem;
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    text-align: left;

    &.answer {
        background-color: var(--color-success-bg);
        border-color: var(--color-success-border);
    }
}

.qabox-label {
    font-size: 3rem;
    font-weight: 700;
    line-height: 1;
    opacity: 0.4;
    flex-shrink: 0;

    &.answer {
        color: var(--color-success-text);
        opacity: 0.6;
    }
}

.qabox-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.qabox-content b {
    font-weight: 600;
    color: var(--color-text);
}

@media (max-width: $critical-width) {
    .qabox-container {
        flex-direction: row;
    }
}
</style>