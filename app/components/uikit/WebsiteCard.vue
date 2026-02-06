<template>
    <a v-if="to" :href="to" target="_blank" rel="noopener noreferrer" class="website-card-wrapper">
        <div class="website-card">
            <div v-if="image" class="website-card-image">
                <img :src="image" :alt="title || 'Card image'">
            </div>
            <div class="website-card-content">
                <div v-if="icon" class="website-card-icon">
                    <span>{{ icon }}</span>
                </div>
                <div>
                    <h3 v-if="title" class="website-card-title">{{ title }}</h3>
                    <p v-if="subtitle" class="website-card-subtitle">{{ subtitle }}</p>
                </div>
                <p v-if="desc" class="website-card-desc">{{ desc }}</p>
            </div>
        </div>
    </a>
    <div v-else class="website-card-wrapper">
        <div class="website-card">
            <div v-if="image" class="website-card-image">
                <img :src="image" :alt="title || 'Card image'">
            </div>
            <div class="website-card-content">
                <div v-if="icon" class="website-card-icon">
                    <span>{{ icon }}</span>
                </div>
                <div>
                    <h3 v-if="title" class="website-card-title">{{ title }}</h3>
                    <p v-if="subtitle" class="website-card-subtitle">{{ subtitle }}</p>
                </div>
                <p v-if="desc" class="website-card-desc">{{ desc }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    title?: string,
    subtitle?: string,
    desc?: string,
    image?: string,
    icon?: string,
    to?: string
}>()
</script>

<style scoped>
.website-card-wrapper {
    text-decoration: none;
    color: inherit;
    display: block;
    user-select: none;
}

.website-card {
    display: flex;
    flex-direction: column;
    background: var(--color-card-bg);
    border: 1.6px solid var(--color-border);
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s ease;
}

.website-card:hover {
    /* transform: translateY(-2px); */
    /* box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); */
}

.website-card-image {
    width: 100%;
    height: 160px;
    overflow: hidden;
}

.website-card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.website-card-content {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.website-card-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--color-primary);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    font-weight: bold;
}

.website-card-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text);
    margin: 0;
}

.website-card-subtitle {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    margin: 0.25rem 0 0;
}

.website-card-desc {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    line-height: 1.5;
    margin: 0;
}

/* For non-link cards */
div.website-card-wrapper .website-card {
    cursor: default;
}
</style>
