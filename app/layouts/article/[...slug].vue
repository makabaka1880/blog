<template>
  <div class="article-view">
    <div class="article-header">
      <h1>{{ page?.title }}</h1>
      <p>{{ page?.description }}</p>
    </div>
    <div class="article-container">
      <ContentRenderer v-if="page" :value="page" />
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'article'
})

import { useHead, inject } from '#imports'
const route = useRoute()

const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('articles').path(route.path).first()
})

const rightImage = inject('rightImage')

// Dynamically set theme variables
watch(() => page.value?.theme, (theme: any) => {
  if (!theme) return

  // Update images in layout
  if (rightImage) {
    rightImage.value = theme.rightImage
  }

  useHead({
    style: [{
      innerHTML: `
        :root {
          --color-heading: ${theme.colorHeading} !important;
          --color-text: ${theme.colorText} !important;
          --color-background: ${theme.colorBackground} !important;
          --color-navbar-bg: ${theme.colorNavbarBg} !important;
          --color-navbar-link: ${theme.colorNavbarLink} !important;
          --color-navbar-link-hover: ${theme.colorNavbarLinkHover} !important;
        }
      `,
      tagPriority: 'high'
    }]
  })
}, { immediate: true })
</script>

<style lang="css" scoped>
.article-view {
  height: 100%;
  color: var(--color-text);
  background-color: transparent;
  position: relative;
}

.article-header {
  margin: var(--section-margin);
}
</style>