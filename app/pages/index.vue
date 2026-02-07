<template>
    <div class="container">
        <div class="hero">
            <h1>{{ config.title }}</h1>
            <p>{{ config.description }}</p>
        </div>
        <div class="search-field-container">
            <UIKitSearchField v-model="searchValue" @search="onSearch" />
        </div>
        <h2>Articles</h2>
        <div class="article-list-wrapper">
            <div class="article-list">
                <UIKitArticleList :page="currentPage" :per-page="perPage" @update:total-count="onTotalCountChange" />
            </div>
            <div class="pagination-wrapper">
                <UIKitPagination :current-page="currentPage" :total-pages="totalPages" @page-change="onPageChange" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import config from '@@/blog.config';
import { ref } from 'vue';

const currentPage = ref(1);
const perPage = 2;
const searchValue = ref('');
const searchResult = ref('');
const totalPages = ref(1);

function onPageChange(page: number) {
    currentPage.value = page;
}

function onTotalCountChange(count: number) {
    totalPages.value = Math.ceil(count / perPage);
}

function onSearch() {
    currentPage.value = 1;
    searchResult.value = searchValue.value;
}
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.hero {
    margin: var(--section-margin);
}

.search-field-container {
    width: 20vw;
    min-width: 20rem;
    max-width: 60rem;
    height: fit-content;
    margin-bottom: 5vh;
}

.article-list-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;

}

.article-list {
    flex: 1;
    overflow-y: auto;
}

.pagination-wrapper {
    flex-shrink: 0;
    padding-top: 1rem;
}

hr {
    width: 50%;
    opacity: 0.2;
}
</style>