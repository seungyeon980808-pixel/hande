import { defineConfig } from 'vite';
import { resolve } from 'node:path';

const root = import.meta.dirname;

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify('0.8.4-assignment'),
    __RHWP_DISABLE_EXTERNAL_WEBFONTS__: JSON.stringify(true),
  },
  resolve: {
    alias: {
      '@': resolve(root, 'src'),
      '@wasm/rhwp.js': resolve(root, '..', '..', 'node_modules', '@rhwp', 'core', 'rhwp.js'),
      '@wasm': resolve(root, '..', '..', 'node_modules', '@rhwp', 'core'),
    },
  },
  server: { host: '0.0.0.0', port: 7700, fs: { allow: [resolve(root, '..', '..')] } },
  preview: { host: '0.0.0.0', port: 7700 },
  build: { target: 'es2022', minify: false, cssMinify: false },
});
