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

    const img = new Image();
    console.log(img)
    img.onload = () => {
        ctx.drawImage(img, x, y, w, h);
        URL.revokeObjectURL(url);
    };
    img.src = url;
};
