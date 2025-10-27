<template>
  <div class="details-page">
    <!-- Header -->
    <header class="page-header">
      <div class="container">
        <div class="header-nav">
          <button @click="goBack" class="back-btn">
            ← Voltar
          </button>
          <div class="header-actions">
            <button @click="shareArticle" class="share-btn">
              📤 Compartilhar
            </button>
            <button @click="openOriginal" class="external-btn">
              🔗 Ver original
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container main-content">
      <!-- Loading State -->
      <div v-if="isLoading" class="loading">
        <div class="loading-spinner"></div>
        <p>Carregando detalhes da notícia...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error">
        <div class="error-icon">⚠️</div>
        <h2>Notícia não encontrada</h2>
        <p>{{ error }}</p>
        <button @click="goBack" class="back-btn-error">
          Voltar às notícias
        </button>
      </div>

      <!-- Article Content -->
      <article v-else-if="article" class="article">
        <!-- Article Header -->
        <header class="article-header">
          <div class="article-meta">
            <span class="source">{{ article.source.name }}</span>
            <span class="date">{{ formatDate(article.publishedAt) }}</span>
            <span v-if="isRecent(article.publishedAt)" class="recent-badge">
              🔥 Notícia recente
            </span>
          </div>
          
          <h1 class="article-title">{{ article.title }}</h1>
          
          <div v-if="article.author" class="author">
            Por: <strong>{{ article.author }}</strong>
          </div>
        </header>

        <!-- Article Image -->
        <div v-if="article.urlToImage" class="article-image">
          <img 
            :src="article.urlToImage" 
            :alt="article.title"
            @error="handleImageError"
            @load="imageLoaded = true"
          >
          <div v-if="!imageLoaded" class="image-placeholder">
            📷 Carregando imagem...
          </div>
        </div>

        <!-- Article Body -->
        <div class="article-body">
          <div class="article-description">
            <p>{{ article.description }}</p>
          </div>
          
          <!-- Enhanced content -->
          <div class="enhanced-content">
            <h3>📋 Resumo da notícia</h3>
            <ul class="summary-points">
              <li v-for="point in summaryPoints" :key="point">{{ point }}</li>
            </ul>
          </div>

          <!-- Tags/Categories -->
          <div class="article-tags">
            <h4>🏷️ Tags relacionadas:</h4>
            <div class="tags-list">
              <span v-for="tag in extractedTags" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- Read more -->
          <div class="read-more-section">
            <h3>📖 Quer ler a notícia completa?</h3>
            <p>Clique no botão abaixo para acessar a notícia original no site do {{ article.source.name }}</p>
            <a 
              :href="article.url" 
              target="_blank" 
              rel="noopener noreferrer"
              class="read-full-btn"
            >
              📰 Ler notícia completa
            </a>
          </div>
        </div>

        <!-- Article Footer -->
        <footer class="article-footer">
          <div class="footer-info">
            <p>
              <strong>Fonte:</strong> {{ article.source.name }} | 
              <strong>Publicado:</strong> {{ formatFullDate(article.publishedAt) }}
            </p>
            <p class="disclaimer">
              Este é um resumo da notícia. Para o conteúdo completo, acesse o link original.
            </p>
          </div>
          
          <div class="footer-actions">
            <button @click="shareArticle" class="share-footer-btn">
              📤 Compartilhar esta notícia
            </button>
          </div>
        </footer>
      </article>

      <!-- Related news suggestion -->
      <aside class="related-section">
        <h2>📰 Quer ver mais notícias?</h2>
        <div class="related-actions">
          <NuxtLink to="/news" class="browse-btn">
            🔍 Explorar todas as notícias
          </NuxtLink>
          <NuxtLink to="/" class="home-btn">
            🏠 Voltar ao início
          </NuxtLink>
        </div>
      </aside>
    </main>
  </div>
</template>

<script setup>
import { useNewsStore } from '../../stores/news'
import { useDateFormat } from '../../composables/useDateFormat'

const route = useRoute()
const router = useRouter()
const newsStore = useNewsStore()
const { formatDate, formatFullDate } = useDateFormat()

const article = ref(null)
const isLoading = ref(true)
const error = ref(null)
const imageLoaded = ref(false)

// Computed properties
const summaryPoints = computed(() => {
  if (!article.value?.description) return []
  
  // Criar pontos de resumo baseados na descrição
  const sentences = article.value.description.split('.').filter(s => s.trim().length > 10)
  return sentences.slice(0, 3).map(s => s.trim() + '.')
})

const extractedTags = computed(() => {
  if (!article.value) return []
  
  // Extrair tags básicas baseadas no título e fonte
  const tags = []
  
  if (article.value.source.name) {
    tags.push(article.value.source.name)
  }
  
  // Adicionar tags baseadas em palavras-chave comuns
  const keywords = ['Brasil', 'economia', 'política', 'tecnologia', 'saúde', 'esporte', 'cultura']
  keywords.forEach(keyword => {
    if (article.value.title?.toLowerCase().includes(keyword.toLowerCase()) || 
        article.value.description?.toLowerCase().includes(keyword.toLowerCase())) {
      tags.push(keyword)
    }
  })
  
  return [...new Set(tags)].slice(0, 5) // Remove duplicatas e limita a 5
})

// Métodos
const isRecent = (date) => {
  const now = new Date()
  const publishedDate = new Date(date)
  const diffInHours = (now - publishedDate) / (1000 * 60 * 60)
  return diffInHours < 2
}

const handleImageError = (event) => {
  const img = event.target
  img.style.display = 'none'
}

const goBack = () => {
  router.back()
}

const shareArticle = async () => {
  if (navigator.share && article.value) {
    try {
      await navigator.share({
        title: article.value.title,
        text: article.value.description,
        url: window.location.href
      })
    } catch (err) {
      console.log('Erro ao compartilhar:', err)
      copyToClipboard()
    }
  } else {
    copyToClipboard()
  }
}

const copyToClipboard = () => {
  const url = window.location.href
  navigator.clipboard.writeText(url).then(() => {
    alert('Link copiado para a área de transferência!')
  }).catch(() => {
    alert('Não foi possível copiar o link.')
  })
}

const openOriginal = () => {
  if (article.value?.url) {
    window.open(article.value.url, '_blank')
  }
}

// Inicializar artigo
const initializeArticle = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    const articleUrl = route.query.url
    const articleTitle = route.query.title
    
    if (!articleUrl) {
      throw new Error('URL da notícia não fornecida')
    }
    
    // Tentar encontrar o artigo na store primeiro
    const foundArticle = newsStore.articles.find(a => a.url === articleUrl)
    
    if (foundArticle) {
      article.value = foundArticle
    } else {
      // Se não encontrar na store, criar um objeto básico com as informações da query
      if (articleTitle) {
        article.value = {
          title: articleTitle,
          url: articleUrl,
          description: 'Clique em "Ler notícia completa" para acessar o conteúdo original.',
          urlToImage: '',
          publishedAt: new Date().toISOString(),
          source: { name: 'Fonte Externa' },
          author: ''
        }
      } else {
        throw new Error('Informações da notícia não encontradas')
      }
    }
  } catch (err) {
    console.error('Erro ao carregar artigo:', err)
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

// Meta tags dinâmicas
useHead({
  title: computed(() => article.value ? `${article.value.title} - Portal de Notícias` : 'Detalhes da Notícia'),
  meta: [
    { 
      name: 'description', 
      content: computed(() => article.value?.description || 'Detalhes da notícia')
    },
    {
      property: 'og:title',
      content: computed(() => article.value?.title || 'Notícia')
    },
    {
      property: 'og:description',
      content: computed(() => article.value?.description || '')
    },
    {
      property: 'og:image',
      content: computed(() => article.value?.urlToImage || '')
    }
  ]
})

// Inicializar ao montar
onMounted(() => {
  initializeArticle()
})

// Watch para mudanças na rota
watch(() => route.query, () => {
  initializeArticle()
})
</script>

<style scoped>
.details-page {
  min-height: 100vh;
  background: #f8fafc;
}

/* Page Header */
.page-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s ease;
}

.back-btn:hover {
  background: #5a67d8;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.share-btn, .external-btn {
  background: white;
  border: 2px solid #e5e7eb;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.share-btn:hover, .external-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

/* Loading & Error */
.loading, .error {
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

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.back-btn-error {
  background: #dc2626;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 25px;
  cursor: pointer;
  margin-top: 1rem;
}

/* Article */
.article {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
}

.article-header {
  padding: 2rem 2rem 1rem;
}

.article-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  align-items: center;
}

.source {
  background: #667eea;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
}

.date {
  color: #6b7280;
  font-size: 0.875rem;
}

.recent-badge {
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.article-title {
  font-family: 'Roboto Slab', serif;
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  color: #1f2937;
  margin-bottom: 1rem;
}

.author {
  color: #6b7280;
  font-style: italic;
}

.article-image {
  position: relative;
  margin-bottom: 2rem;
}

.article-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.image-placeholder {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  color: #6b7280;
}

.article-body {
  padding: 0 2rem;
}

.article-description {
  font-size: 1.25rem;
  line-height: 1.8;
  color: #374151;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.enhanced-content {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f0f9ff;
  border-radius: 12px;
}

.enhanced-content h3 {
  color: #1e40af;
  margin-bottom: 1rem;
}

.summary-points {
  list-style: none;
  padding: 0;
}

.summary-points li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #e0e7ff;
  position: relative;
  padding-left: 1.5rem;
}

.summary-points li:before {
  content: "▶";
  color: #1e40af;
  position: absolute;
  left: 0;
}

.article-tags {
  margin-bottom: 2rem;
}

.article-tags h4 {
  margin-bottom: 1rem;
  color: #374151;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: #e5e7eb;
  color: #374151;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
}

.read-more-section {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.read-more-section h3 {
  margin-bottom: 1rem;
}

.read-full-btn {
  display: inline-block;
  background: white;
  color: #667eea;
  text-decoration: none;
  padding: 1rem 2rem;
  border-radius: 25px;
  font-weight: 600;
  margin-top: 1rem;
  transition: all 0.3s ease;
}

.read-full-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.3);
}

.article-footer {
  padding: 2rem;
  background: #f8fafc;
  border-top: 1px solid #e5e7eb;
}

.footer-info {
  margin-bottom: 1.5rem;
}

.disclaimer {
  font-size: 0.875rem;
  color: #6b7280;
  font-style: italic;
  margin-top: 0.5rem;
}

.share-footer-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.share-footer-btn:hover {
  background: #5a67d8;
}

/* Related Section */
.related-section {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.related-section h2 {
  margin-bottom: 1.5rem;
  color: #374151;
}

.related-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.browse-btn, .home-btn {
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.browse-btn {
  background: #667eea;
  color: white;
}

.home-btn {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.browse-btn:hover, .home-btn:hover {
  transform: translateY(-2px);
}

/* Container */
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.main-content {
  padding: 2rem 0;
}

/* Responsividade */
@media (max-width: 768px) {
  .article-title {
    font-size: 1.875rem;
  }
  
  .article-header {
    padding: 1.5rem 1rem 1rem;
  }
  
  .article-body {
    padding: 0 1rem;
  }
  
  .article-footer {
    padding: 1.5rem 1rem;
  }
  
  .related-section {
    padding: 1.5rem 1rem;
  }
  
  .header-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .share-btn, .external-btn {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
  
  .related-actions {
    flex-direction: column;
  }
  
  .article-image img {
    height: 250px;
  }
  
  .image-placeholder {
    height: 250px;
  }
}
</style>