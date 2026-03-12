<!-- SOURCE: ZHILU BLOG -->
<script lang="tsx" setup>
const slots = defineSlots<{
    default: () => VNode[]
}>()

function render() {
    const slotContent = slots.default()
    if (!slotContent)
        return <span>无会话内容</span>

    return slotContent.map((node: VNode) => {
        // WARN: 此处使用了非标准的 v-slot:default
        const textContent = (node.children as any)?.default?.()[0].children
        const body = <dd class="chat-body">{node}</dd>
        if (typeof textContent !== 'string')
            return body

        const match = textContent.match(/^\{(?<control>\.|:)?(?<caption>.*)\}$/)
        if (!match)
            return body

        const { caption, control } = match?.groups || {}
        const controlClass = control === '.' ? 'chat-myself' : control === ':' ? 'chat-system' : ''
        return <dt class={`chat-caption ${controlClass}`}>{caption}</dt>
    })
}
</script>

<template>
    <dl class="chat">
        <render />
    </dl>
</template>

<style lang="scss" scoped>
@use '~/assets/theme.scss' as *;

.chat {
    margin-inline: 1vw;
    font-size: var(--font-size-md);
}


:deep() {
    p {
        margin-top: 0.3rem;
        margin-bottom: 0.3rem;
    }
    .chat-caption {
        opacity: 0.8;
        font-size: var(--font-size-md);
        color: var(--color-text-muted);
    }

    .chat-body {
        overflow: hidden;
        width: fit-content;
        max-width: 90%;
        margin-bottom: 1em;
        padding: 0 1em;
        border-radius: 1em;
        border-start-start-radius: 0.2em;
        background-color: var(--color-card-background);
        border: 0.0625rem solid var(--color-border);
        color: var(--color-text);
    }

    .chat-text {
        margin: 0 0;
    }

    .chat-system {
        margin-bottom: 1em;
        text-align: center;
        color: var(--color-text-muted);
    }

    .chat-myself {
        text-align: end;

        &+.chat-body {
            width: fit-content;
            margin-inline-start: auto;
            border-radius: 1em;
            border-start-end-radius: 0.2em;
            background-color: var(--color-chat-myself-background);
            border-color: var(--color-chat-myself-border);
        }
    }
}
</style>
