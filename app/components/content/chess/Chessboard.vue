<template>
    <div class="board-container">
        <div class="board-square-container" :style="containerStyle">
            <div class="board-wrapper" :style="boardWrapperStyle">
                <canvas ref="canvas" class="board" />
            </div>
            <div v-if="labels" class="board-label" :style="labelStyle">
                <span class="label-text">{{ sideToMove }}</span>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use "~/assets/theme.scss" as *;

.board-container {
    margin: 2rem auto;
    display: flex;
    justify-content: center;
}

.board-square-container {
    width: 40vw;
    display: flex;
    flex-direction: row;
    align-items: start;
    justify-content: center;
    gap: 0;
}

.board-wrapper {
    flex: 1;
    max-width: 100%;
    max-height: 100%;
}

.board-label {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 0.8rem;
    min-width: 3rem;
    transform: translateX(-2px);
    margin-top: 2rem;
    z-index: -1;
}

.label-text {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.15em;
}

.board {
    --light-square: var(--color-chess-light-square);
    --dark-square: var(--color-chess-dark-square);

    width: 100%;
    height: 100%;
    display: block;
    border-radius: var(--border-radius-image);
    cursor: pointer;
}

@media (max-width: $critical-width) {
    .board-square-container {
        width: 80%;
    }

    .label-text {
        font-size: 0.9rem;
    }

    .board-label {
        padding: 1.5rem 0.6rem;
        min-width: 2.5rem;
    }
}
</style>

<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import Fen, { EMPTY_SQUARE } from "chess-fen";
import {
    GRID_SIZE,
    buildCoordsToACN,
    drawBoard,
    getCanvasColors,
    drawFigure,
} from "~/utils/chessboard";
import {
    parseCropBounds,
    calculateGridSize,
    drawCoordinates,
    mouseToBoard,
} from "~/utils/chessboard-coords";
import {
    parseAnnotationLines,
    drawAnnotations,
} from "~/utils/chessboard-annotations";

const canvas = ref<HTMLCanvasElement | null>(null);
const GRID = GRID_SIZE;
const coordsToACN = buildCoordsToACN(GRID);
const slots = useSlots();
const colorMode = useColorMode();

const getAnnotationLines = (): string[] => {
    return parseAnnotationLines(slots.default?.() ?? []);
};

// --------------------
// Entry
// --------------------
const props = withDefaults(defineProps<{
    fen: string,
    coords: boolean,
    labels?: boolean,
    crop?: string // Format: "a1-h8" or "d4-f6" etc.
}>(), {
    labels: true,
    coords: true,
    crop: 'a1-h8'
});

// Parse crop bounds
const cropBounds = computed(() => parseCropBounds(props.crop));

const gridSize = computed(() => calculateGridSize(cropBounds.value, GRID));

const boardWrapperStyle = computed(() => {
    const size = gridSize.value;
    return {
        aspectRatio: `${size.width} / ${size.height}`
    };
});

const containerStyle = computed(() => {
    const size = gridSize.value;
    const isTall = size.width < size.height;

    if (isTall) {
        // For tall boards, constrain by setting max-height based on aspect ratio
        // This makes the height equal to what the width would be
        return {
            maxHeight: '40vw',
            width: 'auto'
        };
    }

    return {};
});

const sideToMove = computed(() => {
    const fenParts = props.fen.split(' ');
    const activeColor = fenParts[1] || 'w';
    return activeColor === 'w' ? 'WTM' : 'BTM';
});

const labelStyle = computed(() => {
    const isWhiteToMove = sideToMove.value === 'WTM';
    const isLightMode = colorMode.value === 'light';

    return {
        background: isWhiteToMove ? 'white' : 'var(--color-chess-label-background)',
        color: isWhiteToMove ? 'var(--color-chess-label-background)' : 'white',
        ...(isLightMode && isWhiteToMove ? { border: '2px solid var(--color-chess-label-background)' } : {})
    };
});

let board: { ctx: CanvasRenderingContext2D; cellSize: number; colors: { light: string; dark: string } } | null = null;
let hoveredSquare: { file: number; rank: number } | null = null;

function drawSquares() {
    const el = canvas.value;
    if (!board || !el || !cropBounds.value) return;
    const { ctx, cellSize, colors } = board;
    const nextColors = getCanvasColors(el);
    colors.light = nextColors.light;
    colors.dark = nextColors.dark;

    const { minFile: startFile, maxFile: endFile, minRank: startRank, maxRank: endRank } = cropBounds.value;

    for (let y = startRank; y <= endRank; y += 1) {
        for (let x = startFile; x <= endFile; x += 1) {
            let fillColor = (x + y) % 2 === 0 ? colors.light : colors.dark;

            ctx.fillStyle = fillColor;
            const drawX = (x - startFile) * cellSize;
            const drawY = (y - startRank) * cellSize;
            ctx.fillRect(drawX, drawY, cellSize, cellSize);

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
                ctx.fillText(coord, drawX + cellSize / 2, drawY + cellSize / 2);
                ctx.restore();
            }
        }
    }
}

function handleMouseMove(e: MouseEvent) {
    const el = canvas.value;
    console.log(el)
    if (!el || !board || !cropBounds.value) return;

    const rect = el.getBoundingClientRect();
    const { minFile: startFile, maxFile: endFile, minRank: startRank, maxRank: endRank } = cropBounds.value;

    const { file, rank } = mouseToBoard(e.clientX, e.clientY, rect, gridSize.value.width, startFile, startRank);

    if (file >= startFile && file <= endFile && rank >= startRank && rank <= endRank) {
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
    if (!el || !board || !cropBounds.value) return;

    drawSquares();

    const position = new Fen(props.fen || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    const { ctx, cellSize } = board;
    const { minFile: startFile, maxFile: endFile, minRank: startRank, maxRank: endRank } = cropBounds.value;

    if (props.coords) {
        drawCoordinates(ctx, cellSize, gridSize.value.width, gridSize.value.height, board.colors, startFile, startRank);
    }

    // Redraw pieces
    for (const [acn, grid] of coordsToACN) {
        if (grid.file < startFile || grid.file > endFile || grid.rank < startRank || grid.rank > endRank) {
            continue;
        }

        const fig = position.get(acn);
        if (fig != EMPTY_SQUARE && fig != null) {
            await drawFigure(
                ctx,
                grid.file - startFile,
                grid.rank - startRank,
                fig,
                fig === fig.toUpperCase(),
                cellSize
            );
        }
    }

    // Redraw annotations
    const annotationLines = getAnnotationLines();
    await drawAnnotations(ctx, annotationLines, cellSize, startFile, startRank);
}

onMounted(async () => {
    const el = canvas.value;
    if (!el || !cropBounds.value) return;

    board = drawBoard(el, gridSize.value.width, gridSize.value.height);
    if (!board) return;

    // Use our custom drawSquares instead of the initial drawBoard's square drawing
    drawSquares();

    const position = new Fen(props.fen || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    const { ctx, cellSize, colors } = board;
    const { minFile: startFile, maxFile: endFile, minRank: startRank, maxRank: endRank } = cropBounds.value;

    if (props.coords) {
        drawCoordinates(ctx, cellSize, gridSize.value.width, gridSize.value.height, colors, startFile, startRank);
    }

    // draw pieces
    for (const [acn, grid] of coordsToACN) {
        if (grid.file < startFile || grid.file > endFile || grid.rank < startRank || grid.rank > endRank) {
            continue;
        }

        const fig = position.get(acn);
        if (fig != EMPTY_SQUARE && fig != null) {
            await drawFigure(
                ctx,
                grid.file - startFile,
                grid.rank - startRank,
                fig,
                fig === fig.toUpperCase(),
                cellSize
            );
        }
    }

    // Draw annotations
    const annotationLines = getAnnotationLines();
    await drawAnnotations(ctx, annotationLines, cellSize, startFile, startRank);

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
