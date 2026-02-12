<template>
    <span class="prose-img-container image-like">
        <nuxt-img :src="resolvedSrc" :alt="alt" class="image-like-content" />
        <div v-if="alt" class="prose-img-caption">
            <strong>Fig.</strong>
            <span class="caption-text">{{ alt }}</span>
        </div>
    </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from '#app';

const props = defineProps({
    src: { type: String, required: true },
    alt: { type: String, default: "" },
    absolute: { type: Boolean, default: false },
});

const route = useRoute();

const resolvedSrc = computed(() => {
    if (props.absolute) return props.src;

    // Use a try-catch or a fallback for route.path safety
    const currentPath = route.path || '';
    const pathSegments = currentPath.split('/').filter(Boolean);

    // Safety check: ensure we don't slice an empty array
    const slug = pathSegments.length > 1 ? pathSegments.slice(1).join('/') : '';
    const tail = props.src.replace(/^\/+/, "");

    return `/assets/${slug}/${tail}`;
});
</script>

<style lang="scss" scoped>
.prose-img-container {
    margin: 2rem auto;
    display: flex;
    flex-direction: column;
    align-items: center;

    .prose-img-caption {
        margin-top: 0.5rem;
        display: block;
        width: max-content;
        text-align: center;

        span {
            margin-left: 0.25rem;
        }
    }
}

.image-like-content {
    display: block;
    width: 80%;
    border-radius: 1rem;
    height: auto; // Ensure aspect ratio doesn't pop during hydration
}
</style>