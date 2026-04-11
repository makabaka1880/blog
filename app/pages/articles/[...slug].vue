<template>
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
        </div>
        <hr class="sep" />
        <Comment />
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

</script>

<style lang="scss" scoped>
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
</style>
