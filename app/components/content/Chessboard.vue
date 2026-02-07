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
import { ref, onMounted, onUnmounted } from "vue";
import Fen, { BOARD_CONTENT, EMPTY_SQUARE } from "chess-fen";
import { GRID_SIZE, buildCoordsToACN } from "~/utils/chess";

const canvas = ref<HTMLCanvasElement | null>(null);
const GRID = GRID_SIZE;

const getCanvasColors = (el: HTMLCanvasElement) => {
    const styles = getComputedStyle(el);
    return {
        light: styles.getPropertyValue("--light-square").trim() || "#eee",
        dark: styles.getPropertyValue("--dark-square").trim() || "#333",
    };
};

const figureImages = new Map<string, HTMLImageElement>();

const codePiece = (name: string, white: boolean) => {
    return (white ? "w" : "b") + name.toUpperCase();
}

const loadFigureImage = async (code: string) => {
    if (figureImages.has(code)) return figureImages.get(code)!;
    const url = new URL(`/static/chessboard/${code}.svg`, import.meta.url).toString();
    console.log("url", url)
    const img = new Image();
    img.src = url;
    await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to load ${code}`));
    });
    figureImages.set(code, img);
    return img;
};

const drawFigure = async (
    ctx: CanvasRenderingContext2D,
    file: number,
    rank: number,
    name: string,
    white: boolean,
    cellsize: number
) => {
    console.log(file, rank)
    if (!(0 <= file && file <= 7 && 0 <= rank && rank <= 7)) return;
    const code = codePiece(name, white);
    const img = await loadFigureImage(code);

    const x = (file + 0.5) * cellsize - cellsize / 2;
    const y = (rank + 0.5) * cellsize - cellsize / 2;
    ctx.drawImage(img, x, y, cellsize, cellsize);
};

const drawBoard = async () => {
    const el = canvas.value;
    if (!el) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = el.getBoundingClientRect();

    // Set display size
    el.width = rect.width * dpr;
    el.height = rect.height * dpr;

    const ctx = el.getContext("2d");
    if (!ctx) return;

    ctx.scale(dpr, dpr);

    const { light, dark } = getCanvasColors(el);
    const cellSize = rect.width / GRID;

    // A functional approach to the grid
    Array.from({ length: GRID }).forEach((_, y) => {
        Array.from({ length: GRID }).forEach((_, x) => {
            ctx.fillStyle = (x + y) % 2 === 0 ? light : dark;
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        });
    });
    return ctx;
};

// MARK: Entry
const props = defineProps<{ fen: string }>()
const coordsToACN = buildCoordsToACN(GRID);


onMounted(async () => {
    const ctx = await drawBoard();
    if (!ctx) return;
    const position = new Fen(props.fen);
    for (const [acn, grid] of coordsToACN) {
        const fig = position.get(acn);
        if (fig != EMPTY_SQUARE) {
            await drawFigure(ctx, grid.file, grid.rank, fig, fig == fig.toUpperCase(), ctx.canvas.width / (window.devicePixelRatio || 1) / GRID);
        }
    };
});
</script>
