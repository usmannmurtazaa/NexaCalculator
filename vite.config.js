import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-oxc';

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
    // minify is omitted — Vite will use esbuild (now installed) or oxc automatically

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) return 'firebase';
            if (id.includes('jspdf')) return 'jspdf';
            if (
              id.includes('react') ||
              id.includes('react-dom') ||
              id.includes('scheduler')
            )
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
  },

  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@hooks': '/src/hooks',
      '@utils': '/src/utils',
      '@constants': '/src/constants',
      // NO '@firebase' alias — it conflicts with Firebase SDK internals
    },
  },
});