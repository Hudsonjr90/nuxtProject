// Exemplo de dados mock para teste sem API key
export const mockNewsData = {
  status: "ok",
  totalResults: 6,
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
    },
    {
      title: "Cultura brasileira ganha destaque internacional",
      description: "Artistas nacionais são reconhecidos em festivais e eventos ao redor do mundo.",
      url: "https://example.com/noticia4",
      urlToImage: "https://via.placeholder.com/400x200/f59e0b/ffffff?text=Cultura",
      publishedAt: new Date(Date.now() - 10800000).toISOString(), // 3 horas atrás
      source: { name: "CulturaHoje" },
      author: "Ana Pereira"
    },
    {
      title: "Esportes brasileiros brilham em competições internacionais",
      description: "Atletas do Brasil conquistam medalhas e títulos em diversas modalidades esportivas.",
      url: "https://example.com/noticia5",
      urlToImage: "https://via.placeholder.com/400x200/3b82f6/ffffff?text=Esportes",
      publishedAt: new Date(Date.now() - 14400000).toISOString(), // 4 horas atrás
      source: { name: "EsporteBrasil" },  
      author: "Lucas Fernandes"
    },
    {
      title: "Iniciativas sustentáveis ganham força no Brasil",
      description: "Projetos ambientais e de sustentabilidade estão sendo implementados em várias regiões do país.",
      url: "https://example.com/noticia6",
      urlToImage: "https://via.placeholder.com/400x200/22c55e/ffffff?text=Sustentabilidade",
      publishedAt: new Date(Date.now() - 18000000).toISOString(), // 5 horas atrás
      source: { name: "VerdeBrasil" },  
      author: "Beatriz Costa"
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