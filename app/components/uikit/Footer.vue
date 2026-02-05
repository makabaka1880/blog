<template>
    <div class="footer" v-if="floryBlogFooter?.length">
        <div class="footer-list" v-for="(group, index) in floryBlogFooter" :key="index">
            <p class="footer-title">{{ group.title }}</p>
            <div class="footer-content">
                <p v-for="(item, i) in group.items" :key="i">
                    <a :href="item.link">{{ item.name }}</a>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import floryBlogConfig from '@@/blog.config'
const { footer: floryBlogFooter } = floryBlogConfig || {}
</script>

<style scoped>
.footer {
    padding: 2rem 10rem;
    background-color: #e4dada;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 4rem;
}

.footer-list {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 2rem;
}

.footer-title {
    font-weight: bold;
}

a {
    color: inherit;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}
</style>
