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
                createTime: z.string().time().optional(),
                updateTime: z.string().time().optional(),
                collection: z.string(),
                // theme: z.object({}).optional(),
                rawbody: z.string()
            })
        })
    }
})