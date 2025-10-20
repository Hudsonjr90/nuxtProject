<template>
  <div id="app">
    <!-- Cabeçalho -->
    <header class="header">
      <div class="container">
        <h1>📰 Notícias em Tempo Real</h1>
        <p>Acompanhe as últimas notícias com atualizações automáticas</p>
      </div>
    </header>

    <!-- Conteúdo principal -->
    <main class="container">
      <!-- Controles -->
      <NewsControls />

      <!-- Mensagem de erro -->
      <div v-if="newsStore.hasError" class="error">
        ⚠️ {{ newsStore.error }}
      </div>

      <!-- Estado de carregamento -->
      <div v-if="newsStore.isRefreshing && newsStore.articlesCount === 0" class="loading">
        <div class="loading-spinner"></div>
        <p>Carregando notícias...</p>
      </div>

      <!-- Grid de notícias -->
      <div v-else-if="newsStore.articlesCount > 0" class="news-grid">
        <NewsCard 
          v-for="article in newsStore.articles" 
          :key="article.url"
          :article="article"
        />
      </div>

      <!-- Estado vazio -->
      <div v-else-if="!newsStore.isRefreshing" class="empty-state">
        <h3>📰 Nenhuma notícia encontrada</h3>
        <p>Tente buscar por outro termo ou categoria.</p>
      </div>
    </main>

    <!-- Rodapé -->
    <footer class="footer">
      <div class="container">
        <p>&copy; 2024 Notícias em Tempo Real - Desenvolvido com Nuxt.js</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
const newsStore = useNewsStore()

// Configurar meta tags
useHead({
  title: 'Notícias em Tempo Real',
  meta: [
    { name: 'description', content: 'Acompanhe as últimas notícias em tempo real com atualizações automáticas' }
  ]
})

// Inicializar dados e atualização automática
onMounted(async () => {
  await newsStore.fetchNews()
  newsStore.startAutoRefresh()
})

// Limpar intervalos ao desmontar
onUnmounted(() => {
  newsStore.stopAutoRefresh()
})
</script>

<style>
/* Reset e estilos globais */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f8fafc;
}

/* Container principal */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Cabeçalho */
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header h1 {
  font-family: 'Roboto Slab', serif;
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.5rem;
}

.header p {
  text-align: center;
  opacity: 0.9;
  font-size: 1.1rem;
}

/* Grid de notícias */
.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

/* Card de notícia */
.news-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-left: 4px solid #667eea;
}

.news-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.news-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.news-card h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  line-height: 1.4;
  color: #1f2937;
}

.news-card h2 a {
  text-decoration: none;
  color: inherit;
  transition: color 0.2s ease;
}

.news-card h2 a:hover {
  color: #667eea;
}

.news-card p {
  color: #6b7280;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.news-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: #9ca3af;
  margin-bottom: 1rem;
}

.news-source {
  font-weight: 500;
  color: #667eea;
}

/* Estados de carregamento */
.loading {
  text-align: center;
  padding: 3rem;
}

.loading-spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-radius: 50%;
  border-top-color: #667eea;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Erro */
.error {
  background: #fef2f2;
  color: #dc2626;
  padding: 1rem;
  border-radius: 8px;
  margin: 2rem 0;
  text-align: center;
}

/* Estados vazios */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #374151;
}

/* Rodapé */
.footer {
  background: #374151;
  color: white;
  padding: 2rem 0;
  margin-top: 4rem;
  text-align: center;
}

.footer p {
  opacity: 0.8;
}

/* Responsividade */
@media (max-width: 768px) {
  .header h1 {
    font-size: 2rem;
  }
  
  .news-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .news-card {
    padding: 1rem;
  }
  
  .news-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}
</style>
