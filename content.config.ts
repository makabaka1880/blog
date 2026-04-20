// NuxtContent configure collections documentation | https://content.nuxt.com/docs/collections/define
import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
    collections: {
        articles: defineCollection({
            type: 'page',
            source: {
                include: '**/*.md',
                exclude: ['**/draft/**', '**/draft'],
            },
            // Custom fields
            schema: z.object({
                title: z.string(),
                description: z.string(),
                createTime: z.string().date().optional(),
                updateTime: z.string().date().optional(),
                rawbody: z.string().optional()
            })
        }),
        collections: defineCollection({
            type: 'data',
            source: {
                include: 'collections/*.yml'
            },
            schema: z.object({
                name: z.string(),
                description: z.string(),
                entries: z.array(z.string()),
                cover: z.string(),
                stem: z.string().optional()
            })
        }),
        friends: defineCollection({
            type: 'data',
            source: {
                include: 'friends/*.json'
            },
            schema: z.object({
                name: z.string(),
                description: z.string(),
                site: z.string(),
                avatar: z.string(),
            })
        })
    }
})
