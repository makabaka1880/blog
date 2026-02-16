<template>
    <div class="sidebar-container">
        <div class="sidebar-title-bar">
            <img id="avatar-img" src="/favicon.ico" />
            <div class="sidebar-title-bar-titles">
                <h2> Welcome </h2>
            </div>
        </div>
        <button class="search-button" type="button" @click="isSearchOpen = true">
            <span>
                <Icon name="uil:search" /> Search
            </span>
        </button>
        <SearchModal :open="isSearchOpen" @update:open="isSearchOpen = $event" />
        <div>
            <h1>Color mode: {{ $colorMode.value }}</h1>
            <select v-model="$colorMode.preference">
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="sepia">Sepia</option>
            </select>
        </div>
        <p>
            SITE UNDER DEVELOPMENT. <br /><br />
            COOL EFFECTS ARE REMOVED.<br /><br />
            COME AGAIN ANOTHER DAY.
        </p>
    </div>
</template>

<script lang="ts" setup>
import SearchModal from './SearchModal.vue';

const isSearchOpen = ref(false);
const colorPref = useColorMode();

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
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 78%;
        margin-top: 1rem;
        border: 0.0625rem solid var(--color-border);
        background: var(--color-card-bg);
        color: var(--color-text);
        border-radius: 0.25rem;
        padding: 0.5rem 0.75rem;
        cursor: pointer;
        font-size: var(--font-size-md);
        transition: width 0.1s ease-in-out;
        will-change: width;

        span {
            display: inline-flex;
            align-items: center;
            gap: 0.375rem;
        }

        &:hover {
            width: 100%;
            color: var(--color-link);
            border-color: var(--color-link);
            background-color: var(--color-card-hover-bg);
        }
    }

    p {
        margin-top: 5rem; // TODO: REMOVE
    }
}
</style>
