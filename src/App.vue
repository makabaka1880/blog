<template>
  <div class="page-under-development">
    <Banner />
    <div class="app">
      <Sidebar :recentPosts="recentPosts" />
      <div>
        <router-view class="content" />
        <footer>
          <hr />
          <span>Created by Sean L.</span>
          <br /><br />
          <span>All Rights Reserved, Makabaka © 2025</span>
        </footer>
      </div>
      <div class="meta">
        <h1>Info</h1>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from './components/Sidebar.vue'
import Banner from './components/Banner.vue'

const recentPosts = ref([{ id: 0, title: 'Home Page', description: 'Home Page', destination: '/' }])
</script>
