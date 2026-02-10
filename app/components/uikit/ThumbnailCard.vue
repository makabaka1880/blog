<template>
    <NuxtLink v-if="to" :to="to"
        :rel="isExternal ? 'noopener noreferrer' : undefined" :prefetch="prefetch"
        class="card-wrapper">
        <div class="thumbnail-card">
            <h3 class="card-title">{{ title }}</h3>
            <p v-if="desc" class="card-desc">{{ desc }}</p>
            <div v-if="subtitle || updateddate || $slots.footer" class="card-footer">
                <span v-if="subtitle" class="card-subtitle">{{ subtitle }}</span>
                <span v-if="updateddate" class="card-subtitle"><strong>Updated</strong> {{ updateddate }}</span>
                <slot name="footer" />
            </div>
        </div>
    </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    title: string,
    subtitle?: string,
    updateddate?: string,
    desc?: string,
    to?: string,
    type?: string,
    // 新增：允许控制预加载行为
    prefetch?: boolean,
}>()
</script>

<style lang="scss" scoped>
.thumbnail-card {
    display: flex;
    flex-direction: column;
    gap: .75rem;
    border-radius: 1rem;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    user-select: none;
    border: .25px solid var(--color-card-border);

    &:hover {
        background-color: var(--color-card-hover-bg);
    }
}

.card-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text);
}

.card-subtitle {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
}

.card-desc {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    line-height: 1.5;
}

.card-wrapper {
    text-decoration: none;
    color: inherit;
    display: block;
}

// .card-wrapper:hover .thumbnail-card {
//     transform: translateY(-2px);
//     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
// }

div.card-wrapper {
    cursor: default;

    & .thumbnail-card {
        cursor: default;
    }
}

.card-content {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
}

.card-footer {
    padding-top: 0.75rem;
    // border-top: 1px solid var(--color-border);
    font-size: 0.75rem;
    color: var(--color-text-muted);
    display: flex;
    gap: 1rem;
}
</style>