<template>
    <div>
        <h2 style="margin-bottom: 1.5rem;">Comments</h2>
        <div id="tcomment">
            Comments Loading...
        </div>
    </div>
</template>

<script lang="ts" setup>
const appConfig = useAppConfig()

onMounted(() => {
    window.twikoo?.init({
        envId: appConfig.services.twikooConfig.endpoint,
        el: "#tcomment"
    })
})
</script>

<style lang="scss" scoped>
:deep(.twikoo) button {
    background-color: var(--color-accent)
}
</style>