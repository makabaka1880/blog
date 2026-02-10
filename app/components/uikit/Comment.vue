<template>
    <div>
        <h2>Comments</h2>
        <div id="tcomment">
            Comments Loading...
        </div>
    </div>
</template>

<script lang="ts" setup>
const appConfig = useAppConfig()

console.log(appConfig.twikooConfig.envID)
onMounted(() => {
    window.twikoo?.init({
        envId: appConfig.twikooConfig.envID,
        el: "#tcomment"
    })
})
</script>

<style lang="scss" scoped>
:deep(.twikoo) button {
    background-color: var(--color-accent)
}
</style>