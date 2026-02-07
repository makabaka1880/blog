import blogConfig from "./blog.config";
import type { LanguageRegistration } from '@shikijs/core'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '1999-01-01',
    devtools: {
        enabled: true,

        timeline: {
            enabled: true,
        },
    },
    components: [
        // { path: "~/components/foliageUIKit", prefix: "Foliage" },
        { path: "~/components/uikit", prefix: "UIKit" },
        "~/components",
    ],
    css: ["~/assets/main.scss", "katex/dist/katex.min.css"],
    content: {
        build: {
            markdown: {
                highlight: {
                    theme: blogConfig.highlight.theme,
                    langs: blogConfig.highlight.languages as (LanguageRegistration)[],
                },
                remarkPlugins: {
                    "remark-math": {},
                },
                rehypePlugins: {
                    "rehype-katex": {}
                },
            }
        }
    },
    modules: ['@nuxt/content', "@nuxtjs/mdc", '@nuxt/image'],
    plugins: [
        '~/plugins/configVueLibs',
    ],
    app: {
        baseURL: process.env.NUXT_APP_BASE_URL || '/',
        head: {
            htmlAttrs: {
                lang: blogConfig.language,
            },
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
            meta: [
                {
                    name: "author",
                    content: `${blogConfig.author.name} <${blogConfig.author.email}>`,
                },
            ],
            link: [
                { rel: "icon", type: "image/x-icon", href: blogConfig.favicon },
                {
                    rel: 'stylesheet',
                    href: 'https://cdn.jsdelivr.net/npm/katex@0.11.0/dist/katex.min.css'
                }
            ],
        },
    },
})
