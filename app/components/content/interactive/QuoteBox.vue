<template>
    <ProseBlockquote>
        <strong><slot /></strong>
        <div style="text-align: right;">
            <i>{{ props.source }}</i>
        </div>
    </ProseBlockquote>
</template>

<script setup lang="ts">
const props = defineProps<{ source: String }>()
</script>

<style lang="scss" scoped>
strong {
    font-size: larger;
}
</style>