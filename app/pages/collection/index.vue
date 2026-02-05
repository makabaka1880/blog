<template>
    <div class="collection-header">
        <h1>合集</h1>
    </div>
    <div class="collections-list">
            <UIKitCard
                v-for="col in floryBlogCollections"
                :key="col.id"
                :title="col.name"
                :subtitle="col.desc"
            />
    </div>
</template>

<script setup lang="ts">
import floryBlogConfig from '@@/blog.config'
const floryBlogCollections = floryBlogConfig.collections
</script>

<style scoped>
.collection-header {
    margin: var(--section-margin);
}

.collections-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
}
</style>
