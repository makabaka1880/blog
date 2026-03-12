# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog built with Nuxt 4, Vue 3, and Nuxt Content. Uses pnpm for package management and includes an optional Python embedding pipeline for article relationship graphs.

## Development Commands

```bash
# Development
pnpm install              # Install dependencies
pnpm dev                  # Start dev server at http://localhost:3000

# Building
pnpm build                # Production build
pnpm generate             # Generate static site
pnpm preview              # Preview production build

# Content Management
pnpm new:article "Title"  # Create draft article in content/draft/

# Optional Python Pipeline
pnpm buildgraph           # Run embedding pipeline (requires .venv)
# Setup: python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt

# Asset Generation
pnpm assets:genmaps       # Generate depth maps for public/assets/*-albedo.*
```

## Architecture

### Content System

- **Content Collections**: Defined in `content.config.ts`, the `articles` collection includes all `.md` files except those in `draft/`
- **Content Workflow**:
  - Drafts go in `content/draft/`
  - Published articles in `content/articles/`
  - Articles have optional `createTime`, `updateTime`, and `rawbody` fields
- **Markdown Processing**: Uses remark-math + rehype-katex for math rendering, Shiki for syntax highlighting

### Component Organization

Components are auto-imported with specific prefixes (configured in `nuxt.config.ts`):
- `~/components/ui/kit` → `UIKit` prefix
- `~/components/ui/utils` → `Utils` prefix
- `~/components/page/index` → `IndexPage` prefix
- `~/components/blog` → `Blog` prefix
- `~/components/content` → no prefix (used for MDC components and custom content elements)

### Layouts

Three layouts in `app/layouts/`:
- `default.vue` - Standard layout
- `defaultUnsafe.vue` - Variant for unsafe content
- `article.vue` - Article-specific layout

### Routing

- `/` - Homepage (`app/pages/index.vue`)
- `/articles` - Article listing (`app/pages/articles/index.vue`)
- `/articles/[...slug]` - Individual articles (`app/pages/articles/[...slug].vue`)
- `/link` - Links page

### Styling Architecture

- **Entry Point**: `app/assets/main.scss` imports `base.scss` and KaTeX styles
- **Theme System**: `app/assets/theme.scss` forwards three modules:
  - `color-schemes.scss` - Color mode configuration
  - `layout.scss` - Layout variables and utilities
  - `misc.scss` - Miscellaneous styles
- **Color Modes**: Uses `@nuxtjs/color-mode` with system preference detection
  - Light/dark themes defined in `app/assets/theme/color/light.scss` and `dark.scss`
  - Shared color variables in `app/assets/theme/color/color.scss`
  - CSS custom properties pattern: `var(--color-*)`, `var(--font-size-*)`
- **Typography**: JetBrains Mono as primary font, loaded from Google Fonts

### Configuration Files

- `blog.config.ts` - Blog metadata, author info, copyright, Twikoo comments config, syntax highlighting languages
- `nuxt.config.ts` - Nuxt configuration including modules, color mode, component auto-import, build hooks
- `content.config.ts` - Nuxt Content collections schema

### Vue Library Integrations

Registered in `app/plugins/configVueLibs.ts`:
- `vue-rough-notation` - Hand-drawn annotations
- `vue3-chessboard` - Chess board component
- `vue-powerglitch` - Glitch effects
- `chess-fen` - Chess FEN notation
- `vue-depth-viewer` - Depth map viewer

### Python Embedding Pipeline

- **Entry Point**: `buildgraph.py` calls `embed.pipeline.main()`
- **Purpose**: Generates article relationship graphs using embeddings
- **Build Integration**: Runs automatically before Nuxt build if `.venv/bin/python` exists (see `nuxt.config.ts` hooks)
- **Modules** (in `embed/`):
  - `pipeline.py` - Main orchestration
  - `embeddings.py` - Embedding generation
  - `adjacency.py` - Graph adjacency calculations
  - `features.py` - Feature extraction
  - `manifest.py` - Manifest generation
  - `config.py` - Pipeline configuration

### Utilities

Located in `app/utils/`:
- Chess-related: `chessglyphs.ts`, `chessline.ts`, `chessboard.ts`
- Graphics: `canvas-utils.ts`
- API: `music-api.ts`
- DOM: `useElementMouse.ts`, `anchor.ts`

### Scripts

- `scripts/create-article.mjs` - Article creation script (used by `pnpm new:article`)
- `scripts/generate-maps.mjs` - Depth map generation for parallax effects

## Key Dependencies

- `@nuxt/content` - Markdown content management
- `@nuxtjs/color-mode` - Dark/light mode support
- `katex` - Math rendering
- `three` - 3D graphics (for depth viewer)
- `fuse.js` - Fuzzy search
- `better-sqlite3` - SQLite database (for embedding pipeline)
- `twikoo` - Comment system (loaded via CDN)

## Important Notes

- Node.js 20+ required
- The Python pipeline is optional; builds will skip it if `.venv` is missing
- Color mode uses CSS custom properties with no class prefix/suffix
- Custom icon collection for chess pieces at `app/assets/icons/chess` (prefix: `icons-chess`)
- Twikoo comments configured to use Vercel deployment at `https://blog-twikoo-one-dun.vercel.app/`
