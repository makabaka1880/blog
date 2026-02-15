# Teal Blog

Personal blog built with Nuxt 4 and Nuxt Content.

## Tech Stack
- Nuxt 4
- Vue 3
- `@nuxt/content` for Markdown content
- Shiki for code highlighting
- KaTeX for math rendering
- pnpm for package management

## Requirements
- Node.js 20+
- pnpm
- Python 3.11+ (optional, for embedding/depth scripts)

## Quick Start
```bash
pnpm install
pnpm dev
```
Open `http://localhost:3000`.

## Available Scripts
- `pnpm dev`: start the dev server
- `pnpm build`: production build
- `pnpm preview`: preview the production build
- `pnpm generate`: generate static output
- `pnpm new:article "Your Title"`: create a draft article in `content/draft`
- `pnpm buildgraph`: run the article embedding graph pipeline (requires `.venv`)
- `pnpm assets:genmaps`: generate depth maps for `public/assets/*-albedo.*`

## Content Workflow
- Drafts: `content/draft`
- Published articles: `content/article`
- Nuxt Content collection: `articles` (configured in `content.config.ts`)

## Optional Python Pipeline
The Nuxt build hook tries to run `buildgraph.py` using `.venv/bin/python`. If `.venv` is missing, it is skipped.

Set up locally:
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python buildgraph.py
```

## Build Output
- SSR build output: `.output/`
- Static site output (from `pnpm generate`): `.output/public/`

## Project Structure
- `app/`: pages, layouts, components, assets
- `content/`: Markdown content
- `scripts/`: project scripts (`new:article`, depth map generation)
- `embed/`: embedding pipeline utilities
- `public/`: static assets

## License
All rights reserved unless otherwise stated.
