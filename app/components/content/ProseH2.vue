<template>
    <h2 :id="slug">
        <a :href="'#' + slug" @click.prevent="scrollToAnchor">
            <slot />
        </a>
    </h2>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';

const slots = useSlots();

function convertToSlug(text: string) {
    return text.toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
}

const title = computed(() => {
    if (slots.default) {
        const vnodes = slots.default();
        let text = "";
        vnodes.forEach(vnode => {
            if (vnode.children) {
                text += String(vnode.children);
            }
        });
        return text;
    }
    return "";
});

const slug = computed(() => convertToSlug(title.value));

const scrollToAnchor = () => {
    const element = document.getElementById(slug.value);
    if (element) {
        const headerHeight = document.querySelector('header')?.clientHeight || 0;
        window.scrollTo({
            top: element.offsetTop - headerHeight,
            behavior: 'smooth'
        });
    }
};
</script>

<style lang="scss" scoped>
h2 {
    margin-top: 2rem;
    font-weight: 700;

    &.anchor {
        display: block;
        position: relative;
        top: -6.25rem;
        visibility: hidden;
    }
}
</style>
