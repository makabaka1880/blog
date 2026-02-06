<template>
    <strong @mouseenter="show = true" @mouseleave="show = false" :style="{
        color: show ? 'white' : 'inherit',
        transform: show ? 'scale(1.05)' : 'scale(1)',
        transition: 'color 0.3s ease, transform 0.3s ease'
    }">
        <RoughNotation :is-show="show" type="highlight" color="var(--color-highlight-marker)" multiline=true>
            <slot />
        </RoughNotation>
    </strong>
</template>

<script setup lang="ts">
const show = ref(false);
</script>

<style lang="scss"></style>
