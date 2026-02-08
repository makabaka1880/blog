<template>
    <div v-for="(value, sidx) in line" :key="sidx">
        <Chessturn :idx="idx + sidx + 1" :turn="value" />
    </div>
</template>

<script lang="ts" setup>
import type { Line } from '~/utils/chessline/parser';

const props = defineProps<{ idx: number, line: Line }>();
</script>
<style lang="scss" scoped></style>
