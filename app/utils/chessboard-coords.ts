/**
 * Chess coordinate utilities for board rendering
 */

export interface CropBounds {
    minFile: number;
    maxFile: number;
    minRank: number;
    maxRank: number;
}

export interface GridSize {
    width: number;
    height: number;
}

/**
 * Parse crop string (e.g., "a1-h8" or "d4-f6") into bounds
 */
export function parseCropBounds(crop: string): CropBounds | null {
    const match = crop.match(/^([a-h])([1-8])-([a-h])([1-8])$/i);
    if (!match) return null;

    const [, fromFile, fromRank, toFile, toRank] = match;
    if (!fromFile || !fromRank || !toFile || !toRank) return null;

    const files = 'abcdefgh';
    const ranks = '87654321'; // Reversed because rank 8 is at top

    return {
        minFile: Math.min(files.indexOf(fromFile.toLowerCase()), files.indexOf(toFile.toLowerCase())),
        maxFile: Math.max(files.indexOf(fromFile.toLowerCase()), files.indexOf(toFile.toLowerCase())),
        minRank: Math.min(ranks.indexOf(fromRank), ranks.indexOf(toRank)),
        maxRank: Math.max(ranks.indexOf(fromRank), ranks.indexOf(toRank))
    };
}

/**
 * Calculate grid size from crop bounds
 */
export function calculateGridSize(cropBounds: CropBounds | null, defaultSize: number): GridSize {
    if (!cropBounds) return { width: defaultSize, height: defaultSize };
    const { minFile, maxFile, minRank, maxRank } = cropBounds;
    return {
        width: maxFile - minFile + 1,
        height: maxRank - minRank + 1
    };
}

/**
 * Convert ACN notation to canvas coordinates (cropped)
 */
export function acnToCanvasCoords(
    acn: string,
    startFile: number,
    startRank: number,
    cellSize: number
): { x: number; y: number } {
    const file = acn.charCodeAt(0) - "a".charCodeAt(0);
    const rank = parseInt(acn[1]!, 10) - 1;
    const x = (file - startFile + 0.5) * cellSize;
    const y = (7 - rank - startRank + 0.5) * cellSize;
    return { x, y };
}

/**
 * Draw coordinate labels on the board
 */
export function drawCoordinates(
    ctx: CanvasRenderingContext2D,
    cellSize: number,
    gridWidth: number,
    gridHeight: number,
    colors: { light: string; dark: string },
    startFile: number,
    startRank: number
): void {
    ctx.font = `${cellSize * 0.15}px JetBrains Mono`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Draw rank labels (numbers)
    for (let rank = 0; rank < gridHeight; rank += 1) {
        const actualRank = startRank + rank;
        const label = String(8 - actualRank);
        const x = 0.15 * cellSize;
        const y = (rank + 0.15) * cellSize;
        ctx.fillStyle = (startFile + actualRank) % 2 === 0 ? colors.dark : colors.light;
        ctx.fillText(label, x, y);
    }

    // Draw file labels (letters)
    for (let file = 0; file < gridWidth; file += 1) {
        const actualFile = startFile + file;
        const label = String.fromCharCode(97 + actualFile).toUpperCase();
        const x = (file + 0.85) * cellSize;
        const y = (gridHeight - 0.15) * cellSize;
        ctx.fillStyle = (actualFile + startRank + gridHeight - 1) % 2 === 1 ? colors.dark : colors.light;
        ctx.fillText(label, x, y);
    }
}

/**
 * Calculate mouse position to board coordinates
 */
export function mouseToBoard(
    mouseX: number,
    mouseY: number,
    rect: DOMRect,
    gridWidth: number,
    startFile: number,
    startRank: number
): { file: number; rank: number } {
    const cellSize = rect.width / gridWidth;
    const croppedFile = Math.floor((mouseX - rect.left) / cellSize);
    const croppedRank = Math.floor((mouseY - rect.top) / cellSize);

    return {
        file: croppedFile + startFile,
        rank: croppedRank + startRank
    };
}
