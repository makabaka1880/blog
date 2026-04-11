<template>
    <h1 :id="slug">
        <a :href="'#' + slug" @click.prevent="scrollToAnchor">
            <slot />
        </a>
    </h1>
</template>

<script lang="ts" setup>
import { useAnchor } from '~/utils/anchor';

const { slug, scrollToAnchor } = useAnchor();
</script>

<style lang="scss" scoped>
h1 {
    margin-top: 2rem;
    font-weight: 800;
    font-size: var(--font-size-4xl);

    &.anchor {
        display: block;
        position: relative;
        top: calc(-1 * var(--anchor-top-offset));
        visibility: hidden;
    }
}
</style>
