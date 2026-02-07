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
