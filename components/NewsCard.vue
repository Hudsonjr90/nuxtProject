<template>
  <article class="news-card" @click="goToDetails">
    <!-- Imagem da notícia -->
    <img 
      v-if="article.urlToImage" 
      :src="article.urlToImage" 
      :alt="article.title"
      @error="handleImageError"
    >
    
    <!-- Conteúdo -->
    <div class="news-content">
      <h2>
        {{ article.title }}
      </h2>
      
      <p v-if="article.description">
        {{ truncateText(article.description, 150) }}
      </p>
      
      <!-- Meta informações -->
      <div class="news-meta">
        <span class="news-source">{{ article.source.name }}</span>
        <span class="news-date">{{ formatDate(article.publishedAt) }}</span>
      </div>
      
      <!-- Badge de artigo recente -->
      <div 
        v-if="isRecent(article.publishedAt)" 
        class="recent-badge"
      >
        🔥 Recente
      </div>
    </div>
  </article>
</template>

<script setup>
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/pt-br'

// Configurar dayjs
dayjs.extend(relativeTime)
dayjs.locale('pt-br')

const props = defineProps({
  article: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['click'])

const router = useRouter()

const handleImageError = (event) => {
  const img = event.target
  img.style.display = 'none'
}

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

const formatDate = (date) => {
  return dayjs(date).fromNow()
}

const isRecent = (date) => {
  return dayjs().diff(dayjs(date), 'hour') < 2
}

const goToDetails = () => {
  // Criar um ID único baseado na URL ou índice
  const articleId = btoa(props.article.url).replace(/[^a-zA-Z0-9]/g, '').slice(0, 20) || `article-${props.index}`
  
  router.push({
    name: 'details-id',
    params: { id: articleId },
    query: { 
      url: props.article.url,
      title: props.article.title 
    }
  })
}
</script>

<style scoped>
.news-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.news-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.recent-badge {
  display: inline-block;
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 0.5rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.news-content h2 {
  background: linear-gradient(120deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all 0.3s ease;
}

.news-card:hover .news-content h2 {
  background: linear-gradient(120deg, #5a67d8, #6b46c1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>