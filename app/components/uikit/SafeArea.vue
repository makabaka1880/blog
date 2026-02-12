<template>
    <div class="safe-area">
        <slot />
    </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
@use "~/assets/theme.scss" as *;

.safe-area {
    display: block;
    margin: 5rem auto;
    width: calc(#{$critical-width} - 8rem);
    height: 100%;
}

@media (max-width: $critical-width) {
    .safe-area {
        width: calc(100% - 8rem);
        margin: 5rem 4rem;
    }
}
</style>
