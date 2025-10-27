<template>
  <div class="news-page">
    <!-- Header -->
    <header class="page-header">
      <div class="container">
        <div class="header-content">
          <NuxtLink to="/" class="back-link">
            ← Voltar ao início
          </NuxtLink>
          <div class="header-info">
            <h1>📰 Notícias</h1>
            <p v-if="currentQuery">
              Resultados para: <strong>"{{ currentQuery }}"</strong>
            </p>
            <p v-else-if="currentCategory">
              Categoria: <strong>{{ getCategoryLabel(currentCategory) }}</strong>
            </p>
            <p v-else>
              Últimas notícias
            </p>
          </div>
        </div>
        
        <!-- Nova busca -->
        <div class="search-bar">
          <form @submit.prevent="handleNewSearch" class="search-form">
            <input
              v-model="newSearchQuery"
              type="text"
              placeholder="Buscar outras notícias..."
              class="search-input"
            >
            <button 
              type="submit" 
              class="search-btn"
              :disabled="newsStore.isRefreshing"
            >
              🔍
            </button>
          </form>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container main-content">
      <!-- Filtros e controles -->
      <div class="controls-section">
        <div class="results-info">
          <span v-if="newsStore.articlesCount > 0">
            {{ newsStore.articlesCount }} notícias encontradas
          </span>
          <span v-if="newsStore.lastUpdated" class="last-updated">
            Atualizado {{ formatDate(newsStore.lastUpdated) }}
          </span>
        </div>
        
        <div class="control-buttons">
          <button 
            @click="refreshNews" 
            class="refresh-btn"
            :disabled="newsStore.isRefreshing"
          >
            <span v-if="!newsStore.isRefreshing">🔄 Atualizar</span>
            <span v-else>⏳ Atualizando...</span>
          </button>
          
          <button 
            @click="newsStore.toggleAutoRefresh()" 
            class="auto-refresh-btn"
            :class="{ active: newsStore.autoRefresh }"
          >
            {{ newsStore.autoRefresh ? '⏸️ Pausar' : '▶️ Auto' }} Atualização
          </button>
        </div>
      </div>

      <!-- Estado de carregamento -->
      <div v-if="newsStore.isRefreshing && newsStore.articlesCount === 0" class="loading">
        <div class="loading-spinner"></div>
        <p>Carregando notícias...</p>
      </div>

      <!-- Mensagem de erro -->
      <div v-else-if="newsStore.hasError" class="error">
        <div class="error-icon">⚠️</div>
        <h3>Ops! Algo deu errado</h3>
        <p>{{ newsStore.error }}</p>
        <button @click="refreshNews" class="retry-btn">
          Tentar novamente
        </button>
      </div>

      <!-- Grid de notícias -->
      <div v-else-if="newsStore.articlesCount > 0" class="news-grid">
        <NewsCard 
          v-for="(article, index) in newsStore.articles" 
          :key="article.url || index"
          :article="article"
          :index="index"
        />
      </div>

      <!-- Estado vazio -->
      <div v-else class="empty-state">
        <div class="empty-icon">📰</div>
        <h3>Nenhuma notícia encontrada</h3>
        <p>Tente buscar por outro termo ou categoria.</p>
        <NuxtLink to="/" class="back-home-btn">
          🏠 Voltar ao início
        </NuxtLink>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useNewsStore } from '../stores/news'
import NewsCard from '../components/NewsCard.vue'
import { useDateFormat } from '../composables/useDateFormat'

const route = useRoute()
const router = useRouter()
const newsStore = useNewsStore()
const { formatDate } = useDateFormat()

const newSearchQuery = ref('')
const currentQuery = ref('')
const currentCategory = ref('')

// Categorias para conversão de labels
const categories = {
  general: 'Geral',
  business: 'Negócios', 
  technology: 'Tecnologia',
  health: 'Saúde',
  sports: 'Esportes',
  entertainment: 'Entretenimento'
}

const getCategoryLabel = (category) => {
  return categories[category] || category
}

// Meta tags dinâmicas
const metaTitle = computed(() => {
  if (currentQuery.value) {
    return `Notícias sobre "${currentQuery.value}" - Portal de Notícias`
  } else if (currentCategory.value) {
    return `${getCategoryLabel(currentCategory.value)} - Portal de Notícias`
  }
  return 'Últimas Notícias - Portal de Notícias'
})

useHead({
  title: metaTitle,
  meta: [
    { 
      name: 'description', 
      content: computed(() => 
        `Confira as últimas notícias${currentQuery.value ? ` sobre ${currentQuery.value}` : ''}${currentCategory.value ? ` da categoria ${getCategoryLabel(currentCategory.value)}` : ''} em tempo real`
      )
    }
  ]
})

// Função para ir para detalhes
const goToDetails = (article, index) => {
  // Criar um ID único baseado no índice e timestamp
  const articleId = `${index}-${Date.now()}`
  
  router.push({
    name: 'details-id',
    params: { id: articleId },
    query: { 
      url: article.url,
      title: article.title 
    }
  })
}

// Função para nova busca
const handleNewSearch = async () => {
  if (!newSearchQuery.value.trim()) return
  
  await router.push({
    name: 'news',
    query: { q: newSearchQuery.value.trim() }
  })
}

// Função para atualizar notícias
const refreshNews = async () => {
  if (currentQuery.value) {
    await newsStore.searchNews(currentQuery.value)
  } else if (currentCategory.value) {
    await newsStore.fetchNews(currentCategory.value)
  } else {
    await newsStore.fetchNews()
  }
}

// Inicializar dados baseado na query
const initializeNews = async () => {
  const query = route.query.q
  const category = route.query.category
  
  currentQuery.value = query || ''
  currentCategory.value = category || ''
  newSearchQuery.value = query || ''
  
  if (query) {
    await newsStore.searchNews(query)
  } else if (category) {
    await newsStore.fetchNews(category)
  } else {
    await newsStore.fetchNews()
  }
}

// Watch para mudanças na rota
watch(() => route.query, async () => {
  await initializeNews()
}, { immediate: true })

// Inicializar auto-refresh
onMounted(() => {
  newsStore.startAutoRefresh()
})

// Limpar ao desmontar
onUnmounted(() => {
  newsStore.stopAutoRefresh()
})
</script>

<style scoped>
.news-page {
  min-height: 100vh;
  background: #f8fafc;
}

/* Page Header */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.back-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s ease;
}

.back-link:hover {
  opacity: 0.8;
}

.header-info h1 {
  font-family: 'Roboto Slab', serif;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.header-info p {
  opacity: 0.9;
  font-size: 1.1rem;
}

/* Search Bar */
.search-bar {
  max-width: 500px;
}

.search-form {
  display: flex;
  background: white;
  border-radius: 25px;
  padding: 0.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  background: transparent;
}

.search-btn {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-btn:hover:not(:disabled) {
  transform: scale(1.05);
}

/* Controls */
.controls-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem 0;
  flex-wrap: wrap;
  gap: 1rem;
}

.results-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  color: #6b7280;
  font-size: 0.9rem;
}

.last-updated {
  font-size: 0.8rem;
  opacity: 0.8;
}

.control-buttons {
  display: flex;
  gap: 1rem;
}

.refresh-btn, .auto-refresh-btn {
  background: white;
  border: 2px solid #e5e7eb;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.refresh-btn:hover:not(:disabled),
.auto-refresh-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.auto-refresh-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

/* Loading */
.loading {
  text-align: center;
  padding: 4rem 2rem;
}

.loading-spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-radius: 50%;
  border-top-color: #667eea;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error */
.error {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: #dc2626;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #374151;
}

.retry-btn {
  background: #dc2626;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 25px;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.3s ease;
}

.retry-btn:hover {
  background: #b91c1c;
}

/* News Grid */
.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #374151;
}

.empty-state p {
  color: #6b7280;
  margin-bottom: 2rem;
}

.back-home-btn {
  display: inline-block;
  background: #667eea;
  color: white;
  text-decoration: none;
  padding: 0.75rem 2rem;
  border-radius: 25px;
  transition: background 0.3s ease;
}

.back-home-btn:hover {
  background: #5a67d8;
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.main-content {
  padding-bottom: 2rem;
}

/* Responsividade */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .controls-section {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .control-buttons {
    width: 100%;
    justify-content: center;
  }
  
  .news-grid {
    grid-template-columns: 1fr;
  }
  
  .search-form {
    padding: 0.25rem;
  }
  
  .search-input {
    padding: 0.5rem 1rem;
  }
  
  .search-btn {
    padding: 0.5rem 0.75rem;
  }
}
</style>