<template>
    <canvas ref="canvas" class="board" />
</template>

<style lang="scss" scoped>
@use "~/assets/theme.scss" as *;

.board {
    --light-square: #{lighten($color-accent, 30%)};
    --dark-square: #{darken($color-accent, 10%)};

    width: 40vw;
    display: block;
    margin: 2rem auto;
    aspect-ratio: 1 / 1;
    border-radius: 5px;
}

@media (max-width: $critical-width) {
    .board {
        width: 80%
    }
}
</style>

<script lang="ts" setup>
import { ref, onMounted, useSlots } from "vue";
import Fen, { EMPTY_SQUARE } from "chess-fen";
import {
    GRID_SIZE,
    buildCoordsToACN,
    parseAnnotationLine,
    drawBoard,
    drawCoordinates,
    drawFigure,
    drawArrow,
    drawMark,
    drawGlyph,
    drawWasFigure,
} from "~/utils/chessboard";

const canvas = ref<HTMLCanvasElement | null>(null);
const GRID = GRID_SIZE;
const coordsToACN = buildCoordsToACN(GRID);
const slots = useSlots();


const extractText = (node: any): string[] => {
    if (!node) return [];
    if (typeof node === 'string') return [node];
    if (typeof node.children === 'string') return [node.children];
    if (Array.isArray(node.children)) {
        return node.children.flatMap(extractText);
    }
    if (node.children && typeof node.children.default === 'function') {
        return node.children.default().flatMap(extractText);
    }
    return [];
};

const getAnnotationLines = (): string[] => {
    const raw = (slots.default?.() ?? []).flatMap(extractText).join("\n");
    return raw
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
};

// --------------------
// Entry
// --------------------
const props = defineProps<{ fen: string, coords: boolean }>();

onMounted(async () => {
    const el = canvas.value;
    if (!el) return;
    const board = drawBoard(el, GRID);
    if (!board) return;

    const position = new Fen(props.fen);
    const { ctx, cellSize, colors } = board;
    if (props.coords) drawCoordinates(ctx, cellSize, GRID, colors);

    // draw pieces
    for (const [acn, grid] of coordsToACN) {
        const fig = position.get(acn);
        if (fig != EMPTY_SQUARE && fig != null) {
            await drawFigure(
                ctx,
                grid.file,
                grid.rank,
                fig,
                fig === fig.toUpperCase(),
                cellSize
            );
        }
    }

    const annotationLines = getAnnotationLines();
    console.log(annotationLines)
    const annotations = annotationLines.map(parseAnnotationLine);
    for (const a of annotations) {
        switch (a.kind) {
            case 'arrow':
                drawArrow(ctx, cellSize, a.from, a.to);
                break;
            case 'feedback':
                await drawGlyph(ctx, cellSize, a.at, a.value);
                break;
            case 'wasfigure':
                await drawWasFigure(ctx, cellSize, a.at, a.piece);
                break;
            case 'mark':
                drawMark(ctx, cellSize, a.at);
                break;
        }
    }
});
</script>
