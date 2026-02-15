<template>
    <nav class="nav-bar">
        <div class="nav-left">
            <div id="nav-path">
                <span v-for="{text, route} in components">
                    <a :href="route">{{ text }}</a> /
                </span>
            </div>
        </div>
        <div class="nav-right">
            <UtilsNavLink to="/">
                <span class="nav-title" v-if="props.title">Home</span>
            </UtilsNavLink>
            <UtilsNavLink to="/articles">
                <span class="nav-title">Articles</span>
            </UtilsNavLink>
            <UtilsNavLink to="https://github.com/makabaka1880/blog">
                <span class="nav-title">GitHub</span>
            </UtilsNavLink>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { useRoute } from '#app';

const props = defineProps<{ title?: string }>()

const route = useRoute();
const components = computed(() => {
    const parts = route.path.split('/').filter((x) => x.length > 0);
    return [{text: "~", route: "/"}, ...parts.map((text, index) => ({
        text,
        route: `/${parts.slice(0, index + 1).join('/')}/`,
    }))];
});
console.log(components.value);

</script>

<style scoped>
.nav-bar {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* background-color: var(--color-navbar-bg); */
    mask: linear-gradient(black, black, transparent);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    padding: 3rem 2rem;
    transition: all 0.2s ease-in-out;
    user-select: none;

}

a {
    text-decoration: none;
    color: var(--color-navbar-link);
    padding: 0 1.5rem;
    /* border: 0.125rem solid transparent; */
    transition: all 0.2s ease-in-out;
    font-size: var(--font-size-lg);

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
