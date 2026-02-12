<template>
    <NuxtLink v-if="latestArticle" :to="latestArticle.path" class="start-button">
        <span class="button-text">{{ buttonText }}</span>
    </NuxtLink>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
    articles: any[];
    buttonText?: string;
}>(), {
    buttonText: 'Start Reading',
});

const latestArticle = computed(() => {
    if (!props.articles || props.articles.length === 0) return null;
    return props.articles[0];
});
</script>

<style lang="scss" scoped>
@use '~/assets/theme.scss' as *;

.start-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 2rem;
    background-color: var(--color-button-bg);
    color: var(--color-button-text);
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.2s ease-in-out;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    &:hover {
        background-color: var(--color-button-hover);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    &:active {
        transform: translateY(0);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .button-text {
        font-size: 1rem;
    }
}
</style>