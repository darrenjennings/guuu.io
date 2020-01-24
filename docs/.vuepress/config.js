const { path } = require('@vuepress/shared-utils')
const kongponents = require('./components/kongponents')

module.exports = {
  title: 'Darren Jennings',
  description: ' ',
  plugins: [
    ['@vuepress/plugin-blog', {
      permalink: '/:year/:slug'
    }],
    '@vuepress/google-analytics',
    ['@vuepress/medium-zoom', {
      selector: '.post .content img'
    }],
    ['@vuepress/pwa', {
      serviceWorker: true,
      popupComponent: 'MySWUpdatePopup',
      updatePopup: true
    }],
    ['@vuepress/register-components', { 
        componentsDir: [
          path.resolve('docs/.vuepress/components/beautiful-vue')
        ]
      }
    ],
    'vuepress-plugin-reading-time',
    // Generated and edited manually for now
    ['sitemap', {
      hostname: 'https://guuu.io',
    }],
    'seo'
  ],
  head: [
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#8BC5D8' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'apple-touch-icon', href: '/icons/icon-192x192.png' }],
    ...kongponents.map(name => ([
      'script', {src: `https://unpkg.com/@kongponents/${name.toLowerCase()}@latest/dist/${name}.umd.min.js`}
    ])),
    ['link', { rel: 'stylesheet', href: 'https://unpkg.com/@kongponents/styles@latest/styles.css' }],
  ],
  themeConfig: {
    nav: [
      { text: 'About', link: '/about/' },
    ]
  },
  ga: 'UA-131453250-1'
}
