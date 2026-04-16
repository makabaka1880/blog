<template>
    <div class="container">
        <div class="hero">
            <h1>Collections</h1>
            <p>{{ config.description }}</p>
            <button class="search-fallback-button" type="button" @click="isSearchOpen = true">
                <span>
                    <Icon name="uil:search" /> Search
                </span>
            </button>
        </div>
        <div class="collection-list-wrapper">
            <div class="year-art-container">
                <div v-for="collection in collections" :key="collection.path" class="collection-item">
                    <NuxtLink :to="collection.stem">
                        <CollectionCard :title="collection.name" :cover="collection.cover"
                            :description="collection.description" />
                    </NuxtLink>
                </div>
            </div>
        </div>
        <SearchModal :open="isSearchOpen" @update:open="isSearchOpen = $event" />
    </div>
</template>

<script setup lang="ts">
import config from '@@/blog.config';
import { ref, computed, onMounted } from 'vue';
import SearchModal from '~/components/blog/SearchModal.vue';
import CollectionCard from '~/components/page/collections/CollectionCard.vue';

const collections = ref<any[]>([]);
const isSearchOpen = ref(false);

onMounted(async () => {
    const result = await queryCollection('collections').select('name', 'description', 'entries', 'stem', 'cover').order('name', 'DESC');
    collections.value = await result.all();
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

    .collection-list-wrapper {

        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));

        .year-art-container {
            .collection-item {
                margin-bottom: 1.5rem;

                :deep(*) {
                    text-decoration: none;
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

}

@media (max-width: calc(#{$critical-width} + #{$sidebar-margin} * 2)) {
    .search-fallback-button {
        display: flex;
    }
}
</style>
