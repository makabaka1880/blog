<template>
    <div class="footer-container">
        <p> All Rights Reserved © {{ (new Date()).getFullYear() }} Sean L.</p>
        <p> Powered by Teal Blog - Evolved From <a href="https://aflory.com">AFlory Blog</a></p>
    </div>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
.footer-container {
    display: flex;
    flex-direction: column;
    width: 100%;
}
</style>