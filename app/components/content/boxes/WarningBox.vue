<template>
    <BaseBox :background-char="''" :box-type="'warning'" :box-class="`warning-box`">
        <template #header>
            WARNING
        </template>
        <slot />
    </BaseBox>
</template>

<script lang="ts" setup>
import BaseBox from './BaseBox.vue'
</script>

<style lang="scss" scoped>
.warning-box {
    background-color: var(--color-warning-background);
    border-color: var(--color-warning-border);
}

:deep(.box-header) {
    color: var(--color-warning-text);
}

:deep(.box-container::before) {
    opacity: 0.15;
}

.box-container::before {
    color: var(--color-warning-overlay);
}
</style>
