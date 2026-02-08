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

export type GlyphKey =
    | "inaccuracy" | "mistake" | "blunder" | "interesting" | "good" | "brilliant"
    | "correct" | "incorrect" | "onlyMove" | "zugzwang" | "equal" | "unclear"
    | "whiteSlightlyBetter" | "blackSlightlyBetter" | "whiteBetter" | "blackBetter"
    | "whiteWinning" | "blackWinning" | "novelty" | "development"
    | "initiative" | "attack" | "counterplay" | "timeTrouble";

// Mapping the shorthand notation symbols to your new Map keys
const symbolToKey: Record<string, GlyphKey> = {
    "??": "blunder",
    "?": "mistake",
    "?!": "inaccuracy",
    "!?": "interesting",
    "!": "good",
    "!!": "brilliant",
    "-correct": "correct",
    "-incorrect": "incorrect"
};

type Annotation =
    | { kind: "mark"; at: Grid }
    | { kind: "feedback"; at: Grid; value: GlyphKey }
    | { kind: "arrow"; from: Grid; to: Grid };

export function parseAnnotationLine(line: string): Annotation {
    const trimmed = line.trim();

    // 1. Handle Arrows (e.g., "e2->e4")
    if (trimmed.includes("->")) {
        const [from, to] = trimmed.split("->").map(s => s.trim()) as [Grid, Grid];
        return { kind: "arrow", from, to };
    }

    // 2. Handle Feedback/Glyphs (e.g., "e4!!")
    // We sort keys by length descending to ensure "!!" is matched before "!"
    const symbols = Object.keys(symbolToKey).sort((a, b) => b.length - a.length);
    const foundSymbol = symbols.find(sym => trimmed.endsWith(sym));

    if (foundSymbol) {
        const coord = trimmed.slice(0, -foundSymbol.length) as Grid;
        // Basic validation for the coordinate part
        if (/^[a-h][1-8]$/.test(coord)) {
            return {
                kind: "feedback",
                at: coord,
                value: symbolToKey[foundSymbol]!
            };
        }
    }

    // 3. Handle Marks (e.g., "e4")
    if (/^[a-h][1-8]$/.test(trimmed)) {
        return { kind: "mark", at: trimmed as Grid };
    }

    throw new Error(`Invalid annotation: ${line}`);
}

export const getCanvasColors = (el: HTMLCanvasElement) => {
    const styles = getComputedStyle(el);
    return {
        light: styles.getPropertyValue('--light-square').trim() || '#eee',
        dark: styles.getPropertyValue('--dark-square').trim() || '#333',
    };
};

const figureImages = new Map<string, Promise<HTMLImageElement>>();

const codePiece = (name: string, white: boolean) => (white ? 'w' : 'b') + name.toUpperCase();

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
    cellsize: number
) => {
    if (!(0 <= file && file <= 7 && 0 <= rank && rank <= 7)) return;
    const code = codePiece(name, white);
    const img = await loadFigureImage(code);

    const x = (file + 0.5) * cellsize - cellsize / 2;
    const y = (rank + 0.5) * cellsize - cellsize / 2;
    ctx.drawImage(img, x, y, cellsize, cellsize);
};

export const drawBoard = (el: HTMLCanvasElement, gridSize: number = GRID_SIZE) => {
    const dpr = window.devicePixelRatio || 1;
    const rect = el.getBoundingClientRect();

    el.width = rect.width * dpr;
    el.height = rect.height * dpr;

    const ctx = el.getContext('2d');
    if (!ctx) return null;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const { light, dark } = getCanvasColors(el);
    const cellSize = rect.width / gridSize;

    for (let y = 0; y < gridSize; y += 1) {
        for (let x = 0; x < gridSize; x += 1) {
            ctx.fillStyle = (x + y) % 2 === 0 ? light : dark;
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }

    return { ctx, cellSize };
};

const composeGlyph = (fill: string, path: string) => () => `
<defs>
    <filter id="badge-shadow">
        <feDropShadow
            dx="4"
            dy="7"
            stdDeviation="5"
            flood-opacity=".5"
        />
    </filter>
</defs>

<g transform="matrix(.4 0 0 .4 0 0)">
    <circle
        cx="50"
        cy="50"
        r="50"
        fill="${fill}"
        filter="url(#badge-shadow)"
    />
    ${path}
</g>
`;
