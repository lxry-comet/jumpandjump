import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/jumpandjump/', // Базовый путь, соответствующий имени вашего репозитория
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // новая версия подтягивается автоматически
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],

      manifest: {
        id: '/jumpandjump/', // Обновлено для GitHub Pages
        name: 'Jump & Jump',
        short_name: 'J&J',
        description: 'A Doodle Jump inspired game made to practise programming',
        lang: 'en',
        categories: ['games'],
        start_url: '/jumpandjump/', // Обновлено для GitHub Pages
        scope: '/jumpandjump/', // Обновлено для GitHub Pages
        display: 'standalone', // без адресной строки браузера
        orientation: 'portrait', // игра вертикальная
        theme_color: '#161616', // цвет верхней панели телефона
        background_color: '#161616', // цвет заставки при запуске
        icons: [
          // Убраны начальные слеши, чтобы пути были относительными
          { src: 'image_192px.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'image_512px.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'image_512px_maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      // Офлайн-режим: кэшируем и спрайты (png)
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico,webp,woff2}'],
        cleanupOutdatedCaches: true,
        navigateFallback: '/jumpandjump/index.html', // Обновлено для GitHub Pages
      },

      // Позволяет проверить установку и в npm run dev
      devOptions: { enabled: true },
    }),
  ],
})