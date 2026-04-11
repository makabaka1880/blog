<template>
    <div v-for="(value, sidx) in line" :key="sidx" class="chessline-turn">
        <Chessturn :idx="idx + sidx + 1" :turn="value" :foldable="foldable" :linear="false" />
    </div>
</template>

<script lang="ts" setup>
import type { Line } from '~/utils/chessline/parser';

const props = defineProps<{ idx: number, line: Line, foldable?: boolean }>();
</script>
<style lang="scss" scoped></style>
