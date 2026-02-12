export const drawSvgOnCanvas = async (
    ctx: CanvasRenderingContext2D,
    svg: string,
    x: number,
    y: number,
    w: number,
    h: number
) => {
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    await new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, x, y, w, h);
            URL.revokeObjectURL(url);
            resolve();
        };
        img.onerror = () => reject(new Error('Failed to load SVG'));
        img.src = url;
    });
};

/**
 * Sets up a reusable canvas resize function that handles high-DPI displays.
 * Returns a resize function that can be called to update canvas dimensions.
 *
 * @param canvas - The HTML canvas element to resize
 * @returns A function that updates the canvas dimensions when called
 */
export function setupCanvasResize(canvas: HTMLCanvasElement): () => void {
    const resize = () => {
        const dpr = window.devicePixelRatio || 1;
        const currentWidth = canvas.clientWidth * dpr;
        const currentHeight = canvas.clientHeight * dpr;
        if (canvas.width !== currentWidth || canvas.height !== currentHeight) {
            canvas.width = currentWidth;
            canvas.height = currentHeight;
        }
    };
    return resize;
}
