<template>
    <div class="box-container">
        <div class="quesbox-container">
            <span class="quesbox-Q">Q</span>
            <div class="quesbox-content">
                <b> Problem. </b>
                <slot />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    id: { type: String }
})
const title = computed(() => {
    return props.id!
})
</script>

<style lang="scss" scoped>
@use '~/assets/theme' as *;

.quesbox-container {
    background-color: var(--color-defbox-bg);
    padding: 1em;
    border: 1.2px var(--color-border) solid;
    border-radius: .5rem;
    box-shadow: 1px 1px 2px;
    margin: 1rem 0;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.quesbox-Q {
    font-size: 5rem;
    width: min-content;
    margin: 0 1rem 0 0;
    opacity: 0.6;
}

.quesbox-content {
    width: 100%;
}

@media (max-width: $critical-width) {
    .quesbox-container {
        flex-direction: column;
        margin: 0 0;
        width: 100%;
    }
}
</style>