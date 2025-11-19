import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 💥 Korištenje praznog stringa ("") osigurava RELATIVNU putanju (./)
  // što je najpouzdaniji način za Netlify/GitHub Pages.
  base: '' 
})