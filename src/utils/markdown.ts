import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { visit, SKIP } from 'unist-util-visit'

import type { Root, Image } from 'mdast'

// Unified plugin
function remarkRewriteImages() {
  return (tree: Root) => {
    visit(tree, 'image', (node: Image) => {
      if (!node.url.startsWith('http')) {
        if (node.url[0] != '/') {
          node.url = '/' + node.url
        }
        node.url = import.meta.env.VITE_SCM_BASE + '/refs/heads/main' + node.url
      }
    })
  }
}

const rehypeImageCaptions = () => {
  return (tree: Root) => {
    visit(tree, 'element', (node: any, index: number, parent: any) => {
      if (node.tagName === 'img' && node.properties?.alt) {
        const figure = {
          type: 'element',
          tagName: 'figure',
          properties: {},
          children: [
            node,
            {
              type: 'element',
              tagName: 'figcaption',
              properties: {},
              children: [{ type: 'text', value: ('(fig) ' + node.properties.alt) as string }],
            },
          ],
        }

        if (parent && index !== null) {
          parent.children[index] = figure
        }

        // Now you can use SKIP without a type error
        return [SKIP, index + 1]
      }
    })
  }
}

export async function renderMarkdown(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRewriteImages)
    .use(remarkRehype)
    .use(rehypeImageCaptions)
    .use(rehypeStringify)
    .process(markdown)

  return String(file)
}
