<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <h1>📰 Notícias em Tempo Real</h1>
        <p>Descubra as últimas notícias e mantenha-se sempre informado</p>
        
        <!-- Formulário de busca -->
        <div class="search-section">
          <form @submit.prevent="handleSearch" class="search-form">
            <div class="search-input-group">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Busque por notícias, temas ou palavras-chave..."
                class="search-input"
                required
              >
              <button 
                type="submit" 
                class="search-button"
                :disabled="isLoading"
              >
                <span v-if="!isLoading">🔍 Buscar</span>
                <span v-else>⏳ Buscando...</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Categorias populares -->
        <div class="categories">
          <h3>Categorias Populares:</h3>
          <div class="category-buttons">
            <button
              v-for="category in categories"
              :key="category.value"
              @click="searchByCategory(category.value)"
              class="category-btn"
              :disabled="isLoading"
            >
              {{ category.icon }} {{ category.label }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="container">
        <h2>Por que escolher nosso portal?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3>Atualizações em Tempo Real</h3>
            <p>Receba as notícias mais recentes assim que são publicadas</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🌍</div>
            <h3>Cobertura Global</h3>
            <p>Notícias do Brasil e do mundo em um só lugar</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <h3>Busca Inteligente</h3>
            <p>Encontre exatamente o que procura com nossa busca avançada</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const router = useRouter()
const searchQuery = ref('')
const isLoading = ref(false)

// Categorias disponíveis
const categories = [
  { value: 'general', label: 'Geral', icon: '📰' },
  { value: 'business', label: 'Negócios', icon: '💼' },
  { value: 'technology', label: 'Tecnologia', icon: '💻' },
  { value: 'health', label: 'Saúde', icon: '🏥' },
  { value: 'sports', label: 'Esportes', icon: '⚽' },
  { value: 'entertainment', label: 'Entretenimento', icon: '🎬' }
]

// Meta tags
useHead({
  title: 'Notícias em Tempo Real - Página Inicial',
  meta: [
    { name: 'description', content: 'Portal de notícias em tempo real com busca inteligente e cobertura global' }
  ]
})

// Função para buscar notícias
const handleSearch = async () => {
  if (!searchQuery.value.trim()) return
  
  isLoading.value = true
  
  try {
    // Navegar para a página de notícias com o termo de busca
    await router.push({
      name: 'news',
      query: { q: searchQuery.value.trim() }
    })
  } catch (error) {
    console.error('Erro ao navegar:', error)
  } finally {
    isLoading.value = false
  }
}

// Função para buscar por categoria
const searchByCategory = async (category) => {
  isLoading.value = true
  
  try {
    await router.push({
      name: 'news',
      query: { category }
    })
  } catch (error) {
    console.error('Erro ao navegar:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0 6rem;
  text-align: center;
}

.hero h1 {
  font-family: 'Roboto Slab', serif;
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.hero p {
  font-size: 1.25rem;
  margin-bottom: 3rem;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* Search Section */
.search-section {
  margin-bottom: 3rem;
}

.search-form {
  max-width: 600px;
  margin: 0 auto;
}

.search-input-group {
  display: flex;
  gap: 0;
  background: white;
  border-radius: 50px;
  padding: 0.5rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  background: transparent;
  color: #333;
}

.search-input::placeholder {
  color: #999;
}

.search-button {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 40px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  white-space: nowrap;
}

.search-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.search-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Categories */
.categories {
  max-width: 800px;
  margin: 0 auto;
}

.categories h3 {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  opacity: 0.9;
}

.category-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.category-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  backdrop-filter: blur(10px);
}

.category-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.6);
  transform: translateY(-2px);
}

.category-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Features Section */
.features {
  padding: 5rem 0;
  background: #f8fafc;
}

.features h2 {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
  color: #1f2937;
  font-family: 'Roboto Slab', serif;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.feature-card {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1f2937;
}

.feature-card p {
  color: #6b7280;
  line-height: 1.6;
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Responsividade */
@media (max-width: 768px) {
  .hero h1 {
    font-size: 2.5rem;
  }
  
  .hero p {
    font-size: 1.1rem;
  }
  
  .search-input-group {
    flex-direction: column;
    border-radius: 16px;
  }
  
  .search-input {
    border-radius: 12px;
  }
  
  .search-button {
    border-radius: 12px;
    margin-top: 0.5rem;
  }
  
  .category-buttons {
    gap: 0.5rem;
  }
  
  .category-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
  
  .features h2 {
    font-size: 2rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .feature-card {
    padding: 2rem;
  }
}
</style>