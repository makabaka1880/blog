import blogConfig from "./blog.config";
import type { LanguageRegistration } from '@shikijs/core'
import { execFile } from 'node:child_process'
import { existsSync } from 'node:fs'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '1999-01-01',
    devtools: {
        enabled: true,

        timeline: {
            enabled: true,
        },
    },
    nitro: {
        rollupConfig: {
            plugins: [
                {
                    name: 'vue-default-export',
                    transform(code, id) {
                        if (id.includes('vue/index.mjs')) {
                            return code + '\nexport { default } from "./index.js";'
                        }
                    }
                }
            ]
        }
    },
    components: [
        // { path: "~/components/foliageUIKit", prefix: "Foliage" },
        { path: "~/components/ui/kit", prefix: "UIKit", pathPrefix: false },
        { path: "~/components/ui/utils", prefix: "Utils", pathPrefix: false },
        { path: "~/components/page/index", prefix: "IndexPage", pathPrefix: false },
        { path: "~/components/blog", prefix: "Blog", pathPrefix: false },
        { path: "~/components/content", pathPrefix: false },
        { path: "~/components/content/boxes", pathPrefix: false },
        { path: "~/components/content/utility", pathPrefix: false },
    ],
    css: ["~/assets/main.scss", "~/assets/twikoo.scss"],
    content: {
        build: {
            markdown: {
                highlight: {
                    // theme: blogConfig.highlight.theme as any,
                    langs: blogConfig.highlight.langs as any[],
                },
                remarkPlugins: {
                    "remark-math": {},
                },
                rehypePlugins: {
                    "rehype-katex": {
                    }
                },
            }
        }
    },
    modules: [
        '@nuxt/content',
        "@nuxtjs/mdc",
        '@nuxt/icon',
        '@vueuse/motion',
        "@nuxtjs/color-mode",
        '@bikariya/shiki',
        "@pinia/nuxt"
    ],
    colorMode: {
        preference: 'system',
        fallback: 'light',
        classPrefix: '',
        classSuffix: '',
    },
    plugins: [
        '~/plugins/configVueLibs',
    ],
    app: {
        baseURL: process.env.NUXT_APP_BASE_URL || '/',
        head: {
            title: blogConfig.title,
            htmlAttrs: {
                lang: blogConfig.language,
            },
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover',
            meta: [
                {
                    name: "author",
                    content: `${blogConfig.author.name} <${blogConfig.author.email}>`,
                },
            ],
            link: [
                { rel: "icon", type: "image/x-icon", href: blogConfig.favicon },
            ],
            script: [
                { src: "https://registry.npmmirror.com/twikoo/1.6.44/files/dist/twikoo.nocss.js" }
            ]
        },
    },
    icon: {
        customCollections: [
            {
                prefix: "icons-chess",
                dir: "./app/assets/icons/chess",
                normalizeIconName: false,
                width: 512,
                height: 512,
            }
        ]
    },
    hooks: {
        'build:before': () => {
            console.log('🔧 Running Python prebuild in .venv…')

            const pythonPath = '.venv/bin/python'  // standard venv on macOS
            if (!existsSync(pythonPath)) {
                console.log('⚠️ Skipping Python prebuild (missing .venv/bin/python).')
                return
            }

            try {
                const { stdout, stderr } = execFile(
                    pythonPath,
                    ['buildgraph.py'], // your script
                    {
                        env: { ...process.env } // inherit environment
                    }
                )

                if (stdout) console.log(stdout)
                if (stderr) console.error(stderr)
            } catch (err) {
                console.error('Python prebuild failed', err)
                //            process.exit(1) // fail the build
            }
        }
    }
})