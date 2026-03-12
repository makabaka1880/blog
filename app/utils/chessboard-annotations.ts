/**
 * Chess annotation rendering utilities
 */

import type { VNode } from 'vue';
import { parseAnnotationLine } from './chessboard';
import { drawFigure } from './chessboard';
import { glyphToSvgMap } from './chessglyphs';
import { drawSvgOnCanvas } from './canvas-utils';
import { acnToCanvasCoords } from './chessboard-coords';

const GRID_SIZE = 8;

/**
 * Extract text content from Vue slot nodes
 */
export function extractText(node: any): string[] {
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
}

/**
 * Parse annotation lines from slot content
 */
export function parseAnnotationLines(slotNodes: VNode[]): string[] {
    const raw = slotNodes.flatMap(extractText).join("\n");
    return raw
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
}

/**
 * Draw all annotations on the canvas
 */
export async function drawAnnotations(
    ctx: CanvasRenderingContext2D,
    annotationLines: string[],
    cellSize: number,
    startFile: number,
    startRank: number
): Promise<void> {
    const annotations = annotationLines.map(parseAnnotationLine);

    for (const a of annotations) {
        switch (a.kind) {
            case 'arrow': {
                const { x: x0, y: y0 } = acnToCanvasCoords(a.from, startFile, startRank, cellSize);
                const { x: x1, y: y1 } = acnToCanvasCoords(a.to, startFile, startRank, cellSize);

                const headLength = cellSize * 0.5;
                const dx = x1 - x0;
                const dy = y1 - y0;
                const dist = Math.sqrt(dx * dx + dy * dy);

                ctx.strokeStyle = "#eb09";
                ctx.fillStyle = "#eb09";
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
                break;
            }
            case 'mark': {
                const { x, y } = acnToCanvasCoords(a.at, startFile, startRank, cellSize);
                ctx.lineWidth = cellSize / 15;
                ctx.beginPath();
                ctx.strokeStyle = "#eb09";
                ctx.arc(x, y, cellSize / 2 - cellSize / 30, 0, 2 * Math.PI);
                ctx.stroke();
                break;
            }
            case 'feedback': {
                const { x, y } = acnToCanvasCoords(a.at, startFile, startRank, cellSize);
                const glyph = glyphToSvgMap.get(a.value);
                if (glyph) {
                    const cx = x + cellSize * 0.2;
                    const cy = y - cellSize * 0.55;
                    const svg = glyph(0);
                    await drawSvgOnCanvas(ctx, svg, cx, cy, cellSize, cellSize);
                }
                break;
            }
            case 'wasfigure': {
                const file = a.at.charCodeAt(0) - "a".charCodeAt(0);
                const rank = GRID_SIZE - parseInt(a.at[1]!, 10);
                const white = a.piece === a.piece.toUpperCase();
                const name = a.piece.toLowerCase();
                await drawFigure(ctx, file - startFile, rank - startRank, name, white, cellSize, 0.55);
                break;
            }
        }
    }
}
