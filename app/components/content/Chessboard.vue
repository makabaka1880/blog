<template>
    <div class="board-wrapper">
        <canvas ref="canvas" class="board" />
    </div>
</template>

<style lang="scss" scoped>
@use "~/assets/theme.scss" as *;

.board-wrapper {
    width: 40vw;
    margin: 2rem auto;
    aspect-ratio: 1 / 1;
}

.board {
    --light-square: color-mix(in oklab, var(--color-accent) 35%, oklch(1 0 0deg));
    --dark-square: color-mix(in oklab, var(--color-accent) 92%, oklch(0 0 0deg));

    width: 100%;
    height: 100%;
    display: block;
    border-radius: 0.25rem;
    cursor: pointer;
}

@media (max-width: $critical-width) {
    .board-wrapper {
        width: 80%;
    }
}
</style>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import Fen, { EMPTY_SQUARE } from "chess-fen";
import {
    GRID_SIZE,
    buildCoordsToACN,
    parseAnnotationLine,
    drawBoard,
    getCanvasColors,
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

let board: { ctx: CanvasRenderingContext2D; cellSize: number; colors: { light: string; dark: string } } | null = null;
let hoveredSquare: { file: number; rank: number } | null = null;

function drawSquares() {
    const el = canvas.value;
    if (!board || !el) return;
    const { ctx, cellSize, colors } = board;
    const nextColors = getCanvasColors(el);
    colors.light = nextColors.light;
    colors.dark = nextColors.dark;

    for (let y = 0; y < GRID; y += 1) {
        for (let x = 0; x < GRID; x += 1) {
            let fillColor = (x + y) % 2 === 0 ? colors.light : colors.dark;

            ctx.fillStyle = fillColor;
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);

            // Display coordinate on hovered square
            if (hoveredSquare && hoveredSquare.file === x && hoveredSquare.rank === y) {
                const files = 'ABCDEFGH';
                const ranks = '87654321';
                const coord = files[x]! + ranks[y]!;

                ctx.save();
                ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                ctx.font = `bold ${cellSize * 0.4}px Jetbrains Mono`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(coord, x * cellSize + cellSize / 2, y * cellSize + cellSize / 2);
                ctx.restore();
            }
        }
    }
}

function handleMouseMove(e: MouseEvent) {
    const el = canvas.value;
    if (!el || !board) return;

    const rect = el.getBoundingClientRect();
    const cellSize = board.cellSize;
    const file = Math.floor((e.clientX - rect.left) / cellSize);
    const rank = Math.floor((e.clientY - rect.top) / cellSize);

    if (file >= 0 && file < GRID && rank >= 0 && rank < GRID) {
        const newHovered = { file, rank };
        if (!hoveredSquare || hoveredSquare.file !== file || hoveredSquare.rank !== rank) {
            hoveredSquare = newHovered;
            redraw();
        }
    } else if (hoveredSquare) {
        hoveredSquare = null;
        redraw();
    }
}

function handleMouseLeave() {
    if (hoveredSquare) {
        hoveredSquare = null;
        redraw();
    }
}

async function redraw() {
    const el = canvas.value;
    if (!el || !board) return;

    drawSquares();

    const position = new Fen(props.fen || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    const { ctx, cellSize } = board;
    if (props.coords) drawCoordinates(ctx, cellSize, GRID, board.colors);

    // Redraw pieces
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

    // Redraw annotations
    const annotationLines = getAnnotationLines();
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
}

onMounted(async () => {
    const el = canvas.value;
    if (!el) return;
    board = drawBoard(el, GRID);
    if (!board) return;

    // Use our custom drawSquares instead of the initial drawBoard's square drawing
    drawSquares();

    const position = new Fen(props.fen || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
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

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
});

onBeforeUnmount(() => {
    const el = canvas.value;
    if (el) {
        el.removeEventListener('mousemove', handleMouseMove);
        el.removeEventListener('mouseleave', handleMouseLeave);
    }
});
</script>
