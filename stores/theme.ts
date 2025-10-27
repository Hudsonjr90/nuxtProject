import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: 'light' as 'light' | 'dark'
  }),
  actions: {
    setTheme(theme: 'light' | 'dark') {
      this.theme = theme
      document.documentElement.classList.toggle('dark', theme === 'dark')
      localStorage.setItem('theme', theme)
    },
    toggleTheme() {
      this.setTheme(this.theme === 'light' ? 'dark' : 'light')
    },
    initTheme() {
      const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
      if (saved) {
        this.setTheme(saved)
      } else {
        // Detecta preferência do sistema
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        this.setTheme(prefersDark ? 'dark' : 'light')
      }
    }
  }
})
