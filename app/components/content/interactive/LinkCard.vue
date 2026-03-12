<template>
    <a :href="props.url" target="_blank" rel="noopener noreferrer" class="linkcard-container">
        <div class="linkcard-box">
            <img :src="resolvedImage" class="linkcard-image" />
            <div class="linkcard-textarea">
                <strong class="linkcard-title">{{ props.title }}</strong>
                <p class="linkcard-details">{{ props.details ?? "No Details Provided." }}</p>
                <p class="linkcard-url">{{ props.url }}</p>
            </div>
        </div>
    </a>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from '#app';
import { resolveAssetSrc } from '~/utils/route-utils';

const props = defineProps<{
    url: string,
    title: string,
    details: string,
    image: string,
    absolute?: boolean
}>()

const route = useRoute();

const resolvedImage = computed(() => {
    const imageSrc = props.image ?? '/default-image.webp';
    return resolveAssetSrc(imageSrc, route.path, props.absolute);
});
</script>

<style lang="scss" scoped>
.linkcard-container {
    padding: 0.5rem;
    border: 1px solid var(--color-text);
    border-radius: var(--border-radius-box);
    background-color: var(--color-card-background);
    display: block;
    width: 60%;
    margin: 2rem auto;
    height: 5rem;
    overflow: hidden;
    text-decoration: none;
}

.linkcard-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 100%;
    gap: 1.2rem;
}

.linkcard-image {
    height: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    flex-shrink: 0;
    border-radius: calc(var(--border-radius-box));
}

.linkcard-textarea {
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    height: 100%;
}

.linkcard-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
}

.linkcard-details {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
    font-family: inherit;
}

.linkcard-url {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
    font-size: 0.75em;
    opacity: 0.6;
}
</style>