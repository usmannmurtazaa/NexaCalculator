import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-oxc';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  server: {
    port: 3000,
    open: true,
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) return 'firebase';
            if (id.includes('jspdf')) return 'jspdf';
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler'))
              return 'react-vendor';
            if (id.includes('@emailjs')) return 'emailjs';
            return 'vendor';
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 600,
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'firebase/app',
      'firebase/analytics',
      'firebase/firestore',
      '@emailjs/browser',
    ],
    exclude: ['jspdf'],
    // Use the new Rolldown‑specific options (removes the deprecation warning)
    rolldownOptions: {},
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@constants': path.resolve(__dirname, 'src/constants'),
    },
  },
});