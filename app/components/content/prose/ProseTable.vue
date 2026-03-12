<template>
    <div class="prose-table-wrapper">
        <table class="prose-table">
            <slot />
        </table>
    </div>
</template>

<style lang="scss" scoped>
.prose-table-wrapper {
    overflow-x: auto;
    margin: 1.5rem 0;
}

.prose-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 100%;

    :deep(thead) {
        border-top: 0.125rem solid var(--color-card-border);
        border-bottom: 0.125rem solid var(--color-card-border);
    }

    :deep(tbody) {
        border-bottom: 0.125rem solid var(--color-card-border);
    }

    :deep(th),
    :deep(td) {
        padding: 0.75rem 1rem;
        text-align: left;
        white-space: nowrap;
    }

    :deep(th) {
        font-weight: 600;
        // background-color: var(--color-table-header-background);
    }

    :deep(tr) {
        border: none;
    }
}
</style>
