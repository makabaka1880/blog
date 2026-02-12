<template>
    <div class="chessboard-line-container">
        <div class="chessboard-line-header" v-if="showHeader && headerText">{{ headerText }}</div>
        <!-- <div class="chessboard-line-wrap"> -->
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
        <!-- </div> -->
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
const props = withDefaults(defineProps<{
    fen: string;
    line: string;
    coords?: boolean;
    linear?: boolean;
    showHeader?: boolean;
    title?: string;
    white?: string;
    black?: string;
    event?: string;
    site?: string;
    date?: string;
    round?: string;
}>(), {
    coords: true,
    linear: false,
    showHeader: true,
    title: '',
    white: '',
    black: '',
    event: '',
    site: '',
    date: '',
    round: '',
});

const { fen, line, coords, linear, showHeader, title, white, black, event, site, date, round } = props;

const headerText = computed(() => {
    if (title) return title;
    const whiteLabel = white || 'White';
    const blackLabel = black || 'Black';
    const base = `${whiteLabel} vs ${blackLabel}`;
    const details = [event, site, date, round].filter(Boolean);
    return details.length ? `${base} — ${details.join(', ')}` : base;
});
</script>

<style lang="scss" scoped>
@use "~/assets/theme.scss" as *;

.chessboard-line-container {
    display: block;
    width: 100%;
    max-width: 100%;
    margin: 2rem auto;
    overflow-x: hidden;
}

.chessboard-line {
    display: flex;
    gap: 0;
    margin: 0 auto;
    width: 100%;
    max-width: 100%;
    background-color: var(--color-card-bg);

    & * {
        margin: 0;
    }
}

.chessboard-line-header {
    margin: 0 0 0.75rem;
    font-weight: 600;
    color: var(--color-text);
    font-size: 1rem;
}

.board {
    display: flex;
    justify-content: center;
    flex: 0 0 auto;
}

.line {
    padding: 1rem 1.25rem;
    background: var(--color-card-bg);
    height: 40vw;
    max-height: 500px;
    overflow-y: auto;

    width: 100%;
    max-width: 400px;
    flex: 1 1 auto;
}

.line :deep(.chessline-turn + .chessline-turn) {
    border-top: 1px solid var(--color-border);
    margin-top: 0.5rem;
    padding-top: 0.5rem;
}

@media (max-width: $critical-width) {
    .chessboard-line {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }

    .line {
        width: 100%;
        max-width: none;
        height: auto;
        max-height: 400px;
    }
}
</style>
