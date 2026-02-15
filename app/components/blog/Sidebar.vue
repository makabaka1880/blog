<template>
    <div class="sidebar-container">
        <div class="sidebar-title-bar">
            <img id="avatar-img" src="/favicon.ico" />
            <div class="sidebar-title-bar-titles">
                <h2> Welcome </h2>
            </div>
        </div>
        <button class="search-button" type="button" @click="isSearchOpen = true">Search</button>
        <SearchModal :open="isSearchOpen" @update:open="isSearchOpen = $event" />
    </div>
</template>

<script lang="ts" setup>
import SearchModal from './SearchModal.vue';

const isSearchOpen = ref(false);
</script>

<style lang="scss" scoped>
@use "~/assets/theme.scss" as *;

.sidebar-container {
    width: $sidebar-width;

    .sidebar-title-bar {
        display: flex;
        align-items: center;
        gap: 1rem;

        .sidebar-title-bar-titles {
            text-align: left
        }

        #avatar-img {
            height: 3rem;
            width: 3rem;
        }
    }

    .search-button {
        margin-top: 1rem;
        border: 0.0625rem solid var(--color-border);
        background: var(--color-card-bg);
        color: var(--color-text);
        border-radius: 0.25rem;
        padding: 0.5rem 0.75rem;
        cursor: pointer;
        font-size: var(--font-size-md);
    }
}
</style>
