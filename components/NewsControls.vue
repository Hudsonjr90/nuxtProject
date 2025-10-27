<template>
  <div class="controls">
    <!-- Status de atualização -->
    <div class="update-status" :class="{ updating: newsStore.isRefreshing }">
      <span v-if="newsStore.isRefreshing">🔄 Atualizando notícias...</span>
      <span v-else-if="newsStore.lastUpdated">
        📅 Última atualização: {{ formatDate(newsStore.lastUpdated) }}
      </span>
      <span v-else>Aguardando primeira atualização</span>
    </div>

    <!-- Controles principais -->
    <div class="controls-row">
      <!-- Botão de atualização manual -->
      <button 
        class="refresh-btn"
        @click="handleRefresh"
        :disabled="newsStore.isRefreshing"
      >
        <span v-if="newsStore.isRefreshing">🔄</span>
        <span v-else>🔃</span>
        {{ newsStore.isRefreshing ? 'Atualizando...' : 'Atualizar' }}
      </button>

      <!-- Toggle de atualização automática -->
      <label class="auto-refresh-toggle">
        <input 
          type="checkbox" 
          :checked="newsStore.autoRefresh"
          @change="newsStore.toggleAutoRefresh"
        >
        <span class="toggle-slider"></span>
        <span class="toggle-label">Atualização automática</span>
      </label>

      <!-- Seletor de categoria -->
      <select 
        v-model="selectedCategory" 
        @change="handleCategoryChange"
        class="category-select"
      >
        <option value="general">Geral</option>
        <option value="business">Negócios</option>
        <option value="technology">Tecnologia</option>
        <option value="sports">Esportes</option>
        <option value="health">Saúde</option>
        <option value="science">Ciência</option>
        <option value="entertainment">Entretenimento</option>
      </select>
    </div>

    <!-- Barra de busca -->
    <div class="search-row">
      <input 
        v-model="searchQuery"
        type="text"
        placeholder="Buscar notícias..."
        class="search-input"
        @keyup.enter="handleSearch"
      >
      <button 
        class="search-btn"
        @click="handleSearch"
        :disabled="!searchQuery.trim() || newsStore.isRefreshing"
      >
        🔍 Buscar
      </button>
      <button 
        v-if="searchQuery"
        class="clear-btn"
        @click="clearSearch"
      >
        ❌ Limpar
      </button>
    </div>

    <!-- Contador de artigos -->
    <div class="articles-count">
      📰 {{ newsStore.articlesCount }} {{ newsStore.articlesCount === 1 ? 'notícia' : 'notícias' }} encontradas
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/pt-br'
import { useNewsStore } from '../stores/news'

// Configurar dayjs
dayjs.extend(relativeTime)
dayjs.locale('pt-br')

const newsStore = useNewsStore()

const selectedCategory = ref('general')
const searchQuery = ref('')

const formatDate = (date) => {
  return dayjs(date).fromNow()
}

const handleRefresh = () => {
  if (searchQuery.value.trim()) {
    newsStore.searchNews(searchQuery.value)
  } else {
    newsStore.fetchNews(selectedCategory.value)
  }
}

const handleCategoryChange = () => {
  searchQuery.value = ''
  newsStore.fetchNews(selectedCategory.value)
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    newsStore.searchNews(searchQuery.value)
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  newsStore.fetchNews(selectedCategory.value)
}
</script>

<style scoped>
.controls {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  margin-top: 2rem;
}

.controls-row {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.search-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.search-input {
  flex: 1;
  min-width: 250px;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.refresh-btn, .search-btn, .clear-btn {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.refresh-btn {
  background: #667eea;
  color: white;
}

.refresh-btn:hover:not(:disabled) {
  background: #5a67d8;
}

.refresh-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.search-btn {
  background: #10b981;
  color: white;
}

.search-btn:hover:not(:disabled) {
  background: #059669;
}

.search-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.clear-btn {
  background: #ef4444;
  color: white;
}

.clear-btn:hover {
  background: #dc2626;
}

.category-select {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.category-select:focus {
  outline: none;
  border-color: #667eea;
}

.auto-refresh-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.auto-refresh-toggle input {
  display: none;
}

.toggle-slider {
  position: relative;
  width: 50px;
  height: 24px;
  background: #e5e7eb;
  border-radius: 12px;
  transition: background-color 0.2s ease;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: transform 0.2s ease;
}

.auto-refresh-toggle input:checked + .toggle-slider {
  background: #667eea;
}

.auto-refresh-toggle input:checked + .toggle-slider::before {
  transform: translateX(26px);
}

.toggle-label {
  font-size: 0.875rem;
  font-weight: 500;
}

.update-status {
  text-align: center;
  padding: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.update-status.updating {
  color: #067df7;
}

.articles-count {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

@media (max-width: 768px) {
  .controls-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input {
    min-width: auto;
  }
}
</style>