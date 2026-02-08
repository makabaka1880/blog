<template v-if="totalPages > 1 && totalPages !== undefined">
    <div class="pagination">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="pagination-button">
            上一页
        </button>

        <template v-for="page in displayedPages" :key="page">
            <button v-if="page === '...'" class="pagination-ellipsis" disabled>
                ...
            </button>
            <button v-else @click="changePage(page)" :class="{
                'pagination-button': true,
                'pagination-button-active': page === currentPage
            }">
                {{ page }}
            </button>
        </template>

        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="pagination-button">
            下一页
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    currentPage: number
    totalPages: number
    startPage?: number // 0或1，默认为1
}>()

const startPage = props.startPage ?? 1

const emit = defineEmits<{
    (e: 'page-change', page: number): void
}>()

const maxVisiblePages = 5

const displayedPages = computed<(number | '...')[]>(() => {
    const pages: (number | '...')[] = []
    const { currentPage, totalPages } = props

    // Always show first page
    pages.push(1)

    // Show pages around current page
    const startPage = Math.max(2, currentPage - 1)
    const endPage = Math.min(totalPages - 1, currentPage + 1)

    if (startPage > 2) {
        pages.push('...')
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
    }

    if (endPage < totalPages - 1) {
        pages.push('...')
    }

    // Always show last page if different from first
    if (totalPages > 1) {
        pages.push(totalPages)
    }

    return pages
})

function changePage(page: number) {

    emit('page-change', page)
}
}
</script>

<style scoped>
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin-top: 2rem;
    user-select: none;
}

.pagination-button {
    padding: 0.5rem 1rem;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background: var(--color-card-bg);
    cursor: pointer;
    transition: all 0.2s ease;
}

.pagination-button:hover:not(:disabled) {
    background: var(--color-border);
}

.pagination-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.pagination-button-active {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
}

.pagination-ellipsis {
    padding: 0.5rem;
    border: none;
    background: transparent;
}
</style>
