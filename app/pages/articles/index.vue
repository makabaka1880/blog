<template>
    <div class="container">
        <div class="hero">
            <h1>Articles</h1>
            <p>{{ config.description }}</p>
            <button class="search-fallback-button" type="button" @click="isSearchOpen = true">
                <span>
                    <Icon name="uil:search" /> Search
                </span>
            </button>
        </div>
        <div class="article-list-wrapper">
            <div class="article-list">
                <template v-for="{ year, articles: yearArticles } in entriesGrouped" :key="year">
                    <div class="year-title-bar">
                        <h2 class="year-disp"><strong>{{ year }}</strong> </h2> {{ yearArticles.length }} article{{
                            yearArticles.length > 1 ? "s" : "" }}
                    </div>
                    <div class="year-art-container">
                        <div v-for="article in yearArticles" :key="article.path" class="article-item">
                            <NuxtLink :to="article.path">
                                <div class="title-bar">
                                    <h3>{{ article.title }}</h3>
                                    <small>{{ new Date(article.createTime).toLocaleDateString('en-US', {
                                        day:
                                            'numeric', month: 'short'
                                    }) }}</small>
                                </div>
                                <p>{{ article.description }}</p>
                            </NuxtLink>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <SearchModal :open="isSearchOpen" @update:open="isSearchOpen = $event" />
    </div>
</template>

<script setup lang="ts">
import config from '@@/blog.config';
import { ref, computed, onMounted } from 'vue';
import SearchModal from '~/components/blog/SearchModal.vue';

const articles = ref<any[]>([]);
const isSearchOpen = ref(false);

onMounted(async () => {
    const result = await queryCollection('articles').select('title', 'description', 'createTime', 'path').order('createTime', 'DESC');
    articles.value = await result.all();
});

const entriesGrouped = computed(() => {
    // 1. Grouping logic
    const grouped = articles.value.reduce((acc, article) => {
        const year = new Date(article.createTime).getFullYear().toString();
        acc[year] = acc[year] ?? [];
        acc[year].push(article);
        return acc;
    }, {});

    // 2. Sorting years (Descending) and inner articles
    return Object.keys(grouped)
        .sort((a, b) => Number(b) - Number(a))
        .map(year => {
            const sortedArticles = [...grouped[year]].sort((a, b) => {
                const dateA = new Date(a.createTime).getTime();
                const dateB = new Date(b.createTime).getTime();

                // Primary sort: Date (Newest first)
                // Secondary sort: Title (Lexicographic)
                return (dateB - dateA) || b.title.localeCompare(a.title);
            });

            return {
                year,
                articles: sortedArticles
            };
        });
});

</script>

<style lang="scss" scoped>
@use "~/assets/theme.scss" as *;

.container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .hero {
        margin: var(--section-margin);
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
                font-size: var(--font-size-3xl);
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

                    :deep(a):hover {
                        text-decoration: none;
                    }

                    &:hover {
                        background-color: var(--color-card-hover-background);
                        box-shadow: 0 0.25rem 0.75rem var(--color-shadow);
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

.search-fallback-button {
    display: none;
    align-items: center;
    justify-content: flex-start;
    width: 78%;
    margin-top: 1rem;
    border: 0.0625rem solid var(--color-border);
    background: var(--color-card-background);
    color: var(--color-text);
    border-radius: 0.25rem;
    padding: 0.5rem 0.75rem;
    cursor: pointer;
    font-size: var(--font-size-md);
    transition: width 0.1s ease-in-out;
    will-change: width;

    &:hover {
        width: 100%;
        color: var(--color-link);
        border-color: var(--color-link);
        background-color: var(--color-card-hover-background);
    }
}

@media (max-width: calc(#{$critical-width} + #{$sidebar-margin} * 2)) {
    .search-fallback-button {
        display: flex;
    }
}
</style>
