<template>
    <BaseBox background-char="∴" box-type="theorem" :box-class="`theorem-box`">
        <template #header>
            THEOREM{{ title ? ` - ${title}` : '' }}
        </template>
        <slot />
    </BaseBox>
</template>

<script lang="ts" setup>
import BaseBox from './BaseBox.vue'

const props = defineProps({
    id: { type: String }
})

const title = computed(() => props.id || '')
</script>

<style lang="scss" scoped>
.theorem-box {
    background-color: var(--color-golden-background);
    border-color: var(--color-golden-border);
    --box-header-color: var(--color-golden-text);
    --box-bg-char-color: var(--color-golden-overlay);
    --box-bg-char-opacity: 0.15;
}
</style>