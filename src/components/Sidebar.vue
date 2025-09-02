<template>
  <div class="sidebar">
    <div class="sidebar-title">
      <img class="sidebar-avatar" src="/Avatar.webp" />
      <RouterLink to="/">
        <h1 class="title">Blog by Makabaka1880</h1>
      </RouterLink>
    </div>
    <div class="sidebar-content">
      <div class="sidebar-contacts">
        <div class="sidebar-links">
          <a href="https://github.com/Makabaka1880" target="_blank">
            <SocialMedia name="github" width="1.5rem" height="1.5rem" color="" />
          </a>
          <a href="https://github.com/Makabaka1880" target="_blank">
            <SocialMedia name="zhihu" width="1.5rem" height="1.5rem" />
          </a>
          <a href="https://github.com/Makabaka1880" target="_blank">
            <SocialMedia name="bilibili" width="1.5rem" height="1.5rem" />
          </a>
        </div>
        <a href="mailto:makabaka1880@outlook.com">Email</a>
      </div>
      <hr />
      <h3>Recent Posts</h3>
      <div v-for="post in recentPosts" :key="post.id">
        <router-link :to="`${post.destination}`">
          {{ post.title }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import SocialMedia from './icons/SocialMedia.vue'

interface Post {
  id: string
  title: string
  destination: string
}

export default defineComponent({
  name: 'Sidebar',
  components: {
    SocialMedia,
  },
  props: {
    recentPosts: {
      type: Array as PropType<Post[]>,
      default: () => [],
    },
  },
})
</script>
