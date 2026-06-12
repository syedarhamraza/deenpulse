import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-icon.png', 'logo.png', 'android-icon-192x192.png'],
        manifest: {
          name: 'DeenPulse',
          short_name: 'DeenPulse',
          description: 'Reliable offline-first prayer tracking for Android and Wear OS.',
          theme_color: '#060A0A',
          background_color: '#060A0A',
          display: 'standalone',
          orientation: 'portrait-primary',
          icons: [
            {
              src: '/android-icon-36x36.png',
              sizes: '36x36',
              type: 'image/png'
            },
            {
              src: '/android-icon-48x48.png',
              sizes: '48x48',
              type: 'image/png'
            },
            {
              src: '/android-icon-72x72.png',
              sizes: '72x72',
              type: 'image/png'
            },
            {
              src: '/android-icon-96x96.png',
              sizes: '96x96',
              type: 'image/png'
            },
            {
              src: '/android-icon-144x144.png',
              sizes: '144x144',
              type: 'image/png'
            },
            {
              src: '/android-icon-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/android-icon-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any maskable'
            },
            {
              src: '/logo.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
