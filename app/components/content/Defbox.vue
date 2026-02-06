<template>
    <div class="box-container">
        <b>DEFINITION - {{ title }}. </b>
        <slot />
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
.box-container {
    background-color: var(--color-defbox-bg);
    padding: 1em;
    border: 1px var(--color-border) solid;
    margin: 1rem 0;
}
</style>