import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// Dev-only: redirect the old lowercase base (/swimchrono/...) to the
// canonical /SwimChrono/... so stale bookmarks and autocompleted URLs
// keep working. Production hosting (GitHub Pages) is case-sensitive.
function redirectLowercaseBase(): Plugin {
  return {
    name: 'redirect-lowercase-base',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && /^\/swimchrono(\/|$)/i.test(req.url) && !req.url.startsWith('/SwimChrono')) {
          res.statusCode = 302
          res.setHeader('Location', req.url.replace(/^\/swimchrono/i, '/SwimChrono'))
          res.end()
          return
        }
        next()
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  base: '/SwimChrono/',
  plugins: [react(), redirectLowercaseBase()],
  // Debug logging stays in the sources for development; strip it from
  // production bundles (console.warn / console.error are kept).
  esbuild: {
    pure: ['console.log'],
  },
  build: {
    rollupOptions: {
      output: {
        // Split stable third-party code into its own chunks so a change in
        // the app code doesn't invalidate the cached vendor bundles.
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          antd: ['antd', '@ant-design/icons'],
          konva: ['konva', 'react-konva'],
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        math: "always",
        relativeUrls: true,
        javascriptEnabled: true,
      },
    },
  },
})
