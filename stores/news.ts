import { defineStore } from 'pinia'
import { useNewsApi } from '../composables/useApi'

interface Article {
  title: string
  description: string
  url: string
  urlToImage: string
  publishedAt: string
  source: { name: string }
  author: string
}

interface NewsState {
  articles: Article[]
  loading: boolean
  error: string | null
  lastUpdated: Date | null
  autoRefresh: boolean
  refreshInterval: NodeJS.Timeout | null
}

export const useNewsStore = defineStore('news', {
  state: (): NewsState => ({
    articles: [],
    loading: false,
    error: null,
    lastUpdated: null,
    autoRefresh: true,
    refreshInterval: null
  }),

  getters: {
    articlesCount: (state) => state.articles.length,
    isRefreshing: (state) => state.loading,
    hasError: (state) => !!state.error
  },

  actions: {
    async fetchNews(category = 'general') {
      this.loading = true
      this.error = null

      try {
        // Usar composable do NewsAPI (que já inclui fallback para mock)
        const newsApi = useNewsApi()
        const response = await newsApi.fetchTopHeadlines({
          country: 'br',
          pageSize: 20,
          category: category
        })

        if (response.data && response.data.articles) {
          // Normalizar artigos para nossa interface
          this.articles = response.data.articles.map((a: any) => ({
            title: a.title || '',
            description: a.description || '',
            url: a.url || '',
            urlToImage: a.urlToImage || '',
            publishedAt: a.publishedAt || new Date().toISOString(),
            source: { name: a.source?.name || '' },
            author: a.author || ''
          }))
          this.lastUpdated = new Date()
        } else {
          this.articles = []
        }
      } catch (err) {
        console.error('Erro ao buscar notícias:', err)
        this.error = (err as Error).message || 'Erro ao carregar notícias'
      } finally {
        this.loading = false
      }
    },

    async searchNews(query: string) {
      this.loading = true
      this.error = null

      try {
        // Usar composable do NewsAPI (que já inclui fallback para mock)
        const newsApi = useNewsApi()
        const response = await newsApi.searchEverything({
          q: query,
          pageSize: 20,
          language: 'pt'
        })

        if (response.data && response.data.articles) {
          this.articles = response.data.articles.map((a: any) => ({
            title: a.title || '',
            description: a.description || '',
            url: a.url || '',
            urlToImage: a.urlToImage || '',
            publishedAt: a.publishedAt || new Date().toISOString(),
            source: { name: a.source?.name || '' },
            author: a.author || ''
          }))
          this.lastUpdated = new Date()
        } else {
          this.articles = []
        }

      } catch (err) {
        console.error('Erro na busca:', err)
        this.error = (err as Error).message || 'Erro ao buscar notícias'
      } finally {
        this.loading = false
      }
    },

    startAutoRefresh(intervalMs = 300000) { // 5 minutos
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval)
      }

      if (this.autoRefresh) {
        this.refreshInterval = setInterval(() => {
          this.fetchNews()
        }, intervalMs)
      }
    },

    stopAutoRefresh() {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval)
        this.refreshInterval = null
      }
    },

    toggleAutoRefresh() {
      this.autoRefresh = !this.autoRefresh
      if (this.autoRefresh) {
        this.startAutoRefresh()
      } else {
        this.stopAutoRefresh()
      }
    }
  }
})