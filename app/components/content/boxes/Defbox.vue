<template>
    <BaseBox background-char=":=" box-type="definition" :box-class="`def-box`">
        <template #header>
            DEFINITION{{ title ? ` - ${title}` : '' }}
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
/* Definition box specific styles */
.def-box :deep(strong) {
    text-decoration: underline;
    text-decoration-style: dashed;
}
</style>
