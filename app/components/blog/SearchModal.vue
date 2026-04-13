<template>
    <Teleport to="body">
        <div v-if="open" class="search-modal" @click.self="close">
            <div class="search-panel">
                <div class="search-header">
                    <h3>Search</h3>
                    <button class="close-button" type="button" @click="close" aria-label="Close search">Close</button>
                </div>

                <div class="search-input">
                    <UIKitSearchField v-model="searchValue" @search="onSearch" />
                </div>

                <div class="search-results">
                    <div v-if="!searchValue" class="helper-text">
                        Type to search titles and content.
                    </div>

                    <template v-else>
                        <NuxtLink v-for="result in searchResult" :key="result.id" :to="result.id" class="result-item"
                            @click="close">
                            <div class="title-bar">
                                <h4
                                    v-html="highlightMatches(result.title, result.matches, undefined, 'search-match-title-mark')">
                                </h4>
                                <small>H{{ result.titles.length + 1 }}</small>
                            </div>
                            <p class="path">{{ result.id }}</p>
                            <p class="preview"
                                v-html="highlightMatches(result.content, result.matches, 200, 'search-match-content-mark')">
                            </p>
                        </NuxtLink>

                        <p v-if="searchResult.length === 0" class="helper-text">
                            No results for "{{ searchValue }}"
                        </p>
                    </template>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import Fuse from 'fuse.js';

type SearchSection = {
    id: string;
    title: string;
    content: string;
    description?: string;
    titles: string[];
};

const props = defineProps<{
    open: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:open', value: boolean): void;
}>();

const searchValue = ref('');
const searchResult = ref<any[]>([]);
const indexedSections = ref<SearchSection[] | null>(null);
let fuse: Fuse<SearchSection> | null = null;

const close = () => {
    emit('update:open', false);
};

const onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && props.open) close();
};

onMounted(() => {
    window.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown);
});

watch(
    () => props.open,
    (isOpen) => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            searchValue.value = '';
            searchResult.value = [];
        }
    }
);

async function ensureIndex() {
    if (fuse) return;
    const sections = await queryCollectionSearchSections('articles');
    indexedSections.value = sections as SearchSection[];
    fuse = new Fuse(indexedSections.value, {
        keys: [
            { name: 'title', weight: 0.5 },
            { name: 'description', weight: 0.3 },
            { name: 'content', weight: 0.2 },
        ],
        isCaseSensitive: false,
        ignoreLocation: true,
        includeScore: true,
        includeMatches: true,
        minMatchCharLength: 2,
        threshold: 0.2,   // tighter — junk fuzzy matches get cut
        useExtendedSearch: true,
        findAllMatches: true,  // don't stop at first match per field
    });
}

async function onSearch() {
    const query = searchValue.value.trim();
    if (!query) {
        searchResult.value = [];
        return;
    }
    await ensureIndex();
    searchResult.value = (fuse?.search(query) ?? []).map((r) => ({
        ...r.item,
        matches: r.matches,
    }));
}

function highlightMatches(text: string, matches: any[] | undefined, maxLength?: number, classname?: string): string {
    if (!matches || !matches.length) {
        return maxLength && text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    const indices: number[][] = [];
    for (const match of matches) {
        if (match.indices) indices.push(...match.indices);
    }

    if (indices.length === 0) {
        return maxLength && text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    indices.sort((a, b) => (a[0] ?? 0) - (b[0] ?? 0));
    const mergedIndices: number[][] = [];
    for (const idx of indices) {
        const [idxStart, idxEnd] = [idx[0] ?? 0, idx[1] ?? 0];
        if (mergedIndices.length === 0 || idxStart > (mergedIndices[mergedIndices.length - 1]![1] ?? 0) + 1) {
            mergedIndices.push(idx);
        } else {
            const lastIdx = mergedIndices[mergedIndices.length - 1]!;
            const lastEnd = lastIdx[1] ?? 0;
            lastIdx[1] = Math.max(lastEnd, idxEnd);
        }
    }

    let result = '';
    let lastIndex = 0;
    for (const [start, end] of mergedIndices) {
        if (start == null || end == null) continue;
        const safeStart = Math.max(0, start);
        const safeEnd = Math.min(text.length - 1, end);
        if (safeEnd < safeStart) continue;
        result += text.substring(lastIndex, safeStart);
        result += `<mark class="${classname || ""}">${text.substring(safeStart, safeEnd + 1)}</mark>`;
        lastIndex = safeEnd + 1;
    }
    result += text.substring(lastIndex);

    if (maxLength && result.length > maxLength) {
        result = result.substring(0, maxLength) + '...';
    }

    return result;
}
</script>

<style scoped lang="scss">
.search-modal {
    position: fixed;
    inset: 0;
    z-index: 40;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 5rem 2rem 2rem;
}

.search-panel {
    width: min(56rem, 100%);
    max-height: calc(100vh - 7rem);
    background: var(--color-card-background);
    border: 0.0625rem solid var(--color-border);
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.search-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border-bottom: 0.0625rem solid var(--color-border);
}

.search-input {
    padding: 1rem 1rem;
}

.search-results {
    overflow: auto;
    padding: 0 1rem 1rem;
}

.result-item {
    display: block;
    padding: 0.75rem;
    border-radius: 0.5rem;
    color: inherit;
    text-decoration: none;

    &:hover {
        background: var(--color-card-hover-background);
    }
}

.title-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}

.path {
    color: var(--color-text-muted);
    font-size: var(--font-size-xs);
}

.preview {
    margin-top: 0.5rem;
}

.helper-text {
    color: var(--color-text-muted);
    padding: 0.5rem 0;
}

.close-button {
    border: 0.0625rem solid var(--color-border);
    background: transparent;
    color: var(--color-text);
    border-radius: 0.25rem;
    padding: 0.5rem 0.75rem;
    cursor: pointer;
}
</style>
