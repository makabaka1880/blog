<template>
    <BaseBox background-char="∈" box-type="example-box" :box-class="`example-box`">
        <template #header>
            FOR INSTANCE...
        </template>
        <slot />
    </BaseBox>
</template>

<script lang="ts" setup>
import BaseBox from './BaseBox.vue'
</script>

<style lang="scss" scoped>
.example-box {
    background-color: var(--color-blue-background);
    border-color: var(--color-blue-border);
    --box-header-color: var(--color-blue-text);
    --box-bg-char-color: var(--color-blue-overlay);
    --box-bg-char-opacity: 0.15;
}
</style>