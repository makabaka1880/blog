<template>
    <BaseBox :background-char="''" :box-type="'success'" :box-class="`success-box`">
        <template #header>
            NOTE
        </template>
        <slot />
    </BaseBox>
</template>

<script lang="ts" setup>
import BaseBox from './BaseBox.vue'
</script>

<style lang="scss" scoped>
.success-box {
    background-color: var(--color-success-background);
    border-color: var(--color-success-border);
}

:deep(.box-header) {
    color: var(--color-success-text);
}

:deep(.box-container::before) {
    opacity: 0.15;
}

.box-container::before {
    color: var(--color-success-overlay);
}
</style>
