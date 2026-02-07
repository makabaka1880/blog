<template>
    <div class="article-view">
        <div class="article-header">
            <div style="margin-bottom: 1.5rem">
                <h1>{{ page?.title }}</h1>
                <p style="color: var(--color-text-light)"> {{ page?.description }} </p>
            </div>
            <p v-if="showUpdated">Created {{ createdAt }} · Updated {{ updatedAt }}</p>
            <p v-else>Created {{ createdAt }}</p>
        </div>
        <hr class="sep" />
        <div class="article-container">
            <ContentRenderer v-if="page" :value="page" />
        </div>
    </div>
</template>

<script lang="ts" setup>
definePageMeta({
    layout: 'article'
})

import { useHead, inject, computed } from '#imports'

const route = useRoute()

const { data: page } = await useAsyncData(route.path, () => {
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

.sep {
    margin: 3rem 0;
    display: block;
    height: 5px;
    border: 0;
    border-top: 1px solid var(--color-sep-border);
    opacity: .5;
    padding: 0;
    width: 60%;
}
</style>
