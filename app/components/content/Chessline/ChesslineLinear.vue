<template>
    <div class="line">
        <template v-for="(value, sidx) in line" :key="sidx">
            <Chessturn :idx="idx + sidx + 1" :turn="value" :foldable="foldable" :linear="true" />
        </template>
    </div>
</template>

<script lang="ts" setup>
import type { Turn } from '~/utils/chessline/parser';

const props = defineProps<{ idx: number, line: Turn[], foldable?: boolean }>();
</script>

<style lang="scss" scoped>
.line {
    line-height: 1.8;
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
}
</style>
