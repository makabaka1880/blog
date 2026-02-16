<template>
    <nav ref="navRef" class="nav-bar">
        <div class="nav-left">
            <div id="nav-path">
                <span v-for="{ text, route } in components" :key="route">
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

        <button class="nav-menu-toggle" type="button" @click="toggleMenu" aria-label="Toggle navigation menu">
            ☰
        </button>

        <Transition name="nav-popover">
            <div v-if="menuOpen" class="nav-popover">
                <UtilsNavLink to="/" @click="closeMenu">Home</UtilsNavLink>
                <UtilsNavLink to="/articles" @click="closeMenu">Articles</UtilsNavLink>
                <UtilsNavLink to="https://github.com/makabaka1880/blog" @click="closeMenu">GitHub</UtilsNavLink>
            </div>
        </Transition>
    </nav>
</template>

<script setup lang="ts">
import { useRoute } from '#app';

const props = defineProps<{ title?: string }>()

const route = useRoute();
const navRef = ref<HTMLElement | null>(null);
const menuOpen = ref(false);

const components = computed(() => {
    const parts = route.path.split('/').filter((x) => x.length > 0);
    return [{ text: "~", route: "/" }, ...parts.map((text, index) => ({
        text,
        route: `/${parts.slice(0, index + 1).join('/')}/`,
    }))];
});

const closeMenu = () => {
    menuOpen.value = false;
};

const toggleMenu = () => {
    menuOpen.value = !menuOpen.value;
};

const handleDocumentClick = (event: MouseEvent) => {
    if (!menuOpen.value || !navRef.value) return;
    const target = event.target as Node | null;
    if (target && !navRef.value.contains(target)) {
        closeMenu();
    }
};

watch(() => route.path, () => closeMenu());

onMounted(() => {
    document.addEventListener('click', handleDocumentClick);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleDocumentClick);
});
</script>

<style lang="scss" scoped>
@use "~/assets/theme.scss" as *;

.nav-bar {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 3rem 2rem;
    transition: all 0.2s ease-in-out;
    user-select: none;
    position: relative;
    isolation: isolate;
    overflow: visible;

    &::before {
        content: "";
        position: absolute;
        inset: 0;
        mask: linear-gradient(black, black, transparent);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        pointer-events: none;
        z-index: 0;
    }
}

.nav-left a,
.nav-right a,
.nav-popover a {
    text-decoration: none;
    color: var(--color-navbar-link);
    transition: all 0.2s ease-in-out;
    font-size: var(--font-size-lg);

    &:hover {
        color: var(--color-navbar-link-hover);
    }
}

.nav-right a {
    padding: 0 1.5rem;
}

.nav-left,
.nav-right,
.nav-menu-toggle,
.nav-popover {
    position: relative;
    z-index: 1;
}

.nav-right {
    margin-left: 1rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    justify-content: flex-end;
}

.nav-menu-toggle {
    display: none;
    border: none;
    background: none;
    color: var(--color-navbar-link);
    border-radius: 0.25rem;
    padding: 0.25rem 0.5rem;
    cursor: pointer;
    font-size: var(--font-size-lg);
    line-height: 1;
    transform: scale(1);
    transition: transform 0.2s ease-in-out, color 0.2s ease-in-out;

    &:hover {
        transform: scale(1.06);
        color: var(--color-navbar-link-hover);
    }
}

.nav-popover {
    position: absolute;
    right: 2rem;
    top: calc(100% - 1rem);
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.5rem;
    min-width: 9rem;
    border-radius: 0.5rem;
    border: 0.0625rem solid var(--color-border);
    background: var(--color-card-bg);
    box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.12);
    z-index: 20;

    a {
        display: block;
        padding: 0.375rem 0.5rem;
        border-radius: 0.25rem;

    }
}

.nav-popover-enter-active,
.nav-popover-leave-active {
    transition: opacity 0.2s ease-out, transform 0.2s ease-out;
}

.nav-popover-enter-from,
.nav-popover-leave-to {
    opacity: 0;
    transform: translateY(-0.25rem) scale(0.98);
}

@media (max-width: calc(#{$critical-width} + #{$sidebar-margin} * 2)) {
    .nav-right {
        display: none;
    }

    .nav-menu-toggle {
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
