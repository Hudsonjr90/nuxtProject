import { defineStore } from 'pinia'

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
        console.log('🔧 Carregando notícias de exemplo...')
        
        // Dados mock para demonstração
        const mockData: Article[] = [
          {
            title: "Nova tecnologia revoluciona o mercado brasileiro",
            description: "Empresas nacionais desenvolvem soluções inovadoras que prometem transformar diversos setores da economia.",
            url: "https://example.com/noticia1",
            urlToImage: "https://via.placeholder.com/400x200/667eea/ffffff?text=Tecnologia",
            publishedAt: new Date().toISOString(),
            source: { name: "TechBrasil" },
            author: "João Silva"
          },
          {
            title: "Economia brasileira mostra sinais de recuperação",
            description: "Indicadores econômicos apontam para um crescimento sustentado nos próximos trimestres.",
            url: "https://example.com/noticia2",
            urlToImage: "https://via.placeholder.com/400x200/10b981/ffffff?text=Economia",
            publishedAt: new Date(Date.now() - 3600000).toISOString(),
            source: { name: "EconomiaHoje" },
            author: "Maria Santos"
          },
          {
            title: "Descoberta científica promete avanços na medicina",
            description: "Pesquisadores brasileiros fazem descoberta importante que pode revolucionar tratamentos médicos.",
            url: "https://example.com/noticia3",
            urlToImage: "https://via.placeholder.com/400x200/ef4444/ffffff?text=Ciencia",
            publishedAt: new Date(Date.now() - 7200000).toISOString(),
            source: { name: "CiênciaBrasil" },
            author: "Dr. Carlos Oliveira"
          },
          {
            title: "Inovação em energias renováveis ganha destaque",
            description: "Novas soluções sustentáveis prometem revolucionar o setor energético nacional.",
            url: "https://example.com/noticia4",
            urlToImage: "https://via.placeholder.com/400x200/22c55e/ffffff?text=Energia",
            publishedAt: new Date(Date.now() - 10800000).toISOString(),
            source: { name: "EnergiaBrasil" },
            author: "Ana Costa"
          },
          {
            title: "Educação digital transforma o ensino",
            description: "Plataformas online e novas metodologias revolucionam a forma de aprender.",
            url: "https://example.com/noticia5",
            urlToImage: "https://via.placeholder.com/400x200/8b5cf6/ffffff?text=Educacao",
            publishedAt: new Date(Date.now() - 14400000).toISOString(),
            source: { name: "EduTech" },
            author: "Roberto Lima"
          },
          {
            title: "Startups brasileiras atraem investimentos recordes",
            description: "Ecossistema de inovação nacional recebe aportes bilionários de fundos internacionais.",
            url: "https://example.com/noticia6",
            urlToImage: "https://via.placeholder.com/400x200/f97316/ffffff?text=Startups",
            publishedAt: new Date(Date.now() - 18000000).toISOString(),
            source: { name: "StartupBrasil" },
            author: "Paula Ferreira"
          }
        ]
        
        // Simular delay da API
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        this.articles = mockData
        this.lastUpdated = new Date()
        
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
        console.log(`🔍 Buscando por: "${query}"`)
        
        const mockSearchResults: Article[] = [
          {
            title: `Resultados da busca por: "${query}"`,
            description: "Esta é uma simulação de busca. Configure sua API key da NewsAPI para resultados reais.",
            url: "https://example.com/busca",
            urlToImage: "https://via.placeholder.com/400x200/9333ea/ffffff?text=Busca",
            publishedAt: new Date().toISOString(),
            source: { name: "BuscaDemo" },
            author: "Sistema"
          },
          {
            title: `Artigo relacionado a: ${query}`,
            description: `Conteúdo mock relacionado ao termo pesquisado: ${query}. Para resultados reais, configure sua chave da NewsAPI no arquivo .env`,
            url: "https://example.com/busca2",
            urlToImage: "https://via.placeholder.com/400x200/f59e0b/ffffff?text=Mock",
            publishedAt: new Date(Date.now() - 1800000).toISOString(),
            source: { name: "ResultadoDemo" },
            author: "Bot"
          },
          {
            title: `Mais sobre ${query} - Exemplo`,
            description: `Terceiro resultado simulado para a busca de "${query}". Implementação completa disponível com API real.`,
            url: "https://example.com/busca3",
            urlToImage: "https://via.placeholder.com/400x200/06b6d4/ffffff?text=Resultado",
            publishedAt: new Date(Date.now() - 3600000).toISOString(),
            source: { name: "MockNews" },
            author: "Demo"
          }
        ]
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        this.articles = mockSearchResults
        this.lastUpdated = new Date()
        
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