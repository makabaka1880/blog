<template>
    <div class="container">
        <div class="hero">
            <h1>Collections</h1>
            <p>{{ config.description }}</p>
        </div>
        <div class="collection-list-wrapper">
            <div v-for="collection in collections" :key="collection.path" class="collection-item">
                <NuxtLink :to="'/collections/' + collection.stem.split('/').slice(1).join('/')">
                    <CollectionCard :title="collection.name" :cover="collection.cover"
                        :description="collection.description" />
                </NuxtLink>
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
        gap: 2.5rem;

        .collection-item {
            :deep(*) {
                text-decoration: none;
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

@media (max-width: $screen-transition-width) {
    .collection-list-wrapper {
        display: flex;
        flex-direction: column;
        width: 100%;
        grid-template-columns: unset;
    }
}
</style>
