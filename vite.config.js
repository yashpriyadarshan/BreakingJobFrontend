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
      '/api/v1/auth': {
        target: 'https://auth-service.politecoast-483f3a34.centralindia.azurecontainerapps.io',
        changeOrigin: true,
      },
      '/api/v1/user': {
        target: 'https://user-service.politecoast-483f3a34.centralindia.azurecontainerapps.io',
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
      '/api/v1/company': {
        target: 'https://company-service.politecoast-483f3a34.centralindia.azurecontainerapps.io',
        changeOrigin: true,
      },
      '/api/v1/job': {
        target: 'https://job-service.politecoast-483f3a34.centralindia.azurecontainerapps.io',
        changeOrigin: true,
      },
    },
  }
})
