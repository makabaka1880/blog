<template>
    <div class="default-layout">
        <div class="nav-bar">
            <UIKitNav :title="config?.title" />
        </div>
        <div class="content">
            <slot />
        </div>
        <div class="footer">
            <UIKitFooter />
        </div>
    </div>
</template>

<script lang="ts" setup>
import config from '@@/blog.config';
</script>

<style lang="css" scoped>
.default-layout {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;
}

.nav-bar {
    width: 100%;
    height: var(--navbar-height);
    position: fixed;
    top: var(--navbar-top-offset);
    z-index: var(--navbar-z-index);
}

.content {
    flex: 1 1 auto;
    width: 100%;
}
</style>
