<template>
    <em @mouseenter="show = true" @mouseleave="show = false">
        <RoughNotation :is-show="show" type="underline" color="var(--color-highlight-marker)" multiline=true>
            <slot />
        </RoughNotation>
    </em>
</template>

<script setup lang="ts">
const show = ref(false);
</script>

<style lang="scss"></style>
