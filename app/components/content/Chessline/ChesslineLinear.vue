<template>
    <div class="line">
        <template v-for="(value, sidx) in line" :key="sidx">
            <span class="turn">
                <span class="move-num">{{ idx + sidx + 1 }}.</span>
                <span class="san-token">
                    <Icon v-if="isPieceMove(value.white?.move)" :name="pieceIcon(value.white!.move!, 'w')" />
                    <span>{{ toSANMove(value.white?.move) }}</span>
                </span>
                <span v-if="value.black?.move" class="san-token">
                    <Icon v-if="isPieceMove(value.black?.move)" :name="pieceIcon(value.black!.move!, 'b')" />
                    <span>{{ toSANMove(value.black?.move) }}</span>
                </span>
            </span>

            <details v-if="hasSidelines(value) && isFoldable" class="sideline-details">
                <summary>Sidelines</summary>
                <div v-for="(lineItem, lidx) in value.white?.sidelines ?? []" :key="`w-${sidx}-${lidx}`" class="sideline">
                    <ChesslineLinear :idx="idx + sidx" :line="lineItem" :foldable="foldable" />
                </div>
                <div v-for="(lineItem, lidx) in value.black?.sidelines ?? []" :key="`b-${sidx}-${lidx}`" class="sideline">
                    <ChesslineLinear :idx="idx + sidx" :line="lineItem" :foldable="foldable" />
                </div>
            </details>
            <div v-else-if="hasSidelines(value)">
                <div v-for="(lineItem, lidx) in value.white?.sidelines ?? []" :key="`w-${sidx}-${lidx}`" class="sideline">
                    <ChesslineLinear :idx="idx + sidx" :line="lineItem" :foldable="foldable" />
                </div>
                <div v-for="(lineItem, lidx) in value.black?.sidelines ?? []" :key="`b-${sidx}-${lidx}`" class="sideline">
                    <ChesslineLinear :idx="idx + sidx" :line="lineItem" :foldable="foldable" />
                </div>
            </div>
        </template>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { toSANMove, type MoveText, type Line, type Turn } from '~/utils/chessline/parser';

const props = defineProps<{ idx: number, line: Line, foldable?: boolean }>();
const isFoldable = computed(() => props.foldable !== false);

function isPieceMove(move?: MoveText): boolean {
    return !!move && typeof move.move === 'object' && 'piece' in move.move;
}

function pieceIcon(move: MoveText, color: 'w' | 'b'): string {
    if (typeof move.move === 'string') {
        return color === 'w'
            ? 'chess/wK'
            : 'chess/bK';
    }
    return `icons-chess:${color}${move.move.piece}`;
}

function hasSidelines(turn: Turn): boolean {
    return (turn.white?.sidelines?.length ?? 0) > 0 || (turn.black?.sidelines?.length ?? 0) > 0;
}
</script>

<style lang="scss" scoped>
// .line {
//     line-height: 1.6;
// }

.turn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-right: 1.25rem;
    white-space: nowrap;
}
:deep(.iconify) {
    vertical-align: middle;
    line-height: 1;
}

.move-num {
    min-width: 2.2rem;
}

.san-token {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    min-width: 0;

    span {
        margin-left: .2rem;

        &.iconify {
            filter: invert(53%) sepia(87%) saturate(288%) hue-rotate(130deg) brightness(70%) contrast(93%);
        }
    }
}

.sideline {
    margin-left: 2rem;
}

.sideline-details {
    margin: 0.2rem 0 0.5rem;
}

.sideline-details > summary {
    cursor: pointer;
    font-size: 0.9em;
    color: var(--color-text-muted);
    margin-bottom: 0.1rem;
}

.sideline-details[open] > summary {
    color: var(--color-text);
}
</style>
