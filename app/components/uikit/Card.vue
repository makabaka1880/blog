<template>
    <component :is="linkComponent" v-bind="linkProps" class="card-wrapper">
        <div class="foliage-card">
            <div>
                <h3 class="card-title">{{ title }}</h3>
                <p v-if="subtitle" class="card-subtitle">{{ subtitle }}</p>
            </div>
            <p v-if="desc" class="card-desc">{{ desc }}</p>
            <div class="card-content">
                <slot/>
            </div>
            <div v-if="$slots.footer" class="card-footer">
                <slot name="footer"/>
            </div>
        </div>
    </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    title: string,
    subtitle?: string,
    desc?: string,
    to?: string,
    type?: string,
    // 新增：允许控制预加载行为
    prefetch?: boolean,
    noPrefetch?: boolean,
}>()

// 改进的 Nuxt 检测
const isNuxt = computed(() => {
    // 服务端渲染时的检测
    if (process.env.NODE_ENV === 'server') {
        return true
    }
    // 客户端检测 - 更可靠的方法
    return typeof window !== 'undefined' && (
        '__NUXT__' in window ||
        document.querySelector('#__nuxt') !== null
    )
})

const isExternalLink = computed(() =>
    !!props.to && /^(https?:)?\/\//.test(props.to)
)

// 动态组件选择
const linkComponent = computed(() => {
    if (!props.to) return 'div'
    if (isExternalLink.value) return 'a'
    return isNuxt.value ? resolveComponent('NuxtLink') : resolveComponent('RouterLink')
})

// 动态属性绑定
const linkProps = computed(() => {
    if (!props.to) return {}

    const baseProps: Record<string, any> = {}

    if (isExternalLink.value) {
        // 外部链接属性
        baseProps.href = props.to
        baseProps.target = '_blank'
        baseProps.rel = 'noopener noreferrer'
    } else {
        // 内部链接属性
        baseProps.to = props.to

        // 预加载控制 - 显式传递给 NuxtLink
        if (props.noPrefetch) {
            baseProps.noPrefetch = true
        } else if (props.prefetch !== undefined) {
            baseProps.prefetch = props.prefetch
        }
        // 如果没有指定，让 NuxtLink 使用默认行为
    }

    return baseProps
})
</script>

<style scoped>
.foliage-card {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: var(--color-card-bg);
    border: 1.6px solid var(--color-border);
    border-radius: 4px;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    user-select: none;
}
.foliage-card:hover {
    background-color: var(--color-card-hover-bg);
}

.card-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text);
}

.card-subtitle {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
}

.card-desc {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    line-height: 1.5;
}

.card-wrapper {
    text-decoration: none;
    color: inherit;
    display: block;
}

.card-wrapper:hover .foliage-card {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 确保 div 类型的卡片不显示 pointer cursor */
div.card-wrapper {
    cursor: default;
}

div.card-wrapper .foliage-card {
    cursor: default;
}

.card-content {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
}

.card-footer {
    margin-top: 1rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--color-border);
    font-size: 0.75rem;
    color: var(--color-text-muted);
    display: flex;
    gap: 1rem;
}
</style>