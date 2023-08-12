// import colors from 'vuetify/es5/util/colors'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - EmoView',
    title: 'Home',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'EmoView Using REST API',
      },
      { name: 'format-detection', content: 'telephone=no' },
      {
        hid: 'og-title',
        property: 'og:title',
        content: 'EmoView',
      },
      {
        hid: 'og-site-name',
        property: 'og:site_name',
        content: 'emoview.hcerpl.id',
      },
      {
        hid: 'og-image',
        property: 'og:image',
        content: 'https://emoview.hcerpl.id/icon.png',
      },
      {
        hid: 'og-image-url',
        property: 'og:image:url',
        content: 'https://emoview.hcerpl.id/icon.png',
      },
      { hid: 'og-image-width', property: 'og:image:width', content: 1280 },
      { hid: 'og-image-height', property: 'og:image:height', content: 720 },
      {
        hid: 'og-image-type',
        property: 'og:image:type',
        content: 'image/jpeg',
      },
      { hid: 'twitter-card', property: 'twitter:card' },
      {
        hid: 'twitter-site',
        property: 'twitter:site',
        content: 'emoview.hcerpl.id',
      },
      {
        hid: 'twitter-creator',
        property: 'twitter:creator',
        content: 'emoview-rest',
      },
      {
        hid: 'twitter-img-src',
        property: 'twitter:image',
        content: 'https://emoview.hcerpl.id/icon.png',
      },
      {
        hid: 'twitter-title',
        property: 'twitter:title',
        content: 'emoview.hcerpl.id',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/main.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/helpers.js', ssr: true },
    { src: '~/plugins/rules.js', ssr: true },
    { src: '~/plugins/vuetify.js', ssr: true },
    { src: '~/plugins/snackbar.js', ssr: true },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    // https://google-fonts.nuxtjs.org
    '@nuxtjs/google-fonts',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://auth.nuxtjs.org
    '@nuxtjs/auth-next',
    // https://www.npmjs.com/package/@nuxtjs/dayjs
    '@nuxtjs/dayjs',
    // https://color-mode.nuxtjs.org/
    '@nuxtjs/color-mode',
    // https://www.npmjs.com/package/@nuxtjs/robots
    '@nuxtjs/robots',
    // https://www.npmjs.com/package/@nuxtjs/sitemap
    '@nuxtjs/sitemap',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: process.env.NUXT_ENV_RESTAPI_BASE_URL,
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      name: 'EmoView',
      short_name: 'EmoView',
      lang: 'en',
      useWebmanifestExtension: false,
      start_url: '/',
      theme_color: '#2196F3',
      background_color: '#000000',
    },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    // customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    defaultAssets: {
      font: {
        family: 'Inter',
      },
    },
    // theme: {
    //   light: true,
    //   themes: {
    //     light: {
    //       primary: colors.blue.darken2,
    //       accent: colors.grey.darken3,
    //       secondary: colors.amber.darken3,
    //       info: colors.teal.lighten1,
    //       warning: colors.amber.base,
    //       error: colors.deepOrange.accent4,
    //       success: colors.green.accent3,
    //     },
    //   },
    // },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  auth: {
    redirect: {
      login: '/',
      callback: '/callback',
    },
    strategies: {
      auth0: {
        domain: process.env.NUXT_ENV_AUTH0_DOMAIN,
        clientId: process.env.NUXT_ENV_AUTH0_CLIENT_ID,
        audience: process.env.NUXT_ENV_AUTH0_AUDIENCE,
      },
    },
    scopeKey: 'https://customclaim.com/role',
  },

  googleFonts: {
    families: {
      Inter: true,
    },
    prefetch: true,
    preconnect: true,
  },

  dayjs: {
    locales: ['en'],
    defaultLocale: 'en',
    plugins: ['utc'],
  },

  robots: [
    {
      UserAgent: '*',
      Allow: '/*',
    },
  ],

  sitemap: {
    hostname: 'https://emoview.hcerpl.id',
  },
}
