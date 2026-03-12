<template>
    <ChesslineLinear v-if="linear" :idx="0" :line="line" :foldable="foldable" />
    <Chessline v-else :idx="0" :line="line" :foldable="foldable" />
</template>

<script lang="ts" setup>
import { parsePGN } from '~/utils/chessline/parser';
import type { Line } from '~/utils/chessline/parser';

const props = withDefaults(defineProps<{ line: string; linear?: boolean; foldable?: boolean }>(), {
    linear: false,
    foldable: true,
})
const line = computed<Line>(() => parsePGN(props.line) ?? [])
</script>
<style lang="scss" scoped></style>
