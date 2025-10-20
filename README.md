# 📰 Site de Notícias em Tempo Real

Um site moderno de notícias em tempo real desenvolvido com **Nuxt.js 3**, **Vue 3**, **TypeScript** e **Pinia**.

## ✨ Funcionalidades

- 🔄 **Atualização automática** das notícias a cada 5 minutos
- 🔍 **Busca por palavras-chave** em tempo real
- 📱 **Design responsivo** para todos os dispositivos
- 🎯 **Filtragem por categorias** (Geral, Negócios, Tecnologia, etc.)
- ⚡ **Interface moderna** com animações suaves
- 🌍 **Foco em notícias brasileiras** (mas configurável)
- 📊 **Contador de artigos** em tempo real
- 🎨 **Visual atrativo** com gradientes e sombras

## 🚀 Como usar

### 1. Obter chave da API

1. Acesse [NewsAPI.org](https://newsapi.org/register)
2. Crie uma conta gratuita
3. Copie sua API key

### 2. Configurar o projeto

```bash
# Instalar dependências
npm install

# Configurar variável de ambiente
# Edite o arquivo .env e substitua "SUA_CHAVE_AQUI" pela sua API key
NEWS_API_KEY=sua_chave_real_aqui
```

### 3. Executar o projeto

```bash
# Modo desenvolvimento
npm run dev

# Abra http://localhost:3000 no seu navegador
```

## 🛠️ Tecnologias utilizadas

- **Nuxt.js 3** - Framework Vue.js para aplicações modernas
- **Vue 3** - Framework JavaScript reativo
- **TypeScript** - Tipagem estática para JavaScript
- **Pinia** - Gerenciamento de estado para Vue
- **NewsAPI** - API de notícias em tempo real
- **DayJS** - Biblioteca para manipulação de datas
- **CSS Grid/Flexbox** - Layout responsivo moderno

## 📁 Estrutura do projeto

```
├── app/
│   └── app.vue                 # Componente principal
├── components/
│   ├── NewsCard.vue           # Card individual de notícia
│   └── NewsControls.vue       # Controles e filtros
├── composables/
│   └── useDateFormat.ts       # Funções para formatação de datas
├── stores/
│   └── news.ts                # Store Pinia para gerenciar notícias
├── assets/css/
│   └── main.css               # Estilos globais
├── .env                       # Variáveis de ambiente
└── nuxt.config.ts             # Configuração do Nuxt
```

## 🎮 Funcionalidades detalhadas

### 🔄 Atualização Automática
- As notícias são atualizadas automaticamente a cada 5 minutos
- Você pode ligar/desligar a atualização automática
- Indicador visual mostra quando está atualizando

### 🔍 Busca Inteligente
- Busque por qualquer palavra-chave
- Resultados em tempo real
- Limpeza fácil dos filtros

### 📂 Categorias Disponíveis
- **Geral** - Notícias gerais
- **Negócios** - Economia e mercado
- **Tecnologia** - Tech e inovação
- **Esportes** - Esportes em geral
- **Saúde** - Saúde e medicina
- **Ciência** - Descobertas científicas
- **Entretenimento** - Cultura e entretenimento

### 📱 Design Responsivo
- Layout otimizado para desktop, tablet e mobile
- Cards adaptáveis com imagens responsivas
- Navegação touch-friendly

## 🌟 Próximas funcionalidades

- [ ] Notificações push para notícias importantes
- [ ] Favoritar notícias
- [ ] Compartilhamento social
- [ ] Modo escuro/claro
- [ ] Filtros por data
- [ ] Múltiplas fontes de notícias
- [ ] Cache offline

## 📝 Comandos disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Gerar site estático
npm run generate
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- [NewsAPI](https://newsapi.org) pela API de notícias
- [Nuxt.js](https://nuxt.com) pelo excelente framework
- [Vue.js](https://vuejs.org) pela reatividade incrível
