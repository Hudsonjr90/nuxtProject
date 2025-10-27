<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
// Meta tags globais
useHead({
  titleTemplate: '%s - Portal de Notícias',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'description', content: 'Portal de notícias em tempo real com busca inteligente e cobertura global' }
  ]
})
</script>


