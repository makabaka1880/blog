<template>
    <div class="links-container">
        <h1 class="link-header">Links</h1>

        <div v-for="category in links" :key="category.title" class="category-section">
            <h2>{{ category.title }}</h2>
            <p v-if="category.subTitle" class="subtitle">{{ category.subTitle }}</p>

            <div class="links-grid">
                <UIKitWebsiteCard v-for="link in category.links" :key="link.url" :title="link.name" :desc="link.desc"
                    :to="link.url" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import blogConfig from '@@/blog.config'
const links = blogConfig.links
</script>

<style scoped>
.links-container {
    margin: 0 auto;
    padding: 0 var(--section-margin);
}

.link-header {
    margin: var(--section-margin);
    color: var(--color-text);
}

.category-section {
    margin-bottom: 2rem;
}

.category-section h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-text);
    margin-bottom: 1rem;
}

.category-section .subtitle {
    font-size: 1rem;
    color: var(--color-text-secondary);
    margin-bottom: 1rem;
}

.links-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
}
</style>