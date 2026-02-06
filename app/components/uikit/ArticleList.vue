<template>
    <div class="thumbnail-card" v-for="(article, i) in articles" :key="article.path">
        <UIKitThumbnailCard :title="article.title" :subtitle="`Updated: ${article.updateTime}`"
            :desc="article.description" :to="article.path" />
    </div>
</template>


<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
    page: number
    articles?: any[]
    pending?: boolean
    error?: any
    perPage?: number
    sortOrder?: 'ASC' | 'DES'
}>()

const emit = defineEmits<{
    (e: 'update:total-count', count: number): void
}>()

const articles = ref<any[]>([])
const loading = ref(false)
const totalCount = ref(0)

async function fetchArticles() {
    loading.value = true
    try {
        if (props.articles) {
            articles.value = props.articles
            totalCount.value = props.articles.length
            emit('update:total-count', props.articles.length)
        } else {
            // 获取总数
            const allArticles = await queryCollection('articles')
                .select('path')
                .all()
            totalCount.value = allArticles.length
            emit('update:total-count', allArticles.length)

            // 获取分页数据
            articles.value = await queryCollection('articles')
                .select('title', 'description', 'updateTime', 'path')
                .order('updateTime', props.sortOrder || 'DESC')
                .skip((props.page - 1) * (props.perPage || 10))
                .limit(props.perPage || 10)
                .all()
            console.log(articles)
        }
    } catch (err) {
        console.error('Failed to fetch articles:', err)
        articles.value = []
        totalCount.value = 0
        emit('update:total-count', 0)
    } finally {
        loading.value = false
    }
}

// 初始化加载
fetchArticles()

// 监听 page 变化，重新加载数据
watch(() => props.page, () => {
    fetchArticles()
})

// 监听 articles prop 变化
watch(() => props.articles, (newArticles) => {
    if (newArticles) {
        articles.value = newArticles
        totalCount.value = newArticles.length
        emit('update:total-count', newArticles.length)
    }
}, { deep: true })

</script>
