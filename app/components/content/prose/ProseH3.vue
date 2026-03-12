<template>
    <h3 :id="slug">
        <a :href="'#' + slug" @click.prevent="scrollToAnchor">
            <slot />
        </a>
    </h3>
</template>

<script lang="ts" setup>
import { useAnchor } from '~/utils/anchor';

const { slug, scrollToAnchor } = useAnchor();
</script>

<style lang="scss" scoped>
h3 {
    margin-top: 2rem;
    font-weight: 600;

    &.anchor {
        display: block;
        position: relative;
        top: calc(-1 * var(--anchor-top-offset));
        visibility: hidden;
    }
}
</style>
