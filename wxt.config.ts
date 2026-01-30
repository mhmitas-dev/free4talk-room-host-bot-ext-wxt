import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Free4Talk Room Host Bot',
    version: '1.0.0',
    host_permissions: [
      "http://localhost:3000/*",
      "http://127.0.0.1:3000/*",
    ],
    permissions: [
      'storage',
      'tabs',
      'activeTab',
      'scripting',
    ]
  }
});