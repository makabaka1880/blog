<template>
    <BaseBox :background-char="'\u{1F4A1}'" :box-type="'hint'" :box-class="`hint-box`">
        <template #header>
            HINT
        </template>
        <slot />
    </BaseBox>
</template>

<script lang="ts" setup>
import BaseBox from './BaseBox.vue'

</script>

<style lang="scss" scoped>
.hint-box {
    --box-bg-char-opacity: 0.15;
    --box-bg-char-filter: saturate(0);
}
</style>
