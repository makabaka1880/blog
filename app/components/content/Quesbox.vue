<template>
    <div class="box-container">
        <div class="quesbox-container">
            <span class="quesbox-Q">Q</span>
            <div class="quesbox-content">
                <b> Problem. </b>
                <slot />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    id: { type: String }
})
const title = computed(() => {
    return props.id!
})
</script>

<style lang="scss" scoped>
@use '~/assets/theme' as *;

.box-container {
    margin: 1rem 0;
}

.quesbox-container {
    background-color: var(--color-defbox-bg);
    padding: 1rem;
    border: 0.0625rem var(--color-border) solid;
    border-radius: 0.5rem;
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    text-align: left;
}

.quesbox-Q {
    font-size: var(--font-size-5xl);
    font-weight: 700;
    line-height: 1;
    opacity: 0.4;
    flex-shrink: 0;
}

.quesbox-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.quesbox-content b {
    font-weight: 600;
    color: var(--color-text);
}

@media (max-width: $critical-width) {
    .quesbox-container {
        flex-direction: row;
    }
}
</style>
