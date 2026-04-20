<template>
    <div class="friendscard">
        <p>{{ name }}</p>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    name: string
}>();
</script>

<style lang="scss" scoped></style>