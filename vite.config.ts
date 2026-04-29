import path from 'node:path'
import { execSync } from 'node:child_process'
import { type ConfigEnv, defineConfig, loadEnv, type UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'
import AutoImport from 'unplugin-auto-import/vite'
import browserslist from 'browserslist'
import pkg from './package.json'
import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'
import checker from 'vite-plugin-checker'
import { validateEnv } from './env/env.validate.ts'

/**
 * @description 获取 Git 信息
 * */
function getGitInfo(): { commitHash: string; branchName: string } {
  try {
    return {
      commitHash: execSync('git rev-parse --short HEAD').toString().trim(),
      branchName: execSync('git rev-parse --abbrev-ref HEAD').toString().trim(),
    }
  } catch {
    return {
      commitHash: 'unknown',
      branchName: 'unknown',
    }
  }
}

/**
 * @description 获取当前时间，时区为东八区
 * */
function getEast8Time(): string {
  // 使用 'en-US' 可以确保返回一个标准的、能被 new Date() 稳定解析的时间字符串
  const targetTime = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai' }))
  // 补零辅助函数（如果数字小于10，前面加 '0'）
  const pad = (num: number) => num.toString().padStart(2, '0')
  const year = targetTime.getFullYear()
  const month = pad(targetTime.getMonth() + 1) // 月份从 0 开始，需要加 1
  const day = pad(targetTime.getDate())
  const hours = pad(targetTime.getHours())
  const minutes = pad(targetTime.getMinutes())
  const seconds = pad(targetTime.getSeconds())
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

/**
 * @description 获取根目录下的 .browserslistrc 配置
 * */
function getBrowserslistConfig(): string[] {
  return browserslist.loadConfig({ path: '.' }) || []
}

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const rawEnv = loadEnv(mode, process.cwd(), 'VITE_')
  const env = validateEnv(rawEnv)
  const isDev = mode === 'development'
  const isProd = mode === 'production'
  const gitInfo = getGitInfo()
  const buildTime = getEast8Time()

  return {
    base: env.VITE_PUBLIC_PATH,

    plugins: [
      vue(),
      // 为了按需注入 JS API polyfills，不生成不支持 ESM 浏览器的打包文件
      legacy({
        renderLegacyChunks: false,
        modernPolyfills: true,
        modernTargets: getBrowserslistConfig(),
      }),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        dts: './auto-imports.d.ts',
        vueTemplate: true,
        viteOptimizeDeps: true,
      }),
      isProd &&
        viteCompression({
          algorithm: 'gzip',
          threshold: 10240,
          ext: '.gz',
        }),
      isProd &&
        viteCompression({
          algorithm: 'brotliCompress',
          ext: '.br',
          threshold: 10240,
          deleteOriginFile: false,
        }),
      env.VITE_ANALYZE &&
        visualizer({
          open: true,
          gzipSize: true,
          brotliSize: true,
          filename: 'dist/stats.html',
        }),
      isDev &&
        checker({
          typescript: true,
          vueTsc: true,
          eslint: {
            lintCommand: 'eslint "./src/**/*.{ts,vue}"',
          },
        }),
    ].filter(Boolean),

    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
      dedupe: ['vue'],
    },

    server: {
      host: '0.0.0.0',
      port: env.VITE_PORT,
      strictPort: true,
      open: false,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api/, ''),
        },
      },
      warmup: {
        clientFiles: ['./src/app/main.ts', './src/app/App.vue'],
      },
    },

    preview: {
      host: '0.0.0.0',
      port: 4173,
    },

    css: {
      devSourcemap: isDev,
      preprocessorOptions: {},
      modules: {
        localsConvention: 'camelCaseOnly',
      },
    },

    build: {
      // @vitejs/plugin-legacy 会自动处理 target
      // target: browserslistToEsbuild(),
      sourcemap: 'hidden',
      minify: 'esbuild',
      chunkSizeWarningLimit: 1000,
      reportCompressedSize: false,
      rollupOptions: {
        output: {
          entryFileNames: 'assets/js/[name]-[hash].js',
          chunkFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          manualChunks(id) {
            if (!id.includes('node_modules')) {
              return
            }
            // 兼容 Windows/Unix 路径，Windows 下路径分隔符是 \
            if (/[\\/]node_modules[\\/](vue|@vue|vue-router|pinia|pinia-plugin-persistedstate)[\\/]/.test(id)) {
              return 'vue-vendor'
            }
            return 'vendor'
          },
        },
      },
    },

    esbuild: {
      pure: isProd ? ['console.log', 'console.info', 'console.debug'] : [],
      drop: isProd ? ['debugger'] : [],
      legalComments: 'none',
    },

    define: {
      // 应用元信息
      __APP_VERSION__: JSON.stringify(pkg.version),
      __BUILD_TIME__: JSON.stringify(buildTime),
      // 环境标识
      __DEV__: JSON.stringify(isDev),
      __PROD__: JSON.stringify(isProd),
      // Git 信息
      __GIT_COMMIT__: JSON.stringify(gitInfo.commitHash),
      __GIT_BRANCH__: JSON.stringify(gitInfo.branchName),
      // Vue 优化
      __VUE_OPTIONS_API__: JSON.stringify(false),
      __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
    },
  }
})
