<template>
    <div class="prose-img-container">
        <div class="prose-img-square">
            <nuxt-img :src="resolvedSrc" :alt="alt" />
        </div>
        <p class="prose-img-caption">{{ alt }}</p>
    </div>
</template>

<script setup>
const props = defineProps({
    src: { type: String, required: true },
    alt: { type: String, default: "" },
    absolute: { type: Boolean, default: false },
});

const route = useRoute();
const resolvedSrc = computed(() => {
    if (props.absolute) return props.src;
    const pathSegments = route.path.split('/').filter(Boolean);
    const slug = pathSegments.slice(1).join('/');
    const tail = props.src.replace(/^\/+/, "");
    return `/assets/${slug}/${tail}`;
});
</script>

<style lang="scss" scoped>
.prose-img-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 2rem auto;
    width: 100%;           // parent width defined

    .prose-img-caption {
        opacity: 0.8;
        font-size: 0.8rem;
        margin-top: 0.6rem;
        text-align: center;
    }

    .prose-img-square {
        width: 70%;               // 70% of parent
        aspect-ratio: 1 / 1;      // perfect square
        display: flex;
        justify-content: center;
        align-items: center;

        img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            border-radius: 1rem;
            display: block;
        }
    }
}

@media (max-width: 860px) {
    .prose-img-square {
        width: 90%;              // bigger square on mobile
    }
}
</style>