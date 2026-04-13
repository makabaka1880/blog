<template>
    <div v-for="link in toc" :key="link.id">
        <a :href="'#' + link.id" @click.prevent="scrollToId(link.id)">
            {{ link.text }}
        </a>
        <BlogToc class="child-toc" v-if="link.children" :toc="link.children" :depth="depth + 1" :top="false" />
    </div>
</template>

<script setup lang="ts">
import type { TocLink } from '@nuxtjs/mdc'
import { scrollToId } from '~/utils/anchor'

const props = defineProps<{
    toc: TocLink[],
    depth?: number,
    top: boolean
}>()

const depth = computed(() => props.depth ?? 0)
</script>

<style lang="scss" scoped>
.child-toc {
    padding-left: 0.75rem;
    border-left: 1px solid var(--color-border);
    margin-top: 0.25rem;
}

a {
    display: block;
    padding: 0.2rem 0;
    padding-left: calc(v-bind(depth) * 0.75rem);

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>