import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  return {
    // ✅ Render / Netlify / Vercel uchun bazani '/' qilib qo‘yamiz
    base: '/',

    plugins: [
      react(),
      tailwindcss(),
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },

    build: {
      outDir: 'dist',        // 📂 Render dist papkasini kutadi
      sourcemap: false,      // optional: kodni yengil qilish uchun
      chunkSizeWarningLimit: 1000, // katta fayllar uchun ogohlantirishni yo‘qotadi
    },

    server: {
      host: '0.0.0.0', // Render yoki lokal test uchun kerak
      port: 5173,
      open: true,
    },

    preview: {
      port: process.env.PORT || 4173,
      host: true,
      allowedHosts: [
        "smartcoders-cd-ielts.onrender.com"
      ]
    },
  }
})
