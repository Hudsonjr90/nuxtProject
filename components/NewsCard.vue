<template>
  <article class="news-card">
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
        <a 
          :href="article.url" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          {{ article.title }}
        </a>
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
  }
})

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
</script>

<style scoped>
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

.news-content h2 a {
  background: linear-gradient(120deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.news-content h2 a:hover {
  background: linear-gradient(120deg, #5a67d8, #6b46c1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>