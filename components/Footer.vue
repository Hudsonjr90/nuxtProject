<template>
  <footer class="footer">
    <div class="container">
      <p>&copy; {{ currentYear }} Notícias em Tempo Real</p>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'

const currentYear = ref(new Date().getFullYear())
</script>


<style scoped>
.footer {
  background: #374151;
  color: white;
  padding: 1rem 0;
  text-align: center;
  margin-top: auto;
}

.footer .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer p {
  margin: 0;
  opacity: 0.8;
  font-size: 0.9rem;
}
</style>