<template>
    <section class="latest-posts">
        <h2>Latest Posts</h2>
        <div class="article-list">
            <div v-for="article in articles" :key="article.path" class="article-item">
                <NuxtLink :to="article.path" class="content-entry">
                    <small>{{ new Date(article.createTime).toLocaleDateString() }}</small>
                    <strong>{{ article.title }}</strong>
                </NuxtLink>
            </div>
            <div class="article-item">
                <a href="/posts">More -> </a>
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
const props = defineProps<{
    articles: any[];
}>();
</script>

<style lang="scss" scoped>
.latest-posts {
    margin-top: 3rem;

    h2 {
        margin-bottom: 1.5rem;
    }
}

.article-list {
    text-align: left;

    .article-item {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 1rem;
        align-items: start;
        padding: 0.75rem;
        transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

        &:hover {
            background-color: var(--color-card-hover-bg);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .content-entry {
            display: contents;
            text-decoration: none;
            color: inherit;

            small {
                color: var(--text-muted);
                font-size: 0.875rem;
                white-space: nowrap;
            }

            strong {
                font-weight: 600;
            }
        }
    }

    .article-item:last-child {
        border: none;
        background: none;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
}
</style>