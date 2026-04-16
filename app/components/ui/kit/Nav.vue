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
            <UtilsNavLink v-for="link in navLinks" :key="link.text" :to="link.to">
                <span class="nav-title" v-if="link.text !== 'Home' || props.title">{{ link.text }}</span>
            </UtilsNavLink>
        </div>

        <button class="nav-menu-toggle" type="button" @click="toggleMenu" :aria-label="isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'">
            {{ isMenuOpen ? '✕' : '☰' }}
        </button>

        <!-- Dropdown menu for mobile -->
        <Transition name="dropdown">
            <div v-if="isMenuOpen" class="nav-dropdown">
                <div class="nav-dropdown-backdrop" @click="closeMenu"></div>
                <div class="nav-dropdown-content">
                    <UtilsNavLink v-for="link in navLinks" :key="link.text" :to="link.to" @click="closeMenu">
                        <span class="nav-title" v-if="link.text !== 'Home' || props.title">{{ link.text }}</span>
                    </UtilsNavLink>
                </div>
            </div>
        </Transition>
    </nav>
</template>

<script setup lang="ts">
import { useRoute } from '#app';
import { Transition, computed, ref, watch } from 'vue';
import { onClickOutside } from '@vueuse/core';

const props = defineProps<{ title?: string }>()

const route = useRoute();

const components = computed(() => {
    const parts = route.path.split('/').filter((x) => x.length > 0);
    return [{ text: "~", route: "/" }, ...parts.map((text, index) => ({
        text,
        route: `/${parts.slice(0, index + 1).join('/')}/`,
    }))];
});

// Navigation links data
const navLinks = [
    { text: 'Home', to: '/' },
    { text: 'Articles', to: '/articles' },
    { text: 'Collections', to: '/collections' },
    { text: 'GitHub', to: 'https://github.com/makabaka1880/blog', external: true }
];

const isMenuOpen = ref(false);
const navRef = ref<HTMLElement | null>(null);

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
    isMenuOpen.value = false;
};

// Close menu when clicking outside
onClickOutside(navRef, closeMenu);

// Close menu on route change
watch(() => route.path, () => {
    closeMenu();
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
.nav-right a {
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
.nav-right {
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
        transform: scale(1.16);
        color: var(--color-navbar-link-hover);
    }
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

// Dropdown menu styles
.nav-dropdown {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
    pointer-events: none;
}

.nav-dropdown-backdrop {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    opacity: 1;
    pointer-events: all;
}

.nav-dropdown-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: var(--color-background);
    border-bottom: 1px solid var(--color-border);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(0);
    pointer-events: all;
    display: flex;
    flex-direction: column;
    padding: 1rem 0;
    z-index: 1001;
}


// Dropdown transition animations
.dropdown-enter-from .nav-dropdown-backdrop,
.dropdown-leave-to .nav-dropdown-backdrop {
    opacity: 0;
}
.dropdown-enter-from .nav-dropdown-content,
.dropdown-leave-to .nav-dropdown-content {
    transform: translateY(-100%);
}
.dropdown-enter-to .nav-dropdown-backdrop,
.dropdown-leave-from .nav-dropdown-backdrop {
    opacity: 1;
}
.dropdown-enter-to .nav-dropdown-content,
.dropdown-leave-from .nav-dropdown-content {
    transform: translateY(0);
}
.dropdown-enter-active .nav-dropdown-backdrop,
.dropdown-leave-active .nav-dropdown-backdrop {
    transition: opacity 0.3s ease-in-out;
}
.dropdown-enter-active .nav-dropdown-content,
.dropdown-leave-active .nav-dropdown-content {
    transition: transform 0.3s ease-in-out;
}

// Dropdown links
.nav-dropdown-content a {
    display: block;
    padding: 1rem 2rem;
    text-decoration: none;
    color: var(--color-navbar-link);
    font-size: var(--font-size-lg);
    transition: all 0.2s ease-in-out;
    border-left: 3px solid transparent;

    &:hover {
        color: var(--color-navbar-link-hover);
        background-color: var(--color-bg-subtle);
        border-left-color: var(--color-primary);
    }
}
</style>
