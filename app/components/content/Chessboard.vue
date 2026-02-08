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
import { GRID_SIZE, buildCoordsToACN, parseAnnotationLine } from "~/utils/chessboard";
import { glyphToSvgMap } from "~/utils/chessglyphs";
import { drawSvgOnCanvas } from "~/utils/canvas-utils";

const canvas = ref<HTMLCanvasElement | null>(null);
const GRID = GRID_SIZE;
const coordsToACN = buildCoordsToACN(GRID);
const slots = useSlots();

// --------------------
// Chess drawing utils
// --------------------
const figureImages = new Map<string, HTMLImageElement>();
const codePiece = (name: string, white: boolean) => (white ? "w" : "b") + name.toUpperCase();

const loadFigureImage = async (code: string) => {
    if (figureImages.has(code)) return figureImages.get(code)!;
    const url = new URL(`/static/chessboard/${code}.svg`, import.meta.url).toString();
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
    const code = codePiece(name, white);
    const img = await loadFigureImage(code);
    const x = (file + 0.5) * cellsize - cellsize / 2;
    const y = (rank + 0.5) * cellsize - cellsize / 2;
    ctx.drawImage(img, x, y, cellsize, cellsize);
};

const acnToXY = (acn: string, cellsize: number) => {
    const file = acn.charCodeAt(0) - 'a'.charCodeAt(0); // a→0, b→1, …
    const rank = parseInt(acn[1]!) - 1;                  // 1→0, 2→1, …
    const x = (file + 0.5) * cellsize;
    const y = (7 - rank + 0.5) * cellsize; // invert rank: rank1 = bottom
    return { x, y };
};

const drawArrow = (
    ctx: CanvasRenderingContext2D,
    cellsize: number,
    fromACN: string,
    toACN: string,
    color: string = '#eb09'
) => {
    const { x: x0, y: y0 } = acnToXY(fromACN, cellsize);
    const { x: x1, y: y1 } = acnToXY(toACN, cellsize);

    const headLength = cellsize * 0.5;
    const dx = x1 - x0;
    const dy = y1 - y0;
    const dist = Math.sqrt(dx * dx + dy * dy);

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineCap = 'round';
    ctx.lineWidth = cellsize / 8;

    // Draw line from start to end minus arrowhead
    const factor = (dist - headLength) / dist;
    const xEnd = x0 + dx * factor;
    const yEnd = y0 + dy * factor;

    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(xEnd, yEnd);
    ctx.stroke();

    // Draw arrowhead
    const angle = Math.atan2(dy, dx);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(
        x1 - headLength * Math.cos(angle - Math.PI / 6),
        y1 - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
        x1 - headLength * Math.cos(angle + Math.PI / 6),
        y1 - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();
};
const drawLArrow = (
    ctx: CanvasRenderingContext2D,
    cellsize: number,
    fromACN: string,
    toACN: string,
    color: string = '#eb09'
) => {
    const { x: x0, y: y0 } = acnToXY(fromACN, cellsize);
    const { x: x1, y: y1 } = acnToXY(toACN, cellsize);

    const headLength = cellsize * 0.5; // arrowhead size

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineCap = 'round';

    let bendX = x1;
    let bendY = y0;

    // 1. Draw start → bend
    if (x0 !== x1 && y0 !== y1) {
        ctx.lineWidth = cellsize / 10;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(bendX, bendY);
        ctx.stroke();

        // 2. Draw bend → last edge before entering final grid
        // Shorten segment by arrowhead length
        const dx = x1 - bendX;
        const dy = y1 - bendY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const factor = (dist - headLength) / dist;
        const xEnd = bendX + dx * factor;
        const yEnd = bendY + dy * factor;

        ctx.beginPath();
        ctx.lineWidth = 0; // minimal line for last segment
        ctx.moveTo(bendX, bendY);
        ctx.lineTo(xEnd, yEnd);
        ctx.stroke();

        // 3. Draw arrowhead
        const angle = Math.atan2(y1 - yEnd, x1 - xEnd);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(
            x1 - headLength * Math.cos(angle - Math.PI / 6),
            y1 - headLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
            x1 - headLength * Math.cos(angle + Math.PI / 6),
            y1 - headLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();
    } else {
        // Straight line case
        const dx = x1 - x0;
        const dy = y1 - y0;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const factor = (dist - headLength) / dist;
        const xEnd = x0 + dx * factor;
        const yEnd = y0 + dy * factor;

        // 1. Stroke from start to last edge before arrowhead
        ctx.lineWidth = cellsize / 10;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(xEnd, yEnd);
        ctx.stroke();

        // 2. Draw arrowhead
        const angle = Math.atan2(y1 - yEnd, x1 - xEnd);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(
            x1 - headLength * Math.cos(angle - Math.PI / 6),
            y1 - headLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
            x1 - headLength * Math.cos(angle + Math.PI / 6),
            y1 - headLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();
    }
};



const drawMark = (
    ctx: CanvasRenderingContext2D,
    cellsize: number,
    acn: string,
    color: string = '#eb09'
) => {
    // Convert ACN to canvas coordinates
    const file = acn.charCodeAt(0) - 'a'.charCodeAt(0); // 'a'→0
    const rank = parseInt(acn[1]!) - 1;                  // '1'→0
    const x = (file + 0.5) * cellsize;
    const y = (7 - rank + 0.5) * cellsize; // invert rank: rank1 = bottom

    ctx.lineWidth = cellsize / 15
    ctx.beginPath();
    ctx.strokeStyle = color
    ctx.arc(x, y, cellsize / 2 - cellsize / 30, 0, 2 * Math.PI);
    ctx.stroke();
};

const drawFeedback = async (
    ctx: CanvasRenderingContext2D,
    cellsize: number,
    acn: string,
    value: string
) => {
    const { x, y } = acnToXY(acn, cellsize);

    const cx = x + cellsize * 0.2;
    const cy = y - cellsize * 0.55;

    ctx.save();

    console.log(value);
    const svg = glyphToSvgMap.get(value)();
    if (!svg) return;
    console.log(svg)

    await drawSvgOnCanvas(
        ctx,
        svg,
        cx,
        cy,
        cellsize,
        cellsize
    );
};




const drawBoard = async (coords: boolean) => {
    const el = canvas.value;
    if (!el) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = el.getBoundingClientRect();
    el.width = rect.width * dpr;
    el.height = rect.height * dpr;

    const ctx = el.getContext("2d");
    if (!ctx) return;

    ctx.scale(dpr, dpr);

    const styles = getComputedStyle(el);
    const light = styles.getPropertyValue("--light-square").trim() || "#eee";
    const dark = styles.getPropertyValue("--dark-square").trim() || "#333";
    const cellSize = rect.width / GRID;

    Array.from({ length: GRID }).forEach((_, y) => {
        Array.from({ length: GRID }).forEach((_, x) => {
            ctx.fillStyle = (x + y) % 2 === 0 ? light : dark;
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        });
    });

    if (coords) {
        // Draw A1 label on A1 square
        ctx.fillStyle = light;
        ctx.font = `${cellSize * .15}px JetBrains Mono`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        Array.from({ length: GRID }).forEach((_, rank) => {
            const acn = (8 - rank);
            const x = 0.15 * cellSize;
            const y = (rank + 0.15) * cellSize;
            ctx.fillStyle = (rank) % 2 === 0 ? dark : light;
            ctx.save();
            ctx.fillText(String(acn), x, y);
            ctx.restore();
        });
        Array.from({ length: GRID }).forEach((_, file) => {
            const acn = String.fromCharCode(97 + file);
            const x = (file + 0.85) * cellSize;
            const y = (0.85 + 7) * cellSize;
            ctx.fillStyle = (file) % 2 === 1 ? dark : light;
            ctx.save();
            ctx.fillText(acn.toUpperCase(), x, y);
            ctx.restore();
        });
    }

    return ctx;
};

// --------------------
// Zhilu-style slot extraction (minimal, UB trick)
// --------------------
const getAnnotationLines = (): string[] => {
    return (slots.default?.() ?? []).flatMap(node => {
        const text = (node.children as any)?.default?.()[0].children as string;
        return text ? text.split('\n') : [];
    });
};

// --------------------
// Entry
// --------------------
const props = defineProps<{ fen: string, coords: boolean }>();

onMounted(async () => {
    const ctx = await drawBoard(props.coords);
    if (!ctx) return;

    const position = new Fen(props.fen);
    const cellsize = ctx.canvas.width / (window.devicePixelRatio || 1) / GRID

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
                cellsize
            );
        }
    }

    // extract annotation lines (Zhilu minimal UB method)
    const annotationLines = getAnnotationLines();
    console.log("annotation lines:", annotationLines);
    const annotations = computed(() =>
        annotationLines.map(parseAnnotationLine)
    );
    annotations.value.forEach(a => {
        switch (a.kind) {
            case 'arrow':
                drawArrow(ctx, cellsize, a.from, a.to);
                break;
            case 'feedback':
                drawFeedback(ctx, cellsize, a.at, a.value);
                break;
            case 'mark':
                drawMark(ctx, cellsize, a.at);
                break;
        }
    })
});
</script>
