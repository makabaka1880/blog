<template>
    <div class="container">
        <div class="hero">
            <h1>Posts</h1>
            <p>{{ config.description }}</p>
        </div>
        <div class="search-field-container">
            <UIKitSearchField v-model="searchValue" @search="onSearch" />
        </div>
        <div class="article-list-wrapper">
            <div class="article-list">
                <template v-for="(yearArticles, year) in entriesGrouped" :key="year">
                    <div class="year-title-bar">
                        <h2 class="year-disp"><strong>{{ year }}</strong> </h2> {{ yearArticles.length }} post{{
                            yearArticles.length > 1 ? "s" : "" }}
                    </div>
                    <div class="year-art-container">
                        <div v-for="article in yearArticles" :key="article.path" class="article-item">
                            {{ console.log(article.path) }}
                            <NuxtLink :to="article.path">
                                <div class="title-bar">
                                    <h3>{{ article.title }}</h3>
                                    <small>{{ new Date(article.createTime).toLocaleDateString() }}</small>
                                </div>
                                <p>{{ article.description }}</p>
                            </NuxtLink>
                        </div>
                    </div>
                </template>
            </div>
            <div class="pagination-wrapper">
                <UIKitPaginator :current-page="currentPage" :total-pages="totalPages" @page-change="onPageChange" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import config from '@@/blog.config';
import { count } from 'node:console';
import { ref, computed, onMounted } from 'vue';

const currentPage = ref(1);
const perPage = 2;
const searchValue = ref('');
const searchResult = ref('');
const totalPages = ref(1);
const articleCount = ref(0);
const articles = ref<any[]>([]);

onMounted(async () => {
    const result = await queryCollection('articles').select('title', 'description', 'createTime', 'path').order('createTime', 'DESC');
    articleCount.value = await result.count();
    articles.value = await result.all();
    console.log('Article count:', articles.value);
});

const entriesGrouped = computed(() => {
    const grouped: Record<string, typeof articles.value> = {};
    articles.value.forEach(article => {
        const year = new Date(article.createTime).getFullYear().toString();
        if (!grouped[year]) {
            grouped[year] = [];
        }
        grouped[year].push(article);
    });
    return grouped;
});

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

        .article-list {
            flex: 1;
            position: relative;

            .year-title-bar {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
            }

            .year-disp {
                margin-top: 2rem;
                margin-bottom: 1rem;
                font-size: 1.5rem;
                color: var(--text-secondary);
            }

            .year-art-container {
                .article-item {
                    margin-bottom: 1.5rem;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    background: var(--surface-elevated);
                    transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
                    box-shadow: none;

                    &:hover {
                        background-color: var(--color-card-hover-bg);
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                        cursor: pointer;
                    }

                    .title-bar {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: space-between;
                        gap: 1rem;

                        h3 {
                            margin: 0;
                        }

                        small {
                            color: var(--text-muted);
                            flex-shrink: 0;
                        }
                    }

                    p {
                        margin: 0.5rem 0 0 0;
                        color: var(--text-secondary);
                    }
                }
            }
        }

        .pagination-wrapper {
            flex-shrink: 0;
            padding-top: 1rem;
        }
    }

    hr {
        width: 50%;
        opacity: 0.2;
    }

    h2 {
        margin-bottom: 1rem;
    }
}
</style>