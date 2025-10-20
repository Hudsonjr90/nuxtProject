// Exemplo de dados mock para teste sem API key
export const mockNewsData = {
  status: "ok",
  totalResults: 3,
  articles: [
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
      publishedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hora atrás
      source: { name: "EconomiaHoje" },
      author: "Maria Santos"
    },
    {
      title: "Descoberta científica promete avanços na medicina",
      description: "Pesquisadores brasileiros fazem descoberta importante que pode revolucionar tratamentos médicos.",
      url: "https://example.com/noticia3",
      urlToImage: "https://via.placeholder.com/400x200/ef4444/ffffff?text=Ciencia",
      publishedAt: new Date(Date.now() - 7200000).toISOString(), // 2 horas atrás
      source: { name: "CiênciaBrasil" },
      author: "Dr. Carlos Oliveira"
    }
  ]
}

// Use este mock quando não tiver API key configurada
export const useMockNews = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: mockNewsData })
    }, 1000) // Simula delay da API
  })
}