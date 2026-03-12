<template>
    <BaseBox :background-char="'\u{2717}'" :box-type="'error'" :box-class="`error-box`">
        <template #header>
            ERROR
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

.error-box .box-header,
.error-box .box-content {
    color: var(--color-error-text);
}

:deep(.box-container::before) {
    opacity: 0.15;
}
</style>
