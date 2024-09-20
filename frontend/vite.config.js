import { defineConfig } from 'vite';
import path from 'path';
import vuePlugin from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vuePlugin()],
  build: {
    env: {
      dev: {
        VITE_API_URL: 'https://dev-api.example.com',
      },
      prod: {
        VITE_API_URL: 'https://prod-api.example.com',
      },
    },
  },
  mode: process.env.MODE, // Set the mode based on the environment variable
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  include: ['src/**/*', 'views/**/*'],
});