import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // новая версия подтягивается автоматически
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],

      manifest: {
        id: '/',
        name: 'Jump & Jump',
        short_name: 'J&J',
        description: 'A Doodle Jump inspired game made to practise programming',
        lang: 'en',
        categories: ['games'],
        start_url: '/',
        scope: '/',
        display: 'standalone', // без адресной строки браузера
        orientation: 'portrait', // игра вертикальная
        theme_color: '#161616', // цвет верхней панели телефона (под тёмный интерфейс игры)
        background_color: '#161616', // цвет заставки при запуске
        icons: [
          { src: '/image_192px.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/image_512px.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/image_512px_maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },

      // Офлайн-режим: кэшируем и спрайты (png), иначе без интернета игра запустится без картинок
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico,webp,woff2}'],
        cleanupOutdatedCaches: true,
        navigateFallback: '/index.html',
      },

      // Позволяет проверить установку и в npm run dev
      devOptions: { enabled: true },
    }),
  ],
})