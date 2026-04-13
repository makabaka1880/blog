<template>
    <BaseBox :background-char="''" :box-type="'error'" :box-class="`error-box`">
        <template #header>
            FATAL
        </template>
        <slot />
    </BaseBox>
</template>

<script lang="ts" setup>
import BaseBox from './BaseBox.vue'
</script>

<style lang="scss" scoped>
.error-box {
    background-color: var(--color-error-background);
    border-color: var(--color-error-border);
    --box-header-color: var(--color-error-text);
    --box-bg-char-color: var(--color-error-overlay);
    --box-bg-char-opacity: 0.15;
}
</style>
