<template>
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
</template>

<script setup lang="ts">
const props = defineProps<{ article: any }>();
</script>

<style lang="scss" scoped>

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
</style>