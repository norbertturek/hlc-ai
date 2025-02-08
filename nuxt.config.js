// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss'
  ],

  runtimeConfig: {
    openaiApiKey: process.env.OPENAI_API_KEY
  },

  compatibilityDate: '2025-02-07'
})