<template>
    <div class="blur">
        <slot />
    </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.blur {
    transition: filter 0.2s;
    filter: blur(0.25rem);

    &:hover {
        filter: blur(0);
    }
}
</style>
