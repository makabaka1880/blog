<template>
    <div class="prose-img-container">
        <div class="prose-img-frame">
            <nuxt-img class="prose-img" :src="resolvedSrc" :alt="alt" />
            <p class="prose-img-caption">{{ alt }}</p>
        </div>
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
    display: block;
    max-width: 30rem;
    margin: 3rem auto;

    .prose-img-frame {
        display: flex;
        flex-direction: column;
        align-items: center;

        .prose-img {
            border-radius: 1rem;
        }

        .prose-img-caption {
            opacity: .8;
            font-size: .8rem;
            margin-top: .6rem;
        }
    }
}
</style>