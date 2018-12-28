module.exports = {
  title: '🗜 guuu',
  description: ' ',
  permalink: '/:year/:slug',
  plugins: [
    '@vuepress/blog',
    '@vuepress/google-analytics',
    '@vuepress/medium-zoom',
    require('./plugins/vuepress-reading-time')
  ],
  themeConfig: {
    nav: [
      { text: 'About', link: '/about/' },
    ]
  },
  ga: 'UA-111768356-2'
}
