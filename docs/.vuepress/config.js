module.exports = {
  title: '🗜 guuu',
  description: ' ',
  permalink: '/:year/:slug',
  plugins: [
    '@vuepress/blog',
    '@vuepress/google-analytics',
    '@vuepress/medium-zoom',
    '@vuepress/pwa',
    require('./plugins/vuepress-reading-time')
  ],
  themeConfig: {
    nav: [
      { text: 'About', link: '/about/' },
    ]
  },
  serviceWorker: true,
  ga: 'UA-131453250-1'
}
