import type { AxiosInstance, AxiosResponse } from 'axios'
import axios from 'axios'
import { useMockNews } from '../utils/mockNews'

// Criar instância configurada do Axios
export const useApi = (): AxiosInstance => {
  const config = useRuntimeConfig()

  const api = axios.create({
    baseURL: config.public.newsApiUrl || 'https://newsapi.org/v2',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      ...(config.public.newsApiKey && {
        'X-Api-Key': config.public.newsApiKey
      })
    }
  })

  // Interceptor para requests
  api.interceptors.request.use(
    (config) => {
      if (process.dev) {
        console.log(`🚀 [${config.method?.toUpperCase()}] ${config.url}`)
      }
      return config
    },
    (error) => {
      console.error('❌ Erro na requisição:', error)
      return Promise.reject(error)
    }
  )

  // Interceptor para responses
  api.interceptors.response.use(
    (response) => {
      if (process.dev) {
        console.log(`✅ [${response.status}] ${response.config.url}`)
      }
      return response
    },
    (error) => {
      if (error.response) {
        const status = error.response.status
        const message = error.response.data || error.message
        
        console.error(`❌ [${status}] ${error.config?.url}:`, message)
        
        switch (status) {
          case 401:
            throw new Error('API Key inválida ou expirada')
          case 403:
            throw new Error('Acesso negado - verifique suas permissões de API')
          case 429:
            throw new Error('Muitas requisições - tente novamente em alguns minutos')
          case 500:
            throw new Error('Erro interno do servidor de notícias')
          default:
            throw new Error(`Erro ${status}: ${message}`)
        }
      } else if (error.request) {
        console.error('❌ Erro de rede:', error.message)
        throw new Error('Erro de conexão - verifique sua internet')
      } else {
        console.error('❌ Erro:', error.message)
        throw new Error(error.message)
      }
    }
  )

  return api
}

// Tipagem para respostas da NewsAPI
export interface NewsApiResponse {
  status: string
  totalResults: number
  articles: Array<{
    source: { id: string | null; name: string }
    author: string | null
    title: string
    description: string | null
    url: string
    urlToImage: string | null
    publishedAt: string
    content: string | null
  }>
}

// Composable específico para API de notícias
export const useNewsApi = () => {
  const api = useApi()
  const config = useRuntimeConfig()

  const fetchTopHeadlines = async (params: {
    country?: string
    category?: string
    pageSize?: number
  }): Promise<AxiosResponse<NewsApiResponse>> => {
    try {
      // Se não há API key, usar mock diretamente
      if (!config.public.newsApiKey) {
        console.warn('🔄 NEWS_API_KEY não configurada — usando dados mock')
        const mockResponse = await useMockNews()
        return mockResponse as AxiosResponse<NewsApiResponse>
      }

      // Tentar fazer a requisição real
      const response = await api.get('/top-headlines', { params })
      
      // Se não há artigos na resposta, usar mock como fallback
      if (!response.data?.articles || response.data.articles.length === 0) {
        console.warn('🔄 API retornou sem resultados — usando dados mock como fallback')
        const mockResponse = await useMockNews()
        return mockResponse as AxiosResponse<NewsApiResponse>
      }

      console.log('✅ Dados reais carregados da API')
      return response
    } catch (error) {
      console.error('❌ Erro ao buscar top headlines:', error)
      console.warn('🔄 Usando dados mock devido ao erro na API')
      
      // Usar mock como fallback em caso de erro
      try {
        const mockResponse = await useMockNews()
        return mockResponse as AxiosResponse<NewsApiResponse>
      } catch (mockError) {
        console.error('❌ Erro também no mock:', mockError)
        throw error // Re-throw o erro original se até o mock falhar
      }
    }
  }

  const searchEverything = async (params: {
    q: string
    pageSize?: number
    language?: string
  }): Promise<AxiosResponse<NewsApiResponse>> => {
    try {
      // Se não há API key, usar mock diretamente
      if (!config.public.newsApiKey) {
        console.warn('🔄 NEWS_API_KEY não configurada — usando dados mock para busca')
        const mockResponse = await useMockNews()
        return mockResponse as AxiosResponse<NewsApiResponse>
      }

      // Tentar fazer a requisição real
      const response = await api.get('/everything', { params })
      
      // Se não há artigos na resposta, usar mock como fallback
      if (!response.data?.articles || response.data.articles.length === 0) {
        console.warn('🔄 Busca na API retornou sem resultados — usando dados mock como fallback')
        const mockResponse = await useMockNews()
        return mockResponse as AxiosResponse<NewsApiResponse>
      }

      console.log('✅ Resultados de busca reais carregados da API')
      return response
    } catch (error) {
      console.error('❌ Erro na busca:', error)
      console.warn('🔄 Usando dados mock devido ao erro na busca')
      
      // Usar mock como fallback em caso de erro
      try {
        const mockResponse = await useMockNews()
        return mockResponse as AxiosResponse<NewsApiResponse>
      } catch (mockError) {
        console.error('❌ Erro também no mock:', mockError)
        throw error // Re-throw o erro original se até o mock falhar
      }
    }
  }

  return {
    fetchTopHeadlines,
    searchEverything
  }
}