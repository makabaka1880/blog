<template>
    <h4 :id="title">
        <a :href="'#' + title.toLowerCase()" @click.prevent="scrollToAnchor">
            <slot />
        </a>
    </h4>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';

const slots = useSlots();
const title = computed(() => {
    if (slots.default) {
        // The default slot returns an array of VNodes
        const vnodes = slots.default();

        // Concatenate the text content from all child nodes
        let text = "";
        vnodes.forEach(vnode => {
            if (vnode.children) {
                // vnode.children often contains the raw text content
                text += String(vnode.children);
            }
        });
        return text;
    }
    return "";
});

const scrollToAnchor = () => {
    const element = document.getElementById(title.value.toLowerCase());
    if (element) {
        const headerHeight = document.querySelector('header')?.clientHeight || 0; // Adjust based on your header's actual height
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

    &.anchor {
        display: block;
        position: relative;
        top: -100px;
        visibility: hidden;
    }
}
</style>
