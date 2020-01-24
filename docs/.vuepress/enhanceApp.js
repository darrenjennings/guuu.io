import kongponents from './components/kongponents'

export default ({
  Vue, // the version of Vue being used in the VuePress app
  options, // the options for the root Vue instance
  router, // the router instance for the app
  siteData // site metadata
}) => {
  console.log(`Whoever rebukes a man will afterward 
              find more favor than he who flatters with his tongue.`)

  if (typeof window !== "undefined") {
    kongponents.forEach(k => {
      Vue.component(k, window[k])
    })
  }

  router.addRoutes([
    { path: '/beautiful-vue/', redirect: 'beautiful-vue/data-reducer/' },
  ])
}
