<template>
    <main class="container">
        <h1>Friends</h1>
        <div v-for="friend in friends">
            <FriendCard :name="friend.name" />
        </div>
    </main>
</template>

<script setup lang="ts">
import FriendCard from '~/components/page/friends/FriendCard.vue';

const friends = computedAsync(async () => {
    const res = await queryCollection("friends").select('name').all()
    return res
})
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 2rem 0;
}
</style>