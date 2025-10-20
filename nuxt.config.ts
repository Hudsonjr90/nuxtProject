// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // Modules
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/google-fonts'
  ],
  
  // Google Fonts
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700],
      'Roboto Slab': [400, 500, 700]
    }
  },
  
  // Runtime config for API keys
  runtimeConfig: {
    public: {
      newsApiKey: process.env.NEWS_API_KEY || '',
      newsApiUrl: 'https://newsapi.org/v2'
    }
  },
  
  // App configuration
  app: {
    head: {
      title: 'Notícias em Tempo Real',
      meta: [
        { name: 'description', content: 'Site de notícias em tempo real com atualizações automáticas' }
      ]
    }
  }
})
