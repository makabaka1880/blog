<template>
    <div class="article-layout">
        <div class="nav-bar">
            <UIKitNav :title="config?.title" />
        </div>
        <div class="content">
            <UIKitSafeArea>
                <template #sidebar>
                    <BlogSidebar />
                </template>
                <template #content>
                    <slot />
                </template>
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
import adjacentArticles from '~/static/adjacency.json'
const articles = computed(() => (adjacentArticles as Record<string, any>)[page.value?.path ?? ''] ?? [])
</script>

<style lang="scss" scoped>
.article-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.nav-bar {
    width: 100%;
    height: var(--navbar-height);
    position: sticky;
    top: var(--navbar-top-offset);
    z-index: var(--navbar-z-index);
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
    font-size: var(--font-size-md);
}


</style>
