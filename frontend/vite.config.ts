import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { EventEmitter } from 'events';

// Polyfill EventEmitter for Node.js compatibility
if (typeof global !== 'undefined') {
  (global as any).EventEmitter = EventEmitter;
}

export default defineConfig({
  plugins: [
    react(),
    wasm(),
    topLevelAwait(),
    viteStaticCopy({
      targets: [
        {
          // Copy ZK circuits to public folder
          src: '../contracts/managed/htlc/zkir/*',
          dest: 'contract/managed/htlc/zkir'
        },
        {
          // Copy proving and verifying keys to public folder
          src: '../contracts/managed/htlc/keys/*',
          dest: 'contract/managed/htlc/keys'
        }
      ]
    })
  ],
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      events: 'events'
    }
  },
  optimizeDeps: {
    exclude: ['@midnight-ntwrk/compact-js', '@midnight-ntwrk/midnight-js-contracts'],
    esbuildOptions: {
      target: 'esnext'
    }
  },
  build: {
    target: 'esnext',
    minify: false
  },
  server: {
    port: 5173,
    strictPort: true
  }
});
