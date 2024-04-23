import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config
export default defineConfig({
  plugins: [
    dts({
      include: ['lib/index.ts']
    }),
    react()
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/index.ts'),
      name: 'SignalsReact',
      formats: ['es', 'umd'],
      fileName: format => `index.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'react',
          'react-dom': 'react-dom'
        }
      }
    }
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
      lib: path.resolve(__dirname, 'lib')
    }
  },
  server: {
    port: 1234
  }
});
