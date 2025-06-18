import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    historyApiFallback: true,
  },
  plugins: [
    react(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: [
    ]
  },
  build: {
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          // 将React相关的库分离出来
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // 将UI组件库分离出来
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-tabs', '@radix-ui/react-tooltip'],
          // 将Clerk认证相关的库分离出来
          'auth-vendor': ['@clerk/clerk-react', '@clerk/localizations'],
          // 将查询和工具库分离出来
          'utils-vendor': ['@tanstack/react-query', 'clsx', 'class-variance-authority', 'tailwind-merge'],
          // 将图标和markdown相关的库分离出来
          'content-vendor': ['lucide-react', 'react-markdown', 'remark-gfm', 'rehype-raw'],
        }
      }
    },
    // 调整分块大小警告限制
    chunkSizeWarningLimit: 1000
  }
}));