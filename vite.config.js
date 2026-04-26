import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  base: '/Breaking-Job-frontend/',
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    port: 3000,
    proxy: {
      // Auth service (port 8080)
      '/api/v1/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // User service (port 8081) — also rewrites Content-Disposition for resume viewing
      '/api/v1/user': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            const cd = proxyRes.headers['content-disposition'];
            if (cd) {
              proxyRes.headers['content-disposition'] = cd.replace('attachment', 'inline');
            }
            delete proxyRes.headers['x-frame-options'];
          });
        },
      },
      // Company service (port 8082)
      '/api/v1/company': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      // Job service (port 8083) — handles both /jobs and /job-applications
      '/api/v1/job': {
        target: 'http://localhost:8083',
        changeOrigin: true,
      },
    },
  }
})
