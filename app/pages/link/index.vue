<template>
    <div class="container">
        <div class="hero">
            <h1 class="link-header">Links</h1>
            <p>Say hi to my friends and check out their blogs!</p>
        </div>
        <div class="links-grid">
            <FriendCard v-for="entry in links" :key="entry.name" :name="entry.name" :sitename="entry.sitename"
                :description="entry.description" :avater="entry.avatar" :site="entry.site">
            </FriendCard>
        </div>
    </div>
</template>

<script setup lang="ts">
import blogConfig from '@@/blog.config'
import FriendCard from '~/components/page/friends/FriendCard.vue';
const links = blogConfig.links
</script>

<style scoped>
.container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .hero {
        margin: var(--section-margin);
    }

    .links-container {
        margin: 0 auto;
        padding: 0;
    }

    .links-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(18.75rem, 1fr));
        gap: 1.5rem;
    }
}
</style>
