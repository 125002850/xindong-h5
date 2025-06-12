import type { BuildOptions, ServerOptions } from 'vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const config: { server: (env: NodeJS.ProcessEnv) => ServerOptions, build: BuildOptions } = {
  build: {
    target: 'es2018',
    cssTarget: 'chrome79',
    minify: true,
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000,
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks(id: string) {
          // 处理css分块
          if (id.includes('node_modules')) {
            return 'vendor'
          }
          if (id.includes('__uno.css')) {
            return 'unocss'
          }
        },
      },
      external: /\.\/static.*/,
    },
  },
  server: env => ({
    port: 7771,
    proxy: {
      '/api': {
        target: env.VITE_API_URL,
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, '/api'),
      },
    },
    /**
     * 预热常用文件
     * @see https://cn.vitejs.dev/guide/performance#warm-up-frequently-used-files
     */
    warmup: {
      clientFiles: ['./src/main.ts', './src/views/**/*.vue'],
    },
  }),
}

export default config
