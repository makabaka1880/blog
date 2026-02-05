<template>
  <div class="default-layout">
    <div class="nav-bar">
      <UIKitNav :title="config?.title" />
    </div>
    <div class="content">
      <UIKitSafeArea>
        <slot />
      </UIKitSafeArea>
    </div>
    <UIKitFooter/>
  </div>
</template>

<script lang="ts" setup>
import config from '@@/blog.config';
</script>

<style lang="css" scoped>
.default-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.nav-bar {
  width: 100%;
  height: 3rem;
  position: sticky;
  top: 0;
  z-index: 10;
}

.content {
  flex: 1;
  width: 100%;
  min-height: 100vh;
}
</style>