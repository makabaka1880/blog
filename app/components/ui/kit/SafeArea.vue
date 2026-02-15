<template>
    <div class="safearea-wrapper" :class="{ 'has-left-sidebar': hasLeftSidebar, 'has-right-sidebar': hasRightSidebar }">
        <div v-if="hasLeftSidebar" class="left-sidebar">
            <slot name="sidebar" />
        </div>
        <div class="main-content">
            <slot name="content" />
        </div>
        <div v-if="hasRightSidebar" class="right-sidebar">
            <slot name="aside" />
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

    &:not(.has-left-sidebar) .left-sidebar {
        display: none;
    }

    &:not(.has-right-sidebar) .right-sidebar {
        display: none;
    }

    &.has-left-sidebar.has-right-sidebar {
        max-width: calc(#{$critical-width} + #{$sidebar-width} + #{$aside-width} + #{$sidebar-gap} * 2 + #{$sidebar-margin} * 2);
    }

    &.has-left-sidebar:not(.has-right-sidebar) {
        max-width: calc(#{$critical-width} + #{$sidebar-width} + #{$sidebar-gap} + #{$sidebar-margin} * 2);
    }

    &:not(.has-left-sidebar).has-right-sidebar {
        max-width: calc(#{$critical-width} + #{$aside-width} + #{$sidebar-gap} + #{$sidebar-margin} * 2);
    }

    &.has-left-sidebar .left-sidebar {
        margin-inline-start: $sidebar-margin;
    }

    &.has-right-sidebar .right-sidebar {
        margin-inline-end: $sidebar-margin;
    }

    &.has-left-sidebar:not(.has-right-sidebar) .main-content {
        margin-inline-end: $sidebar-margin;
    }

    &:not(.has-left-sidebar).has-right-sidebar .main-content {
        margin-inline-start: $sidebar-margin;
    }
}

.left-sidebar {
    position: sticky;
    top: $sidebar-top-offset;
    width: $sidebar-width;

    & > * {
        margin-top: $sidebar-margin;
    }
    flex-shrink: 0;
}

.main-content {
    flex: 1 1 $critical-width;
    min-width: 0;
    margin-top: $sidebar-margin;
    max-width: $critical-width;
}

.right-sidebar {
    position: sticky;
    top: $sidebar-top-offset;
    margin-top: $sidebar-margin;
    width: $aside-width;
    flex-shrink: 0;
}

@media (max-width: calc(#{$critical-width} + #{$sidebar-width} + #{$aside-width} + #{$sidebar-gap} * 2 + #{$sidebar-margin} * 2)) {
    .right-sidebar {
        display: none;
    }
}

@media (max-width: calc(#{$critical-width} + #{$sidebar-margin} * 2)) {
    .left-sidebar {
        display: none;
    }

    .main-content {
        margin-left: $sidebar-margin
    }

}
</style>
