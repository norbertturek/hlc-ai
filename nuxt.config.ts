// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  runtimeConfig: {
    openaiApiKey: process.env.NUXT_OPENAI_API_KEY,
    public: {
      openaiApiKey: process.env.NUXT_OPENAI_API_KEY
    }
  },
  compatibilityDate: '2025-02-07'
})
