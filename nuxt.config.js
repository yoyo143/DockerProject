
const dotenv = require("dotenv").config({
  path: ".env" /*+ (DEPLOY_ENV || '')*/
});

const envBuild = require("./env.js");
const DEPLOY_ENV = process.env.DEPLOY_ENV || "";


module.exports =  {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_description || 'First Day School',
    script: [
      { src: '/courses/js/jquery.min.js'},
      { src: '/courses/js/bootstrap.js' },
      { src: "https://request.eprotect.vantivprelive.com/eProtect/js/payframe-client.min.js" }
    ],
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: 'favicon.png' }
    ]
  },
  vue: {
    config: {
      productionTip: true,
      devtools: true
    }
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    "@fortawesome/fontawesome-free/css/all.css",
    '@/assets/scss/main.scss'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/vuelidate' },
    { src: '~/plugins/axios' },
    { src: "~/plugins/baseApi" },
    { src: '~/plugins/localStorage.js', ssr: false }
    // { src: '~/plugins/vuex-persist', ssr: false }
    // { src: '~/plugins/dataLayer.js', ssr: false, async: false }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    'nuxt-helmet'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  helmet: {
    frameguard: true
  },
  router: {
    base: "/courses/"
  },
  env: {
    DEPLOY_ENV: DEPLOY_ENV,
    API_STUDENT:
      (envBuild.environments[DEPLOY_ENV] &&
        envBuild.environments[DEPLOY_ENV].API_STUDENT) ||
      process.env.API_STUDENT,
    API_URL_BASE:
      (envBuild.environments[DEPLOY_ENV] &&
        envBuild.environments[DEPLOY_ENV].API_URL_BASE) ||
      process.env.API_URL_BASE,
    API_AUTH:
      (envBuild.environments[DEPLOY_ENV] &&
        envBuild.environments[DEPLOY_ENV].API_AUTH) ||
      process.env.API_AUTH,
    API_STUDENT_SSR:
      (envBuild.environments[DEPLOY_ENV] &&
        envBuild.environments[DEPLOY_ENV].API_STUDENT_SSR) ||
      process.env.API_STUDENT_SSR
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
