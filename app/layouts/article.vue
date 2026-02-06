<template>
    <div class="article-layout">
        <div class="nav-bar">
            <UIKitNav :title="config?.title" />
        </div>
        <div class="content">
            <UIKitSafeArea>
                <slot />
            </UIKitSafeArea>
        </div>
        <div class="footer">
            <UIKitFooter />
        </div>
    </div>
</template>

<script lang="ts" setup>
import config from '@@/blog.config';
const route = useRoute()

const { data: page } = await useAsyncData(route.path, () => {
    return queryCollection('articles').path(route.path).first()
})
import adjacentPosts from '~/static/adjacency.json'
const posts = computed(() => (adjacentPosts as Record<string, any>)[page.value?.path ?? ''] ?? [])
console.log(posts.value.neighbors)
</script>

<style lang="scss" scoped>
.article-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.nav-bar {
    width: 100%;
    height: 3rem;
    position: sticky;
    top: 0;
    z-index: 10;
}

.footer {
    width: 100%;
}

.content {
    flex: 1;
    width: 100%;
    position: relative;
    z-index: 1;
}

:deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
    font-size: 0.95rem;
}

:deep(p) {
    margin-bottom: 0.5rem;
}

:deep(.box-container) {
    width: 50vw;
}
</style>