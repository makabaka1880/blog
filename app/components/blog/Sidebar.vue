<template>
    <div class="sidebar-container">
        <div class="sidebar-title-bar">
            <img id="avatar-img" src="/favicon.ico" />
            <div class="sidebar-title-bar-titles">
                <h2>Welcome</h2>
            </div>
        </div>
        <div class="sidebar-controls">
            <SearchModal :open="isSearchOpen" @update:open="isSearchOpen = $event" />
            <ClientOnly>
                <button class="color-mode-toggle" type="button" @click="cycleColorMode" :aria-label="colorModeLabel"
                    :title="colorModeLabel">
                    <Icon :name="colorModeIcon" />
                </button>
            </ClientOnly>
        </div>
        <button class="search-button" type="button" @click="isSearchOpen = true">
            <span>
                <Icon name="uil:search" /> Search  all articles...
            </span>
        </button>

        <div v-if="toc" class="toc-section">
            <p class="toc-title">On This Page <a href="#article-top">
                    <Icon name="uil:top-arrow-to-top" />
                </a></p>
            <div class="toc-list">
                <BlogToc :toc="toc" />
                <a href="#twikoo">Comments</a>
            </div>
        </div>
        <div v-else>
            <h2>Recent Posts</h2>
            <div class="recent-posts">
                <NuxtLink v-for="article in recentArticles" :key="article.path" :to="article.path"
                    class="recent-post-line">
                    {{ article.title }}
                </NuxtLink>
                <NuxtLink to="/articles" class="recent-post-line">
                    All articles →
                </NuxtLink>
            </div>
        </div>
    </div>
</template>


<script lang="ts" setup>
import type { TocLink } from '@nuxtjs/mdc'
import SearchModal from './SearchModal.vue'

defineProps<{ toc: TocLink[] }>()

const recentArticles = ref<any[]>([]);

const isSearchOpen = ref(false)
const colorPref = useColorMode()
const colorModeIcon = computed(() => {
    const pref = colorPref.preference
    if (pref === 'light') return 'uil:sun'
    if (pref === 'dark') return 'uil:moon'
    return 'uil:desktop'
})
const colorModeLabel = computed(() => {
    const pref = colorPref.preference
    if (pref === 'light') return 'Light mode'
    if (pref === 'dark') return 'Dark mode'
    return 'System preference'
})
function cycleColorMode() {
    const modes = ['light', 'system', 'dark'] as const
    const currentIndex = modes.indexOf(colorPref.preference as any)
    colorPref.preference = modes[(currentIndex + 1) % modes.length]!
}

onMounted(async () => {
    const result = await queryCollection('articles').select('title', 'path').order('createTime', 'DESC');
    const allArticles = await result.all();
    recentArticles.value = allArticles.slice(0, 5);
})
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

    .sidebar-controls {
        display: flex;
        flex-direction: row;
    }

    .search-button {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 90%;
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


    .toc-section {
        margin-top: 2rem;

        .toc-list {
            overflow-y: auto;
            max-height: 40vh;
            scrollbar-width: none;
            padding-bottom: 2.5rem;
            mask-image: linear-gradient(to bottom,
                    black calc(100% - 3rem),
                    transparent 100%);
        }

        .toc-title {
            font-size: var(--font-size-sm);
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--color-text-muted);
            margin-bottom: 0.5rem;
        }
    }

    .recent-posts {
        display: flex;
        flex-direction: column;
    }

    .recent-post-line {
        display: block;
        padding: 0.25rem 0;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
}
</style>
