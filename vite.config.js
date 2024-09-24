import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import wasm from 'vite-plugin-wasm';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills(),wasm()],
  optimizeDeps: {
    include: ["bip39"],
    },
    resolve: {
      alias: {
      buffer: "buffer", // Ensures that imports/requires of 'buffer' are aliased to the 'buffer' package
      },
      },
  build: {
    outDir: 'dist',
    target: "ES2022",
    rollupOptions: {
      input: {
        popup: 'index.html', // Entry point for the popup
      },
    },
  },
});
