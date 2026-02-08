<template>
    <div>
        <div v-if="hasWhiteSidelines">
            <p>
                <span>{{ idx }}.</span>
                <span class="san-token">
                    <Icon v-if="isPieceMove(turn.white?.move)" :name="pieceIcon(turn.white!.move!, 'w')" />
                    <span>{{ toSANMove(turn.white?.move) }}</span>
                </span>
            </p>
            <div v-for="(line, sidx) in turn.white!.sidelines" :key="`w-${sidx}`" style="margin-left: 2rem;">
                <Chessline :idx="idx - 1" :line="line" />
            </div>
            <p>
                <span>{{ idx }}.</span>
                <span class="san-token">
                    <Icon v-if="isPieceMove(turn.black?.move)" :name="pieceIcon(turn.black!.move!, 'b')" />
                    <span>{{ toSANMove(turn.black?.move) }}</span>
                </span>
            </p>
            <div v-if="hasBlackSidelines" style="margin-left: 2rem;">
                <div v-for="(line, sidx) in turn.black!.sidelines" :key="`b-${sidx}`">
                    <Chessline :idx="idx - 1" :line="line" />
                </div>
            </div>
        </div>

        <div v-else>
            <p>
                <span>{{ idx }}.</span>
                <span class="san-token">
                    <Icon v-if="isPieceMove(turn.white?.move)" :name="pieceIcon(turn.white!.move!, 'w')" />
                    <span>{{ toSANMove(turn.white?.move) }}</span>
                </span>

                <span v-if="isPieceMove(turn.black?.move)" class="san-token">
                    <Icon :name="pieceIcon(turn.black!.move!, 'b')" />
                    <span>{{ toSANMove(turn.black?.move) }}</span>
                </span>
            </p>
            <div v-if="hasBlackSidelines" style="margin-left: 2rem;">
                <div v-for="(line, sidx) in turn.black!.sidelines" :key="`b-${sidx}`">
                    <Chessline :idx="idx - 1" :line="line" />
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
}>();

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
.san-token {
    margin-left: .7rem;

    span {
        margin-left: .2rem;

        // TODO: Parametrize over accent color
        &.iconify {
            filter: invert(53%) sepia(87%) saturate(288%) hue-rotate(130deg) brightness(70%) contrast(93%);
        }
    }
}
</style>
