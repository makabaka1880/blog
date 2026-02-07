<template>
    <nav class="nav-bar">
        <div class="nav-left">
            <NuxtLink to="/">
                <span class="nav-title" v-if="props.title">Home</span>
            </NuxtLink>
            <NuxtLink to="/about">
                <span class="nav-title">About</span>
            </NuxtLink>
            <NuxtLink to="https://github.com/makabaka1880/blog">
                <span class="nav-title">GitHub</span>
            </NuxtLink>
        </div>
        <div class="nav-right">
            <!-- <NuxtLink v-for="item in navItems" :key="item.route" :to="item.route" class="nav-item">
                <span class="nav-name">{{ item.name }}</span>
            </NuxtLink> -->
        </div>
    </nav>
</template>


<script setup lang="ts">
import navItems from '@@/configs/dev/dev.blog.ui.config'
const props = defineProps<{ title?: string }>()
</script>

<style scoped>
.nav-bar {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--color-navbar-bg);
    padding: 0 2rem;
    transition: all 0.2s ease-in-out;
    user-select: none;
    .nav-title {
        font-size: .8em;
    }
}

a {
    text-decoration: none;
    color: var(--color-navbar-link);
    padding: 0 1.5rem;
    /* border: 2px solid transparent; */
    transition: all 0.2s ease-in-out;
    font-size: 1.2rem;
}

a:hover {
    /* border: 2px solid var(--color-navbar-link-border); */
    color: var(--color-navbar-link-hover);
}

.nav-right {
    margin-left: 1rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: .5rem;
    justify-content: flex-end;
}
</style>