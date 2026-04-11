<template>
    <h2 :id="slug">
        <a :href="'#' + slug" @click.prevent="scrollToAnchor">
            <slot />
        </a>
    </h2>
</template>

<script lang="ts" setup>
import { useAnchor } from '~/utils/anchor';

const { slug, scrollToAnchor } = useAnchor();
</script>

<style lang="scss" scoped>
h2 {
    margin-top: 2rem;
    font-weight: 700;

    &.anchor {
        display: block;
        position: relative;
        top: calc(-1 * var(--anchor-top-offset));
        visibility: hidden;
    }
}
</style>
