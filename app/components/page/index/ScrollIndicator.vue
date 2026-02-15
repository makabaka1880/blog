<template>
    <div class="scroll-indicator" :class="{ 'hidden': hidden }">
        <em>Continue Scrolling...</em>
    </div>
</template>

<script lang="ts" setup>
defineProps<{
    hidden?: boolean;
}>();
</script>

<style lang="scss" scoped>
.scroll-indicator {
    opacity: 1;
    transition: opacity 0.3s ease-out;
    margin: 3rem 0;
}

.scroll-indicator.hidden {
    opacity: 0;
}
</style>