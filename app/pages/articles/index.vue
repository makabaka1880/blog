<template>
    <div class="container">
        <div class="hero">
            <h1>Articles</h1>
            <p>{{ config.description }}</p>
        </div>
        <div class="article-list-wrapper">
            <div class="article-list">
                <template v-for="(yearArticles, year) in entriesGrouped" :key="year">
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
    </div>
</template>

<script setup lang="ts">
import config from '@@/blog.config';
import { ref, computed, onMounted } from 'vue';

const articles = ref<any[]>([]);

onMounted(async () => {
    const result = await queryCollection('articles').select('title', 'description', 'createTime', 'path').order('createTime', 'DESC');
    articles.value = await result.all();
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
                        background-color: var(--color-card-hover-bg);
                        box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.15);
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
