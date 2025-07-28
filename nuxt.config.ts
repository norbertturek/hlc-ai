// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  runtimeConfig: {
    openaiApiKey: '', // This will be overridden by environment variables
  },
  compatibilityDate: '2025-02-07'
})
