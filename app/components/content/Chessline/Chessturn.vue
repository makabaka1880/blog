<template>
    <div class="turn-block">
        <div v-if="hasWhiteSidelines">
            <div class="turn-row">
                <span class="move-num">{{ idx }}.</span>
                <span class="san-token">
                    <Icon v-if="isPieceMove(turn.white?.move)" :name="pieceIcon(turn.white!.move!, 'w')" />
                    <span>{{ toSANMove(turn.white?.move) }}</span>
                </span>
                <span class="san-token">
                    <Icon v-if="isPieceMove(turn.black?.move)" :name="pieceIcon(turn.black!.move!, 'b')" />
                    <span>{{ toSANMove(turn.black?.move) }}</span>
                </span>
            </div>
            <div v-for="(line, sidx) in turn.white!.sidelines" :key="`w-${sidx}`" class="sideline">
                <details v-if="isFoldable" class="sideline-details">
                    <summary>Sideline</summary>
                    <ChesslineLinear :idx="idx - 1" :line="line" :foldable="foldable" />
                </details>
                <ChesslineLinear v-else :idx="idx - 1" :line="line" :foldable="foldable" />
            </div>
            <div v-if="hasBlackSidelines" style="margin-left: 2rem;">
                <div v-for="(line, sidx) in turn.black!.sidelines" :key="`b-${sidx}`" class="sideline">
                    <details v-if="isFoldable" class="sideline-details">
                        <summary>Sideline</summary>
                        <ChesslineLinear :idx="idx - 1" :line="line" :foldable="foldable" />
                    </details>
                    <ChesslineLinear v-else :idx="idx - 1" :line="line" :foldable="foldable" />
                </div>
            </div>
        </div>

        <div v-else>
            <div class="turn-row">
                <span class="move-num">{{ idx }}.</span>
                <span class="san-token">
                    <Icon v-if="isPieceMove(turn.white?.move)" :name="pieceIcon(turn.white!.move!, 'w')" />
                    <span>{{ toSANMove(turn.white?.move) }}</span>
                </span>
                <span v-if="turn.black?.move" class="san-token">
                    <Icon v-if="isPieceMove(turn.black?.move)" :name="pieceIcon(turn.black!.move!, 'b')" />
                    <span>{{ toSANMove(turn.black?.move) }}</span>
                </span>
            </div>
            <div v-if="hasBlackSidelines" style="margin-left: 2rem;">
                <div v-for="(line, sidx) in turn.black!.sidelines" :key="`b-${sidx}`" class="sideline">
                    <details v-if="isFoldable" class="sideline-details">
                        <summary>Sideline</summary>
                        <ChesslineLinear :idx="idx - 1" :line="line" :foldable="foldable" />
                    </details>
                    <ChesslineLinear v-else :idx="idx - 1" :line="line" :foldable="foldable" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { toSANMove, type Turn, type MoveText } from '~/utils/chessline/parser';

const props = defineProps<{
    idx: number,
    turn: Turn
    foldable?: boolean
}>();

const isFoldable = computed(() => props.foldable !== false);

const hasWhiteSidelines = computed(() => (
    (props.turn.white?.sidelines?.length ?? 0) > 0
));

const hasBlackSidelines = computed(() => (
    (props.turn.black?.sidelines?.length ?? 0) > 0
));

function isPieceMove(move?: MoveText): boolean {
    return !!move && typeof move.move === 'object' && 'piece' in move.move;
}

function pieceIcon(move: MoveText, color: 'w' | 'b'): string {
    if (typeof move.move === 'string') {
        return color === 'w'
            ? move.move === 'Short'
                ? 'chess/wK'
                : 'chess/wK'
            : move.move === 'Short'
                ? 'chess/bK'
                : 'chess/bK';
    }
    return `icons-chess:${color}${move.move.piece}`;
}
</script>

<style lang="scss" scoped>
.turn-row {
    display: grid;
    grid-template-columns: auto minmax(5rem, 1fr) minmax(5rem, 1fr);
    gap: 0.7rem;
    align-items: center;
}

.move-num {
    min-width: 2.2rem;
}

.san-token {
    display: inline-flex;
    align-items: center;
    line-height: 2;
    min-width: 0;
    
    span {
        margin-left: .2rem;

        // TODO: Parametrize over accent color
        &.iconify {
            filter: invert(53%) sepia(87%) saturate(288%) hue-rotate(130deg) brightness(70%) contrast(93%);
        }
    }
}


.sideline {
    margin-left: 2rem;
}

.sideline-details {
    margin: 0.4rem 0;
}

.sideline-details > summary {
    cursor: pointer;
    font-size: 0.9em;
    color: var(--color-text-muted);
    margin-bottom: 0.25rem;
}

.sideline-details[open] > summary {
    color: var(--color-text);
}
</style>
