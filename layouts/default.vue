<template>
  <div id="app">
    <button class="theme-toggle" @click="themeStore.toggleTheme()" :aria-label="themeStore.theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'">
      <span v-if="themeStore.theme === 'dark'">🌙</span>
      <span v-else>☀️</span>
    </button>
    <NuxtPage />
    <!-- Rodapé -->
    <Footer />
  </div>
</template>

<script setup>
import Footer from '../components/Footer.vue'
import { useThemeStore } from '../stores/theme'
import { onMounted } from 'vue'

const themeStore = useThemeStore()
onMounted(() => {
  themeStore.initTheme()
})
</script>

<style>
/* Reset e estilos globais */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
}

html.dark {
  --bg: #181a1b;
  --text: #e5e7eb;
  --card: #23272a;
  --border: #374151;
  --primary: #667eea;
  --secondary: #764ba2;
  background: var(--bg);
  color: var(--text);
}

body.dark, #app.dark {
  background: var(--bg);
  color: var(--text);
}

/* Botão de alternância de tema */
.theme-toggle {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 1000;
  background: var(--card, #fff);
  color: var(--text, #333);
  border: 2px solid var(--border, #e5e7eb);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: background 0.3s, color 0.3s, border 0.3s;
}
.theme-toggle:hover {
  background: var(--primary, #667eea);
  color: #fff;
}

body {
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
  color: var(--text, #333);
  background-color: var(--bg, #f8fafc);
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Container principal */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Conteúdo principal */
.main-content {
  flex: 1;
  padding-bottom: 2rem;
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
  background: var(--card, #fff);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-left: 4px solid var(--primary, #667eea);
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
html.dark .error {
  background: #2d1e1e;
  color: #f87171;
}

/* Estados vazios */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}
html.dark .empty-state {
  color: #a1a1aa;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #374151;
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