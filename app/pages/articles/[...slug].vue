<template>
    <div class="hover-popover-backdrop" v-if="popoverOpen" @click="popoverOpen = false" />
    <div class="article-view">
        <div class="article-header">
            <div style="margin-bottom: 1.5rem">
                <h1 id="article-top">{{ page?.title }}</h1>
                <p style="color: var(--color-text-light)"> {{ page?.description }} </p>
            </div>
            <p>
                Created {{ createdAt }}
                <span v-if="showUpdated"> · Updated {{ updatedAt }}</span>
                <span> · Estimated {{ readingTime }} Read</span>
            </p>
        </div>
        <hr class="sep" />
        <div class="article-container">
            <ContentRenderer v-if="page" :value="page" />
            <div class="hover-button" @click="togglePopover">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor"
                        d="M3 7h18a1 1 0 0 0 0-2H3a1 1 0 0 0 0 2m0 4h14a1 1 0 0 0 0-2H3a1 1 0 0 0 0 2m18 2H3a1 1 0 0 0 0 2h18a1 1 0 0 0 0-2m-4 4H3a1 1 0 0 0 0 2h14a1 1 0 0 0 0-2" />
                </svg>
            </div>
        </div>
        <hr class="sep" />
        <Comment />
        <Teleport to="body">
            <div v-if="popoverOpen" class="hover-popover">
                <BlogToc :toc="page!.body.toc!.links" :top="false" />
            </div>
        </Teleport>
    </div>
</template>

<script lang="ts" setup>
definePageMeta({
    layout: 'article'
})

import { useHead, inject, computed } from '#imports'
import type { MinimarkNode } from '@nuxt/content'
import Comment from '~/components/ui/kit/Comment.vue'

const route = useRoute()

const { data: page } = await useAsyncData(`article:${route.path}`, () => {
    return queryCollection('articles').path(route.path).first()
})

const formatterWithYear = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
})

const formatterNoYear = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
})

const parseDate = (value?: string) => {
    if (!value) return ''
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    return date
}

const formatDate = (date: Date, includeYear: boolean) =>
    includeYear ? formatterWithYear.format(date) : formatterNoYear.format(date)

const createdAt = computed(() => {
    const created = parseDate(page.value?.createTime)
    const updated = parseDate(page.value?.updateTime)
    if (!created || !updated) return page.value?.createTime ?? ''

    const nowYear = new Date().getFullYear()
    const createdYear = created.getFullYear()
    const updatedYear = updated.getFullYear()

    // If both are in the current year, omit the year on both.
    if (createdYear === nowYear && updatedYear === nowYear) {
        return formatDate(created, false)
    }

    // If created and updated are in the same year, only show the year on Created.
    if (createdYear === updatedYear) {
        return formatDate(created, true)
    }

    // Otherwise, include the year.
    return formatDate(created, true)
})

const updatedAt = computed(() => {
    const created = parseDate(page.value?.createTime)
    const updated = parseDate(page.value?.updateTime)
    if (!created || !updated) return page.value?.updateTime ?? ''

    const nowYear = new Date().getFullYear()
    const createdYear = created.getFullYear()
    const updatedYear = updated.getFullYear()

    // If both are in the current year, omit the year on both.
    if (createdYear === nowYear && updatedYear === nowYear) {
        return formatDate(updated, false)
    }

    // If created and updated are in the same year, only show the year on Created.
    if (createdYear === updatedYear) {
        return formatDate(updated, false)
    }

    // Otherwise, include the year.
    return formatDate(updated, true)
})

const showUpdated = computed(() => {
    const created = parseDate(page.value?.createTime)
    const updated = parseDate(page.value?.updateTime)
    if (!created || !updated) return false
    return (
        created.getFullYear() !== updated.getFullYear() ||
        created.getMonth() !== updated.getMonth() ||
        created.getDate() !== updated.getDate()
    )
})

const readingTime = computed(() => {
    return `${computeReadingTime(page.value?.body.value ?? [])} min`;
})

const computeReadingTime = (input: MinimarkNode | MinimarkNode[]): number => {
    const wordCount = (n: MinimarkNode): number => {
        if (typeof n === 'string') {
            return n.trim().split(/\s+/).filter(Boolean).length;
        }
        const [, , ...children] = n;
        return children.reduce((acc, child) => acc + wordCount(child), 0);
    };

    const totalWords = Array.isArray(input) && typeof input[0] !== 'string'
        ? (input as MinimarkNode[]).reduce((acc, node) => acc + wordCount(node), 0)
        : wordCount(input as MinimarkNode);

    return Math.ceil(totalWords / 200);
};

const popoverOpen = ref(false)
const togglePopover = () => popoverOpen.value = !popoverOpen.value

</script>

<style lang="scss" scoped>
@use '@/assets/theme/layout.scss' as *;

.article-view {
    height: 100%;
    color: var(--color-text);
    background-color: transparent;
    position: relative;
}

.article-header {
    margin: var(--section-margin) 0;
}


:deep(iframe) {
    width: 80%;
    height: 50vh;
    display: block;
    margin: 2rem auto;
}

:deep(.image-like) {
    margin: 2rem auto;
}


.hover-button {
    position: sticky;
    left: 0;
    bottom: 1rem;

    background-color: var(--color-card-background);
    padding: 1rem;
    width: min-content;
    border-radius: 0.4rem;
    box-shadow: 0 0 10px 1px var(--color-shadow);
    margin-bottom: 1rem;
    z-index: 10;
}

@media (min-width: $screen-transition-width) {
    .hover-button {
        display: none;
    }
}

.hover-popover {
    position: fixed;
    bottom: calc(5rem);
    left: 1rem;

    background-color: var(--color-card-background);
    border-radius: 0.4rem;
    box-shadow: 0 0 10px 1px var(--color-shadow);
    padding: 1rem;
    z-index: 10;
}
.hover-popover-backdrop {
    position: fixed;
    background-color: #00000033;
    inset: 0;
    z-index: 9; // just below popover
}
</style>
