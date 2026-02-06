# Teal Blog

My personal blog, a continuation of the AFlory blog by ABloom25, with the same spirit but a fresh coat of teal and a tighter, more technical focus.

Below are the technical details and how to run it.

## Highlights
- Content-first authoring with `@nuxt/content`
- Math rendering via KaTeX
- Code highlighting with Shiki
- Optional embedding graph builder (FAISS + numpy) for related-article links
- GitHub Pages deployment workflow included

## Requirements
- Node.js 20+
- Python 3.11+ (only if you want to run the embedding graph pipeline)

## Quick Start
```bash
npm install
npm run dev
```
Then open `http://localhost:3000`.

## Scripts
- `npm run dev` Start the dev server
- `npm run build` Production build
- `npm run preview` Preview production build
- `npm run generate` Static output (used for GitHub Pages)
- `npm run buildgraph` Run the embedding graph pipeline
- `npm run new:article` Create a new article via `scripts/create-article.mjs`

## Content Workflow
- Drafts live in `content/draft`
- Published articles live in `content/article`

## Embedding Graph (Optional)
This project includes a Python pipeline that builds an adjacency graph for articles. It uses FAISS and numpy and writes the output to `features.faiss`, `features.meta.json`, and the adjacency store configured in `embed/config.py`.

The Nuxt build hook attempts to run the pipeline from a local venv at `.venv/bin/python`. If that venv does not exist (for example in CI), the prebuild step is skipped.

To run it locally:
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python buildgraph.py
```

Note: If you do not need embeddings, you can ignore this step.

## Deployment (GitHub Pages)
A GitHub Actions workflow is included at `.github/workflows/deploy.yml`. It builds a static site with `npm run generate` and deploys to Pages.

## Project Structure
- `app/` Nuxt app (pages, layouts, components)
- `content/` Markdown content
- `embed/` Embedding pipeline
- `public/` Static assets

## License
All rights reserved unless otherwise stated.
