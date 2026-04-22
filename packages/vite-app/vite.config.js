import { defineConfig } from 'vite'

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        // Use the modern Sass compiler API (required by sass-embedded >= 1.45)
        api: 'modern-compiler',
      },
    },
  },
})
