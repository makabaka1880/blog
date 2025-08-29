<template>
<div class="app">
    <div class="sidebar">
    <div class="sidebar-title">
        <img class="sidebar-avatar" src="/Avatar.webp" />
        <RouterLink j to="/">
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
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SocialMedia from './components/icons/SocialMedia.vue'

const recentPosts = ref([
{ id: 3, title: 'Home Page', description: 'Description for Post 3', destination: "/"},
]) // dummy data for testing
</script>
