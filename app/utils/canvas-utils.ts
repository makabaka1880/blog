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
