export type Token =
    | { kind: "MoveNumber"; value: number }
    | { kind: "MoveText"; text: string }
    | { kind: "LParen" }
    | { kind: "RParen" }
    | { kind: "Whitespace" };


export const tokenize = (stream: string): Token[] => {
    if (stream.length === 0) {
        return [];
    }

    const ws = /^\s+/.exec(stream);
    if (ws) {
        return [
            { kind: "Whitespace" },
            ...tokenize(stream.slice(ws[0].length)),
        ];
    }

    if (stream[0] === "(") {
        return [
            { kind: "LParen" },
            ...tokenize(stream.slice(1)),
        ];
    }

    if (stream[0] === ")") {
        return [
            { kind: "RParen" },
            ...tokenize(stream.slice(1)),
        ];
    }

    const moveNumber = /^(\d+)\.{1,3}/.exec(stream);
    if (moveNumber) {
        return [
            {
                kind: "MoveNumber",
                value: Number.parseInt(moveNumber[1]!, 10),
            },
            ...tokenize(stream.slice(moveNumber[0].length)),
        ];
    }

    const moveText = /^[^\s()]+/.exec(stream);
    if (moveText) {
        return [
            {
                kind: "MoveText",
                text: moveText[0],
            },
            ...tokenize(stream.slice(moveText[0].length)),
        ];
    }

    throw new Error(`Unexpected character: '${stream[0]}'`);
};
