<template>
    <div class="safearea-wrapper" :class="{ 'has-left-sidebar': hasLeftSidebar }">
        <div v-if="hasLeftSidebar" class="left-sidebar">
            <slot name="sidebar" />
        </div>
        <div class="main-content">
            <slot name="content" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useSlots } from 'vue';

const slots = useSlots();

const hasLeftSidebar = computed(() => !!slots.sidebar);
const hasRightSidebar = computed(() => !!slots.aside);
</script>

<style lang="scss" scoped>
@use "~/assets/theme.scss" as *;

.safearea-wrapper {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    gap: $sidebar-gap;
    width: 100%;
    max-width: $critical-width;
    margin-inline: auto;
    padding-inline: 0;
    box-sizing: border-box;
    margin-top: 0;
    margin-bottom: $sidebar-margin;

    &.has-left-sidebar {
        max-width: calc(#{$critical-width} + #{$sidebar-width} + #{$sidebar-gap} + #{$sidebar-margin} * 2);
    }

    &.has-left-sidebar .left-sidebar {
        margin-inline-start: $sidebar-margin;
    }

    &.has-left-sidebar .main-content {
        margin-inline-end: $sidebar-margin;
    }
}

.left-sidebar {
    position: sticky;
    top: $sidebar-top-offset;
    width: $sidebar-width;
    flex-shrink: 0;

    & > * {
        margin-top: $sidebar-margin;
    }
}

.main-content {
    flex: 1 1 $critical-width;
    min-width: 0;
    margin-top: $sidebar-margin;
    max-width: $critical-width;
}

@media (max-width: $screen-transition-width) {
    .left-sidebar {
        display: none;
    }

    .main-content {
        margin-left: $sidebar-margin;
    }
}
</style>
