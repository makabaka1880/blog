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
}

:deep(.box-header) {
    color: var(--color-error-text);
}

:deep(.box-container::before) {
    opacity: 0.15;
}

.box-container::before {
    color: var(--color-error-overlay);
}
</style>
