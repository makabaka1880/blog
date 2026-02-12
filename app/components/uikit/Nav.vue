<template>
    <nav class="nav-bar">
        <div class="nav-left">
            <UtilsNavLink to="/">
                <span class="nav-title" v-if="props.title">Home</span>
            </UtilsNavLink>
            <UtilsNavLink to="/posts">
                <span class="nav-title">Posts</span>
            </UtilsNavLink>
            <UtilsNavLink to="https://github.com/makabaka1880/blog">
                <span class="nav-title">GitHub</span>
            </UtilsNavLink>
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
    padding: 2rem 2rem;
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

    &:hover {
        color: var(--color-navbar-link-hover);
    }
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