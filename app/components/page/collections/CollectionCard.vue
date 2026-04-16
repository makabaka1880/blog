<template>
    <div class="collection-card-container">
        <img :src="'/assets/collections/' + props.cover" class="card-bg" alt="" />

        <div class="card-content">
            <h3>{{ props.title }}</h3>
            <p>{{ props.description }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    title: string,
    description: string,
    cover: string
}>()
</script>

<style lang="scss" scoped>
.collection-card-container {
    position: relative;
    width: 100%;
    height: 300px;
    border-radius: 0.5rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    background: var(--surface-elevated);
    transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    box-shadow: none;
    border: 1px black solid;

    &:hover {
        width: 100%;
        color: var(--color-link);
        border-color: var(--color-link);
        background-color: var(--color-card-hover-background);
        box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.15);
        

        cursor: pointer;
    }

    .card-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: 1;
    }

    .card-content {
        position: relative;
        z-index: 2;
        width: 100%;
        padding: 1.2rem;
        border-top: 1px solid #999;
        background-color: var(--color-card-background);
        /* No background color added as requested */
        
        h3 {
            margin: 0;
        }
    }
}
</style>