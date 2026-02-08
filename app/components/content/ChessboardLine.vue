<template>
    <div class="chessboard-line-container">
        <div class="chessboard-line">
            <div class="board">
                <Chessboard :fen="fen" :coords="coords">
                    <slot />
                </Chessboard>
            </div>
            <div class="line">
                <ChesslineTree :line="line" :linear="linear" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
    fen: string;
    line: string;
    coords?: boolean;
    linear?: boolean;
}>(), {
    coords: true,
    linear: false,
});

const { fen, line, coords, linear } = props;
</script>

<style lang="scss" scoped>
@use "~/assets/theme.scss" as *;

.chessboard-line-container {
    display: block;
    margin: 2rem auto;
}

.chessboard-line {
    display: flex;
    gap: 2rem;
    margin: 0 auto;
    width: max-content;
}

.board {
    display: flex;
    justify-content: center;
}

.line {
    padding: 1rem 1.25rem;
    background: var(--color-card-bg);
    border: 1px solid var(--color-card-border);
    border-radius: 8px;
    height: 40vw;

    margin: auto 0;
    width: max-content;
}

@media (max-width: $critical-width) {
    .chessboard-line {
        flex-direction: column;
        align-items: center;
        gap: 0;
    }

    .line {
        width: 80%;
        height: auto;
    }
}
</style>
