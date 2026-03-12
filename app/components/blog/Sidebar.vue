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
        <ClientOnly>
            <button class="color-mode-toggle" type="button" @click="cycleColorMode" :aria-label="colorModeLabel"
                :title="colorModeLabel">
                <Icon :name="colorModeIcon" />
            </button>
        </ClientOnly>
        
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

const colorModeIcon = computed(() => {
    const pref = colorPref.preference;
    if (pref === 'light') return 'uil:sun';
    if (pref === 'dark') return 'uil:moon';
    return 'uil:desktop';
});

const colorModeLabel = computed(() => {
    const pref = colorPref.preference;
    if (pref === 'light') return 'Light mode';
    if (pref === 'dark') return 'Dark mode';
    return 'System preference';
});

function cycleColorMode() {
    const modes = ['light', 'system', 'dark'] as const;
    const currentIndex = modes.indexOf(colorPref.preference as any);
    const nextIndex = (currentIndex + 1) % modes.length;
    colorPref.preference = modes[nextIndex]!;
}

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
        background: var(--color-card-background);
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
            background-color: var(--color-card-hover-background);
        }
    }

    .color-mode-toggle {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        margin-top: 1.5rem;
        border-radius: 12px;
        border: none;
        background: none;
        color: var(--color-text);
        cursor: pointer;
        transition: color 0.2s ease-in-out;
        padding: 0;

        svg {
            width: 20px;
            height: 20px;
            color: currentColor;
            transition: transform 0.3s ease-in-out;
        }

        &:hover {
            color: var(--color-link);

            svg {
                transform: rotate(20deg);
            }
        }

        &:active {
            svg {
                transform: rotate(360deg);
            }
        }

        &:focus {
            outline: 2px solid var(--color-primary);
            outline-offset: 2px;
        }
    }

    p {
        margin-top: 5rem; // TODO: REMOVE
    }
}
</style>
