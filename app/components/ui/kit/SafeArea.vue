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
    max-width: calc(#{$critical-width} + #{$sidebar-width} + #{$aside-width} + #{$sidebar-gap} * 2 + #{$safearea-inline-padding} * 2);
    margin-inline: auto;
    padding-inline: $safearea-inline-padding;
    box-sizing: border-box;

    &:not(.has-left-sidebar) .left-sidebar {
        display: none;
    }

    &:not(.has-right-sidebar) .right-sidebar {
        display: none;
    }
}

.left-sidebar {
    position: sticky;
    top: $sidebar-top-offset;
    width: $sidebar-width;
    flex-shrink: 0;
}

.main-content {
    flex: 1 1 $critical-width;
    min-width: 0;
    max-width: $critical-width;
}

.right-sidebar {
    position: sticky;
    top: $sidebar-top-offset;
    width: $aside-width;
    flex-shrink: 0;
}

@media (max-width: calc(#{$critical-width} + #{$sidebar-width} + #{$aside-width} + #{$sidebar-gap} * 2 + #{$safearea-inline-padding} * 2)) {
    .right-sidebar {
        display: none;
    }
}

@media (max-width: calc(#{$critical-width} + #{$safearea-inline-padding} * 2)) {
    .left-sidebar {
        display: none;
    }

    .main-content {
        max-width: none;
    }

}
</style>
