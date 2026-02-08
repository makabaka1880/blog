import type { Token } from "./tokenizer";
import { tokenize } from "./tokenizer";
import type { Grid } from "../chessboard";

export type Move = {
    piece: `R` | `N` | `B` | `Q` | `K` | `P`;
    type: `move` | `capture` | `=Q` | `=R` | `=N` | `=B` | `check` | `mate`
    sourceRank: number | undefined
    sourceFile: number | undefined
    destination: Grid
}

export type Castle = `Long` | `Short`

export type MoveText = {
    move: Move | Castle;
    annotation: String | null
}

export type Turn = {
    white: { move: MoveText, sidelines: Line[] } | undefined;
    black: { move: MoveText, sidelines: Line[] } | undefined
}

export const parseSAN = (raw: string): MoveText | undefined => {
    const token = raw.trim();
    if (token.length === 0) return undefined;

    const shortCastling = /^(?:0-0|O-O|o-o)(.*)$/.exec(token);
    if (shortCastling) {
        return { move: "Short", annotation: shortCastling[1]!.trim() || null };
    }

    const longCastling = /^(?:0-0-0|O-O-O|o-o-o)(.*)$/.exec(token);
    if (longCastling) {
        return { move: "Long", annotation: longCastling[1]!.trim() || null };
    }

    type Match = {
        text: string;
        move: Move;
        annotation: string | null;
    };

    const toFile = (file: string | undefined) =>
        file ? file.charCodeAt(0) - "a".charCodeAt(0) : undefined;
    const toRank = (rank: string | undefined) =>
        rank ? Number.parseInt(rank, 10) - 1 : undefined;

    // Updated to handle the new specific promotion types
    const getMoveType = (isCapture: boolean, promoteStr: string | undefined, checkSuffix: string | undefined): Move["type"] => {
        if (checkSuffix === "#") return "mate";
        if (checkSuffix === "+") return "check";

        if (promoteStr) {
            const piece = promoteStr.replace("=", "").toUpperCase();
            return `=${piece}` as Move["type"];
        }

        if (isCapture) return "capture";
        return "move";
    };

    const matches: Match[] = [];

    // 1. Piece move (though pieces don't usually promote, SAN regex handles the structure)
    const pieceMove = /^([RNBQK])([a-h][1-8]|[a-h]|[1-8])?(x)?([a-h][1-8])(=?[RNBQ])?([+#])?/.exec(token);
    if (pieceMove) {
        const [full, piece, disambig, capture, dest, promote, check] = pieceMove;
        const sourceFile = disambig?.length === 2 ? toFile(disambig[0]) : toFile(/[a-h]/.test(disambig ?? "") ? disambig : undefined);
        const sourceRank = disambig?.length === 2 ? toRank(disambig[1]) : toRank(/[1-8]/.test(disambig ?? "") ? disambig : undefined);

        const move: Move = {
            piece: piece as Move["piece"],
            sourceFile,
            sourceRank,
            destination: dest as any, // Cast to Grid
            type: getMoveType(!!capture, promote, check)
        };
        const annotation = token.slice(full.length).trim() || null;
        matches.push({ text: full, move, annotation });
    }

    // 2. Pawn capture 
    const pawnCapture = /^([a-h])x([a-h][1-8])(=?[RNBQ])?([+#])?/.exec(token);
    if (pawnCapture) {
        const [full, fromFile, dest, promote, check] = pawnCapture;
        const move: Move = {
            piece: "P",
            sourceFile: toFile(fromFile),
            sourceRank: undefined,
            destination: dest as any,
            type: getMoveType(true, promote, check)
        };
        const annotation = token.slice(full.length).trim() || null;
        matches.push({ text: full, move, annotation });
    }

    // 3. Pawn move 
    const pawnMove = /^([a-h][1-8])(=?[RNBQ])?([+#])?/.exec(token);
    if (pawnMove) {
        const [full, dest, promote, check] = pawnMove;
        const move: Move = {
            piece: "P",
            sourceFile: undefined,
            sourceRank: undefined,
            destination: dest as any,
            type: getMoveType(false, promote, check)
        };
        const annotation = token.slice(full.length).trim() || null;
        matches.push({ text: full, move, annotation });
    }

    if (matches.length === 0) return undefined;

    const best = matches.reduce((a, b) => (b.text.length > a.text.length ? b : a));
    return { move: best.move, annotation: best.annotation };
}
export const toSANMove = (moveText: MoveText | undefined): string => {
    if (moveText == undefined) return "..."
    const { move, annotation } = moveText;
    const annotStr = annotation ?? "";

    // 1. Handle Castling (Short | Long)
    if (typeof move === "string") {
        const castleStr = move === "Short" ? "O-O" : "O-O-O";
        return `${castleStr}${annotStr}`;
    }

    // 2. Handle Regular Moves
    const { piece, type, sourceFile, sourceRank, destination } = move;

    // Helper to convert internal 0-7 indices back to 'a'-'h' and '1'-'8'
    const fileToChar = (f: number | undefined) =>
        f !== undefined ? String.fromCharCode(f + "a".charCodeAt(0)) : "";
    const rankToChar = (r: number | undefined) =>
        r !== undefined ? (r + 1).toString() : "";

    // Pawns don't show the 'P' character in SAN
    const pieceStr = piece === "P" ? "" : piece;

    const disambiguation = `${fileToChar(sourceFile)}${rankToChar(sourceRank)}`;

    // Action symbol: 'x' for capture, empty for others
    // Note: In SAN, promotion captures look like 'exd8=Q'
    const action = type === "capture" ? "x" : "";

    // Special suffixes
    let suffix = "";
    if (type === "check") suffix = "+";
    else if (type === "mate") suffix = "#";
    else if (type.startsWith("=")) suffix = type; // e.g., "=Q"

    return `${disambiguation}${action}${destination}${suffix}${annotStr}`;
};

export type RawLine = Array<MoveText | RawLine | undefined>
export type Line = Array<Turn>

export const goParse = (stream: Token[]): { out: RawLine; rest: Token[] } => {
    if (stream.length === 0) {
        return { out: [], rest: [] };
    }

    const [first, ...tail] = stream;

    switch (first!.kind) {
        case "Whitespace": {
            return goParse(tail);
        }

        case "MoveNumber": {
            return goParse(tail);
        }

        case "MoveText": {
            const move = parseSAN(first!.text);
            const next = goParse(tail);
            return {
                out: [move, ...next.out],
                rest: next.rest,
            };
        }

        case "LParen": {
            const inner = goParse(tail);

            if (inner.rest[0]?.kind !== "RParen") throw new Error("Unclosed '('");

            const after = goParse(inner.rest.slice(1));

            return {
                out: [inner.out, ...after.out],
                rest: after.rest,
            };
        }

        case "RParen": {
            return {
                out: [],
                rest: stream,
            };
        }
    }
};

export const rawlineToTurns = (raw: RawLine, isWhiteToMove: boolean = true): Line | undefined => {
    const acc: Line = [];
    let currentTurn: Turn = { white: undefined, black: undefined };
    let whiteTurn = isWhiteToMove;

    raw.forEach((item) => {
        if (item === undefined) {
            // Usually indicates a move number or gap; 
            // In some PGNs, '1... e5' means it's black's turn.
            whiteTurn = false;
            return;
        }

        if (Array.isArray(item)) {
            // Sidelines: Attach to the move immediately preceding the parenthesis.
            const converted = rawlineToTurns(item, !whiteTurn);
            if (!converted) return;

            if (whiteTurn) {
                // If it's currently White's turn to move, the sideline belongs to the previous Black move
                const lastTurn = acc[acc.length - 1];
                if (lastTurn?.black) {
                    lastTurn.black.sidelines.push(converted);
                }
            } else {
                // If it's Black's turn to move, the sideline belongs to the White move just played
                if (currentTurn.white) {
                    currentTurn.white.sidelines.push(converted);
                }
            }
            return;
        }

        // Process MoveText
        if (whiteTurn) {
            currentTurn.white = { move: item, sidelines: [] };
            whiteTurn = false;
        } else {
            currentTurn.black = { move: item, sidelines: [] };
            acc.push({ ...currentTurn });
            currentTurn = { white: undefined, black: undefined };
            whiteTurn = true;
        }
    });

    // Catch trailing white move
    if (currentTurn.white || currentTurn.black) {
        acc.push(currentTurn);
    }

    return acc.length > 0 ? acc : undefined;
};

export const parsePGN = (input: String): Line | undefined => {
    const tokens = tokenize(input.toString().trim());
    const { out, rest } = goParse(tokens);
    const lines = rawlineToTurns(out);
    console.log("PARSEPGN", out)
    console.log(lines)

    return lines
}
