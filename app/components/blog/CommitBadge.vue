<template>
    <a :href="'https://github.com/makabaka1880/blog/commit/' + props.hash">
        <div class="commit-badge">
            <small>COMMIT #{{ props.hash }} -></small>
        </div>
    </a>
</template>

<script setup lang="ts">
const props = defineProps<{ hash: string }>();
</script>

<style lang="scss" scoped>
.commit-badge {
    background-color: var(--color-card-background);

    small {
        margin: 0 0;
    }

    padding: .4rem;
    width: max-content;

    border: 1px var(--color-card-border) solid;
    border-radius: 0.5rem;
}
</style>