import blogConfig from "./blog.config";

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
    css: ["~/assets/main.scss"],
    content: {
        build: {
            markdown: {
            }
        }
    },
    modules: ['@nuxt/content', "@nuxt/icon"],
    app: {
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
            ],
        },
    },
})