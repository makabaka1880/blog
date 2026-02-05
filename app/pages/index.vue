<template>
    <div>
        <div class="hero">
            <h1>{{ config.title }}</h1>
            <p>{{ config.description }}</p>
        </div>
        <div class="search-field-container">
            <UIKitSearchField v-model="searchValue" @search="onSearch" />
        </div>
        <h2>Articles</h2>
        <!-- list -->
    </div>
</template>

<script setup lang="ts">
import config from '@@/blog.config';
import { ref } from 'vue';

const currentPage = ref(1); // Page numbering starts from 1, if you need to start from 0, set Pagination component's startPage=0
const perPage = 10;
const searchValue = ref('');
const searchResult = ref('');

const totalPages = ref(1); // Initialize to 1, ensure pagination component is correctly hidden on single pages

function onUpdateTotalPages(value: number) {
    totalPages.value = value;
}

function onSearch() {
    currentPage.value = 1;
    searchResult.value = searchValue.value;
}
</script>

<style scoped>
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

</style>