const visit = require('unist-util-visit')

module.exports = (options) => tree => {
    visit(tree, 'heading', node => {
        if (node.depth !== 1) {
            return
        }

        visit(node, 'text', textNode => {
            textNode.value = 'BREAKING ' + textNode.value
        })
    })
}