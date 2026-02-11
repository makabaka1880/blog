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
    components: [
        // { path: "~/components/foliageUIKit", prefix: "Foliage" },
        { path: "~/components/uikit", prefix: "UIKit" },
        "~/components",
    ],
    css: ["~/assets/main.scss", "katex/dist/katex.min.css", "~/assets/twikoo.scss"],
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
    modules: ['@nuxt/content', "@nuxtjs/mdc", '@nuxt/image', '@nuxt/icon'],
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
