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
import { resolveAssetSrc } from '~/utils/route-utils';

const props = defineProps({
    src: { type: String, required: true },
    alt: { type: String, default: "" },
    absolute: { type: Boolean, default: false },
});

const route = useRoute();

const resolvedSrc = computed(() => resolveAssetSrc(props.src, route.path, props.absolute));
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
        width: 80%;
        text-align: center;

        span {
            margin-left: 0.25rem;
        }
    }
}

.image-like-content {
    display: block;
    width: 80%;
    border-radius: var(--border-radius-image);
    height: auto; // Ensure aspect ratio doesn't pop during hydration
}
</style>