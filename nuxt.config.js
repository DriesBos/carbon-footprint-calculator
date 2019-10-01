export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: 'Flight Footprint Calculator',
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#E34C29',
    height: '2px',
    throttle: '200'
  },

  router: {
    scrollBehavior: function (to, from, savedPosition) {
      return {
        x: 0,
        y: 0
      }
    }
  },
  /*
   ** Global CSS
   */
  css: [
    '@/assets/styling/reset.css',
    '~/assets/styling/variables.sass',
    '~/assets/styling/typography.sass',
    '~/assets/styling/transitions.sass',
    '@/assets/styling/main.sass'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/axios',
  ],
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
}