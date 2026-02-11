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
            <div v-if="!searchValue" class="article-list">
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
            <div v-else>
                <div class="search-results">
                    <div v-for="result in searchResult" :key="result.id" class="search-result-item">
                        <NuxtLink :to="result.id">
                            <div class="title-bar">
                                <h3 v-html="highlightMatches(result.title, result.matches)"> </h3>
                                <h3 style="color: var(--color-accent); opacity: 0.8;">H{{ result.titles.length + 1 }}</h3>
                            </div>
                            <small>{{ result.id }}</small>
                            <p class="search-preview" v-html="highlightMatches(result.content, result.matches, 200)">
                            </p>
                        </NuxtLink>
                    </div>
                    <div v-if="searchResult.length === 0" class="no-results">
                        <p>No results found for "{{ searchValue }}"</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import config from '@@/blog.config';
import { count } from 'node:console';
import { ref, computed, onMounted } from 'vue';
import Fuse from 'fuse.js'

const searchValue = ref('');
const searchResult = ref<any[]>([]);
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

async function onSearch() {
    const { data } = await useAsyncData('search-data', () => queryCollectionSearchSections('articles'))
    const fuse = new Fuse(data.value!, {
        keys: ['title', 'description', 'content'],
        isCaseSensitive: true,
        ignoreLocation: true,
        minMatchCharLength: 2,
        includeScore: true,
        includeMatches: true,
    })
    const query = toValue(searchValue.value)
    searchResult.value = fuse.search(query).map(r => ({
        ...r.item,
        matches: r.matches
    }));
    console.log(searchResult.value)
}

function highlightMatches(text: string, matches: any[] | undefined, maxLength?: number): string {
    if (!matches || !matches.length) {
        return maxLength && text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    // Find all match indices for this text
    const indices: number[][] = [];
    for (const match of matches) {
        if (match.indices) {
            indices.push(...match.indices);
        }
    }

    if (indices.length === 0) {
        return maxLength && text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    // Sort and merge overlapping indices
    indices.sort((a, b) => (a[0] ?? 0) - (b[0] ?? 0));
    const mergedIndices: number[][] = [];
    for (const idx of indices) {
        const [idxStart, idxEnd] = [idx[0] ?? 0, idx[1] ?? 0];
        if (mergedIndices.length === 0 || idxStart > (mergedIndices[mergedIndices.length - 1]![1] ?? 0) + 1) {
            mergedIndices.push(idx);
        } else {
            const lastIdx = mergedIndices[mergedIndices.length - 1]!;
            const lastEnd = lastIdx[1] ?? 0;
            lastIdx[1] = Math.max(lastEnd, idxEnd);
        }
    }

    // Build highlighted string
    let result = '';
    let lastIndex = 0;
    for (const [start, end] of mergedIndices) {
        if (start == null || end == null) continue;
        const safeStart = Math.max(0, start);
        const safeEnd = Math.min(text.length - 1, end);
        if (safeEnd < safeStart) continue;
        result += text.substring(lastIndex, safeStart);
        result += `<mark>${text.substring(safeStart, safeEnd + 1)}</mark>`;
        lastIndex = safeEnd + 1;
    }
    result += text.substring(lastIndex);

    // Truncate if needed, preserving highlights
    if (maxLength && result.length > maxLength) {
        // Simple truncation - for better UX, could implement context-aware truncation
        result = result.substring(0, maxLength) + '...';
    }

    return result;
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

        .search-results {
            flex: 1;

            .search-result-item {
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
                }

                .search-preview {
                    margin: 0.5rem 0 0 0;
                    color: var(--text-secondary);
                    line-height: 1.6;

                }
            }

            .no-results {
                padding: 2rem;
                text-align: center;
                color: var(--text-muted);
            }
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