import { glyphToSvgMap } from "~/utils/chessglyphs";
import { drawSvgOnCanvas } from "~/utils/canvas-utils";

export const GRID_SIZE = 8;

export const buildCoordsToACN = (gridSize: number = GRID_SIZE) =>
    new Map(
        [...Array(gridSize)].flatMap((_, rank) =>
            [...Array(gridSize)].map((_, file) => [
                `${String.fromCharCode(97 + file)}${rank + 1}`,
                { file, rank: gridSize - 1 - rank },
            ])
        )
    );

export type Grid = `${'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h'}${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}`;
export type Piece = "r" | "n" | "b" | "k" | "q" | "p" | "R" | "N" | "B" | "K" | "Q" | "P";

export type Annotation =
    | { kind: "mark"; at: Grid }
    | { kind: "feedback"; at: Grid; value: string }
    | { kind: "wasfigure"; at: Grid; piece: Piece }
    | { kind: "arrow"; from: Grid; to: Grid };

const feedbackSymbols = [...glyphToSvgMap.keys()]
    .sort((a, b) => b.length - a.length);


export function parseAnnotationLine(line: string): Annotation {
    const trimmed = line.trim();

    const wasFigureMatch = trimmed.match(/^\(([rnbkqpRNBKQP])([a-h][1-8])\)$/);
    if (wasFigureMatch) {
        return {
            kind: "wasfigure",
            piece: wasFigureMatch[1] as Piece,
            at: wasFigureMatch[2] as Grid,
        };
    }

    if (trimmed.includes("->")) {
        const [from, to] = trimmed.split("->").map((s) => s.trim()) as [Grid, Grid];
        return { kind: "arrow", from, to };
    }

    const matched = feedbackSymbols.find((symbol) => trimmed.endsWith(symbol));
    if (matched) {
        const coord = trimmed.slice(0, -matched.length - 1) as Grid;
        if (/^[a-h][1-8]$/.test(coord)) {
            return { kind: "feedback", at: coord, value: matched };
        }
    }

    if (/^[a-h][1-8]$/.test(trimmed)) {
        return { kind: "mark", at: trimmed as Grid };
    }

    throw new Error(`Invalid annotation: ${line}`);
}

export const getCanvasColors = (el: HTMLCanvasElement) => {
    const styles = getComputedStyle(el);
    return {
        light: styles.getPropertyValue("--light-square").trim() || "#eee",
        dark: styles.getPropertyValue("--dark-square").trim() || "#333",
    };
};

const figureImages = new Map<string, Promise<HTMLImageElement>>();
const codePiece = (name: string, white: boolean) => (white ? "w" : "b") + name.toUpperCase();

export const loadFigureImage = (code: string) => {
    const cached = figureImages.get(code);
    if (cached) return cached;

    const url = new URL(`/static/chessboard/${code}.svg`, import.meta.url).toString();
    const img = new Image();
    img.src = url;

    const loadPromise = (img.decode
        ? img.decode().then(() => img)
        : new Promise<HTMLImageElement>((resolve, reject) => {
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load ${code}`));
        })
    ).catch((err) => {
        figureImages.delete(code);
        throw err;
    });

    figureImages.set(code, loadPromise);
    return loadPromise;
};

export const drawFigure = async (
    ctx: CanvasRenderingContext2D,
    file: number,
    rank: number,
    name: string,
    white: boolean,
    cellSize: number,
    opacity: number = 1
) => {
    if (!(0 <= file && file <= 7 && 0 <= rank && rank <= 7)) return;
    const code = codePiece(name, white);
    const img = await loadFigureImage(code);

    const x = (file + 0.5) * cellSize - cellSize / 2;
    const y = (rank + 0.5) * cellSize - cellSize / 2;
    const temp = ctx.globalAlpha;
    ctx.globalAlpha = opacity;
    ctx.drawImage(img, x, y, cellSize, cellSize);
    ctx.globalAlpha = temp;
};

export const drawWasFigure = async (
    ctx: CanvasRenderingContext2D,
    cellSize: number,
    acn: Grid,
    piece: Piece
) => {
    const file = acn.charCodeAt(0) - "a".charCodeAt(0);
    const rank = GRID_SIZE - parseInt(acn[1]!, 10);
    const white = piece === piece.toUpperCase();
    const name = piece.toLowerCase();
    await drawFigure(ctx, file, rank, name, white, cellSize, 0.55);
};

export const drawBoard = (el: HTMLCanvasElement, gridWidth: number = GRID_SIZE, gridHeight: number = GRID_SIZE) => {
    const dpr = window.devicePixelRatio || 1;
    const rect = el.getBoundingClientRect();

    el.width = rect.width * dpr;
    el.height = rect.height * dpr;

    const ctx = el.getContext("2d");
    if (!ctx) return null;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const colors = getCanvasColors(el);
    const cellSize = rect.width / gridWidth;

    for (let y = 0; y < gridHeight; y += 1) {
        for (let x = 0; x < gridWidth; x += 1) {
            ctx.fillStyle = (x + y) % 2 === 0 ? colors.light : colors.dark;
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }

    return { ctx, cellSize, colors };
};

export const drawCoordinates = (
    ctx: CanvasRenderingContext2D,
    cellSize: number,
    gridSize: number,
    colors: { light: string; dark: string }
) => {
    ctx.font = `${cellSize * 0.15}px JetBrains Mono`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let rank = 0; rank < gridSize; rank += 1) {
        const label = String(gridSize - rank);
        const x = 0.15 * cellSize;
        const y = (rank + 0.15) * cellSize;
        ctx.fillStyle = rank % 2 === 0 ? colors.dark : colors.light;
        ctx.fillText(label, x, y);
    }

    for (let file = 0; file < gridSize; file += 1) {
        const label = String.fromCharCode(97 + file).toUpperCase();
        const x = (file + 0.85) * cellSize;
        const y = (gridSize - 0.15) * cellSize;
        ctx.fillStyle = file % 2 === 1 ? colors.dark : colors.light;
        ctx.fillText(label, x, y);
    }
};

export const acnToXY = (acn: string, cellSize: number) => {
    const file = acn.charCodeAt(0) - "a".charCodeAt(0);
    const rank = parseInt(acn[1]!, 10) - 1;
    const x = (file + 0.5) * cellSize;
    const y = (7 - rank + 0.5) * cellSize;
    return { x, y };
};

export const drawArrow = (
    ctx: CanvasRenderingContext2D,
    cellSize: number,
    fromACN: string,
    toACN: string,
    color: string = "#eb09"
) => {
    const { x: x0, y: y0 } = acnToXY(fromACN, cellSize);
    const { x: x1, y: y1 } = acnToXY(toACN, cellSize);

    const headLength = cellSize * 0.5;
    const dx = x1 - x0;
    const dy = y1 - y0;
    const dist = Math.sqrt(dx * dx + dy * dy);

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineCap = "round";
    ctx.lineWidth = cellSize / 8;

    const factor = (dist - headLength) / dist;
    const xEnd = x0 + dx * factor;
    const yEnd = y0 + dy * factor;

    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(xEnd, yEnd);
    ctx.stroke();

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

export const drawMark = (
    ctx: CanvasRenderingContext2D,
    cellSize: number,
    acn: string,
    color: string = "#eb09"
) => {
    const { x, y } = acnToXY(acn, cellSize);
    ctx.lineWidth = cellSize / 15;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.arc(x, y, cellSize / 2 - cellSize / 30, 0, 2 * Math.PI);
    ctx.stroke();
};

export const drawGlyph = async (
    ctx: CanvasRenderingContext2D,
    cellSize: number,
    acn: string,
    value: string
) => {
    const glyph = glyphToSvgMap.get(value);
    if (!glyph) return;

    const { x, y } = acnToXY(acn, cellSize);
    const cx = x + cellSize * 0.2;
    const cy = y - cellSize * 0.55;

    const svg = glyph(0);
    await drawSvgOnCanvas(ctx, svg, cx, cy, cellSize, cellSize);
};
