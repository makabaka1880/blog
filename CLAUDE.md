# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog built with Nuxt 4, Vue 3, and Nuxt Content. Uses pnpm for package management and includes an optional Python embedding pipeline for article relationship graphs.

**Critical:** The app runs in SPA mode (`ssr: false` in nuxt.config.ts) — all rendering is client-side. There is no server-side rendering.

## Development Commands

```bash
# Development
pnpm install              # Install dependencies
pnpm dev                  # Start dev server at http://localhost:3000

# Building
pnpm build                # Production build
pnpm generate             # Generate static site (used for GitHub Pages deploy)
pnpm preview              # Preview production build

# Content Management
pnpm new:article "Title"  # Create draft article in content/draft/

# Optional Python Pipeline
pnpm buildgraph           # Run embedding pipeline (requires .venv + Python 3.11+)
# Setup: python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt

# Asset Generation
pnpm assets:genmaps       # Generate depth maps for public/assets/*-albedo.*
```

**Note:** There are no tests, no linter (ESLint), and no formatter (Prettier) configured in this project. There is no `test`, `lint`, or `format` script.

## CI/CD

GitHub Actions deploys to GitHub Pages on push to `main` (`.github/workflows/deploy.yml`):
- Runs `pnpm run generate` for static site generation
- Installs `better-sqlite3` separately (needs native compilation)
- Uploads `.output/public` as the Pages artifact
- The Python buildgraph step is commented out in CI

## Environment Variables

- `NUXT_APP_BASE_URL` — sets `app.baseURL` in nuxt.config.ts (defaults to `/`)

## Architecture

### Rendering Mode (SPA)

`ssr: false` — the entire app is a single-page application. All rendering happens client-side. This means:
- `useAsyncData` / `useFetch` still work but execute on the client
- No server-side Nuxt APIs are available
- `import.meta.server` guards exist in plugins (e.g., `configVueLibs.ts`) for safety

### Content System

- **Content Collections**: Defined in `content.config.ts`:
  - `articles` (type: `page`) — Markdown articles from `**/articles/*.md`, excluding `draft/`
  - `collections` (type: `data`) — YAML files from `collections/*.yml` that group articles by topic
  - `friends` (implicit) — JSON files from `content/friends/`, auto-inferred by Nuxt Content (not in content.config.ts)

- **Article Frontmatter Schema** (`articles` collection):
  - `title: string` (required)
  - `description: string` (required)
  - `createTime: string` (optional, ISO date YYYY-MM-DD)
  - `updateTime: string` (optional, ISO date YYYY-MM-DD)
  - `rawbody: string` (optional)
  - `tags: string[]` (default `[]`)
  - `ligatures: boolean` (default `true` — when `false`, disables font ligatures on the article page)

- **Collections Schema** (YAML files):
  - `name`, `description`, `cover: string`, `entries: string[]` (article stems), `stem: string` (optional)

- **Content Workflow**:
  - Drafts go in `content/draft/`
  - Published articles in `content/articles/`
  - Article asset directories live under `public/assets/<article-slug>/`

- **Markdown Processing**: Uses `remark-math` + `rehype-mathjax` (with custom XyJax CDN for commutative diagrams). Shiki for syntax highlighting with a custom ayu theme from `configs/theme-light.json`.

### MDC Components (Markdown Components)

Articles use MDC (Markdown Components) syntax — Vue components invoked in markdown via `::ComponentName` blocks. These live under `components/content/` (auto-imported without prefix):

- **Boxes** (`components/content/boxes/`): Callout blocks — `BaseBox`, `DefBox`, `TheoremBox`, `ExampleBox`, `NoteBox`, `WarningBox`, `HintBox`, `LemmaBox`, `CorollaryBox`, `ErrorBox`, `QaBox`, `QuoteBox`, `SpoilerBox`. All wrap `BaseBox.vue` with different `backgroundChar`/`boxType` props.
- **MCQs** (`components/content/boxes/`): `Mcq` (single-correct), `McqMultiple` (multi-select). Generated via the `mdc-mcq-generator` Claude agent.
- **Chess**: `Chessboard`, `ChesslineTree`, `Chessline`, `ChesslineLinear`, `Chessturn`
- **Interactive**: `Chat`, `DrinkAnimation`, `EmojiClock`, `LinkCard`, `MusicPlayer`, `Pseudocode`, `ShaderInteractive`
- **Parallax**: `ParallaxWindow`, `ParallaxWindowMousetrack`, `ParallaxWindowScrolltrack`
- **Prose**: Overrides for standard HTML elements — `ProseH1`–`ProseH6`, `ProseP`, `ProseCode`, `ProsePre`, `ProseTable`, `ProseBlockquote`, etc.
- **Utility**: `Blur`, `Folding`, `Pic`, `Tip`, `WebglCanvas` (GLSL shader rendering)
- **Natural Deduction**: `FlagDeriv`, `Qed`

When creating articles with MDC components, use the `micro-content-editor` agent for localized edits and the `mdc-mcq-generator` agent for MCQ creation.

### Component Organization

Components are auto-imported with specific prefixes (configured in `nuxt.config.ts`):
- `~/components/ui/kit` → `UIKit` prefix (e.g., `UIKitNav`, `UIKitFooter`)
- `~/components/ui/utils` → `Utils` prefix (e.g., `UtilsRevealSlider`)
- `~/components/page/index` → `IndexPage` prefix (e.g., `IndexPageHeroSection`)
- `~/components/blog` → `Blog` prefix (e.g., `BlogSidebar`, `BlogSearchModal`)
- `~/components/content` and subdirectories → no prefix (used for MDC components)

### Layouts

Three layouts in `app/layouts/`:
- `default.vue` — Standard layout with sticky navbar, sidebar (BlogSidebar), and footer
- `defaultUnsafe.vue` — Minimal layout without sidebar; nav uses `position: fixed`. Used by `index-.vue` (enriched homepage)
- `article.vue` — Article layout that loads ToC links into BlogSidebar and loads `adjacency.json` for related articles

### Routing

| Route | File | Layout |
|---|---|---|
| `/` | `pages/index.vue` | `default` |
| `/` (alternate) | `pages/index-.vue` | `defaultUnsafe` |
| `/articles` | `pages/articles/index.vue` | `default` |
| `/articles/*` | `pages/articles/[...slug].vue` | `article` |
| `/collections` | `pages/collections/index.vue` | `default` |
| `/collections/*` | `pages/collections/[...slug].vue` | `default` |
| `/link` | `pages/link/index.vue` | `default` |
| `/friends` | `pages/friends.vue` | `default` |
| `/webgl-test` | `pages/webgl-test.vue` | `default` |
| `/*` (catch-all) | `pages/[...slug].vue` | `default` (404) |

`index-.vue` is an enriched homepage variant (with `DrinkAnimation`, IntersectionObserver scroll effects) that may be served instead of `index.vue`.

### Configuration Exposure Pattern

`blog.config.ts` is exposed to the app in two ways:
1. Via `app/app.config.ts` using `defineAppConfig({ ...blogConfig })` — makes it available through `useAppConfig()` in components
2. Via direct import: `import config from '@@/blog.config'` — used in layouts/pages

Both patterns coexist; use whichever is appropriate for the context.

### Config Files

- `blog.config.ts` — Blog metadata, author info, copyright (CC BY-NC-SA 4.0), birth date (for age calculator on homepage), timezone, syntax highlighting languages (22 langs including json, js, ts, html, css, vue, shell, mdc, yaml, sql, swift, c, cpp, glsl, py, r, java, lean, haskell, lisp), Twikoo comments config, Meting music API config
- `configs/dev/dev.blog.ui.config.ts` — Development-only navigation config (marked for removal in production)
- `configs/blog.links.config.ts` — Friends/links data imported by blog.config.ts
- `configs/theme-light.json` — Custom ayu Shiki theme

### Styling Architecture

- **Entry Point**: `app/assets/main.scss` imports `base.scss` and KaTeX styles
- **Theme System**: `app/assets/theme.scss` forwards three modules:
  - `theme/color/color-schemes.scss` — Color mode configuration
  - `theme/layout.scss` — Layout variables (`$critical-width`, `$sidebar-margin`, `$screen-transition-width`)
  - `theme/misc.scss` — Miscellaneous styles
- **Color Modes**: Uses `@nuxtjs/color-mode` with system preference detection; light/dark themes in `theme/color/light.scss` and `dark.scss`; CSS custom properties pattern: `var(--color-*)`, `var(--font-size-*)`; no class prefix/suffix (class names are bare `dark`/`light`)
- **Typography**: JetBrains Mono as primary font, with Inconsolata and Noto Serif as alternatives; loaded from Google Fonts
- **Twikoo**: Separate stylesheet at `app/assets/twikoo.scss`

### Nuxt Modules

- `@nuxt/content` — Content management
- `@nuxtjs/mdc` — MDC component support
- `@nuxt/icon` — Icon management with custom `icons-chess` collection
- `@vueuse/motion` — Vue animations
- `@nuxtjs/color-mode` — Dark/light mode
- `@bikariya/shiki` — Shiki syntax highlighting integration
- `@pinia/nuxt` — State management (installed but unused — `app/stores/` is empty)

### Vue Library Integrations

Registered in `app/plugins/configVueLibs.ts` (client-side only, guarded by `import.meta.server`):
- `vue-rough-notation` — Hand-drawn annotations
- `vue3-chessboard` — Chess board component
- `vue-powerglitch` — Glitch effects (type declaration at `app/types/vue-powerglitch.d.ts`)
- `chess-fen` — Chess FEN notation

### Custom Icon Collection

Chess piece icons at `app/assets/icons/chess` with prefix `icons-chess`, standardized to 512×512.

### CDN Scripts (loaded in app head)

- **TikzJax** — `http://tikzjax.com/v1/fonts.css` (stylesheet, for LaTeX diagrams)
- **Twikoo** — `twikoo.nocss.js` (comment system, loaded from npmmirror CDN)
- **MathJax 3** — `tex-chtml-full.js` (math rendering, loaded from jsdelivr CDN)

### Nitro Custom Plugin

A custom Rollup plugin `vue-default-export` in the Nitro config adds a default export re-export to Vue's ESM entry point (`vue/index.mjs`) for compatibility.

### Composable

- `useDrinkEvents.ts` — Event bus for `DrinkAnimation` component communication. Defines `DrinkEventType`: `'camera-wobble' | 'drag-start' | 'drag-end' | 'hint-click'`. Exports `{ on, emit, eventBus }`.

### Static Assets

- `app/static/adjacency.json` — Article relationship graph data, consumed by `article.vue` layout
- `app/static/chessboard/` — 45 chess SVG icons (pieces, annotations, evaluations)
- `app/static/drink-1.mp4`, `app/static/drink-loop.gif` — Drink animation assets

### Python Embedding Pipeline

- **Entry Point**: `buildgraph.py` calls `embed.pipeline.main()`
- **Purpose**: Generates article relationship graphs using embeddings
- **Build Integration**: Runs automatically before Nuxt build if `.venv/bin/python` exists (see `nuxt.config.ts` hooks)
- **Modules** (in `embed/`):
  - `pipeline.py` — Main orchestration
  - `embeddings.py` — Embedding generation
  - `adjacency.py` — Graph adjacency calculations
  - `features.py` — Feature extraction
  - `manifest.py` — Manifest generation
  - `config.py` — Pipeline configuration

### Utilities

Located in `app/utils/`:
- Chess-related: `chessglyphs.ts`, `chessline.ts`, `chessboard.ts`, `chessboard-annotations.ts`, `chessboard-coords.ts`, `chessline/parser.ts`, `chessline/tokenizer.ts`
- Graphics: `canvas-utils.ts`, `canvas-uniforms.ts`, `indexPage/parallaxLoader.ts` (canvas shaders)
- API: `music-api.ts`
- DOM: `useElementMouse.ts`, `anchor.ts`
- Routing: `route-utils.ts`

### Scripts

- `scripts/create-article.mjs` — Article creation script (used by `pnpm new:article`)
- `scripts/generate-maps.mjs` — Depth map generation using `@huggingface/transformers` for parallax effects

### Type Declarations

- `types/window.ts` — Declares `Window.twikoo` for the Twikoo comment widget
- `app/types/vue-powerglitch.d.ts` — Module declaration for `vue-powerglitch`

## Key Dependencies

- `@nuxt/content` — Markdown content management
- `@nuxtjs/color-mode` — Dark/light mode support
- `rehype-mathjax` — Math rendering (with XyJax extension for commutative diagrams)
- `three` — 3D graphics (for depth viewer)
- `fuse.js` — Fuzzy search
- `better-sqlite3` — SQLite database (for embedding pipeline)
- `twikoo` — Comment system (loaded via CDN)

## Important Notes

- Node.js 20+ required
- Python 3.11+ required for the embedding pipeline (optional; builds skip it if `.venv` is missing)
- Color mode uses CSS custom properties with no class prefix/suffix
- Custom icon collection for chess pieces at `app/assets/icons/chess` (prefix: `icons-chess`)
- Twikoo comments configured to use Vercel deployment at `https://blog-twikoo-one-dun.vercel.app/`
- The app is deployed as a static site to GitHub Pages via GitHub Actions
- Meting music API endpoint at `https://api.music.abloom.site/` (configured in `blog.config.ts`)
- There are no tests, linting, or formatting configured — this is intentional for this personal blog
