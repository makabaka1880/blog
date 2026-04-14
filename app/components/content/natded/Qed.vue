<template>
    <div class="qed-container">
        <div class="qed-box">
            <span class="qed-text">Q<small>uite</small> E<small>asily</small> D<small>one</small></span>
        </div>
    </div>
</template>

<script lang="ts">
</script>

<style scoped>
.qed-container {
    display: flex;
    justify-content: flex-end;
    width: 100%;
}

.qed-box {
    width: 0.8rem;
    height: 0.8rem;
    border: 1px solid currentColor;
    border-radius: 1px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: grab;
    transition:
        width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
        height 0.3s cubic-bezier(0.4, 0, 0.2, 1),
        border-radius 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.qed-box:hover {
    width: 8rem;
    height: 2rem;
    border-radius: 3px;
}

.qed-text {
    font-size: 0.7rem;
    font-style: italic;
    letter-spacing: 0.05em;
    opacity: 0;
    transform: scale(0.6);
    transition:
        opacity 0.2s ease 0.15s,
        transform 0.2s ease 0.15s;
    white-space: nowrap;
    user-select: none;
}

.qed-box:hover .qed-text {
    opacity: 1;
    transform: scale(1);
}
small {
    opacity: 0.5;
    font-size: 0.6rem;
}
</style>