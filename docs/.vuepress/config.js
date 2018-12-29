module.exports = {
  title: '🗜 guuu',
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
    require('./plugins/vuepress-reading-time')
  ],
  head: [
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#8BC5D8' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'apple-touch-icon', href: '/icons/icon-192x192.png' }],
  ],
  themeConfig: {
    nav: [
      { text: 'About', link: '/about/' },
    ]
  },
  ga: 'UA-131453250-1'
}
