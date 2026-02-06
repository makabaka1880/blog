<template>
    <div class="article-view">
        <div class="article-header">
            <h1>{{ page?.title }}</h1>
            <p>{{ page?.description }}</p>
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
