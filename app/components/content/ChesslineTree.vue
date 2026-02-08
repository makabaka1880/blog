<template>
    <Chessline :idx="0" :line="line" />
</template>

<script lang="ts" setup>
import { parsePGN } from '~/utils/chessline/parser';
import type { Line } from '~/utils/chessline/parser';

const props = defineProps<{ line: string; linear: boolean }>()
const line = computed<Line>(() => parsePGN(props.line) ?? [])
</script>
<style lang="scss" scoped></style>
