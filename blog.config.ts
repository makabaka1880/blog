// import blogCollections from './configs/blog.collections.config'
import blogLinks from './configs/blog.links.config'
import ayuTheme from './configs/theme-light.json'

//? Blog configuration
const blogConfig = {
    title: 'Teal Blog',
    subtitle:'',
    description: 'Based On Flory Blog',
    author: {
        name: 'Makabaka1880',
        avatar: '',
        email: '',
        url: '',
    },
    copyright: {
        abbr: 'CC BY-NC-SA 4.0',
        name: 'Attribution-NonCommercial-ShareAlike 4.0 International',
        url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    favicon: '',
    language: 'en',
    timezone: 'Asia/Shanghai',
    url: 'https://ablog.com', //! TODO Fill in blog URL
    highlight: {
        languages: ['json', 'js', 'ts', 'html', 'css', 'vue', 'shell', 'mdc', 'md', 'yaml', 'sql', 'swift'],
        theme: {
            // Default theme (same as single string)
            default: ayuTheme,
            // Theme used if `html.dark`
            // dark: 'ayu-dark',
            // Theme used if `html.sepia`
            // sepia: 'monokai'
          },
    },
    // collections: blogCollections, //! Do not modify
    links: blogLinks, //! Do not modify
}

export default blogConfig