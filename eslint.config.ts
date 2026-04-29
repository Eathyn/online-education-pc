import js from '@eslint/js'
import globals from 'globals'
import tsEslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import json from '@eslint/json'
import markdown from '@eslint/markdown'
import { defineConfig } from 'eslint/config'
import eslintConfigPrettier from 'eslint-config-prettier'

export default defineConfig([
  // 发现无效的 `eslint-disable-next-line`
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
      reportUnusedInlineConfigs: 'error',
    },
  },

  // 全局忽略自动生成的和打包的文件
  {
    ignores: ['dist', 'node_modules', 'auto-imports.d.ts'],
  },

  // JS 规则
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
    ...js.configs.recommended,
  },

  // TS 规则
  {
    files: ['**/*.{ts,mts,cts,vue}'],
    extends: [...tsEslint.configs.recommendedTypeChecked, ...tsEslint.configs.stylisticTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: ['.vue'],
      },
    },
    rules: {
      '@typescript-eslint/no-empty-object-type': [
        'error',
        {
          allowInterfaces: 'with-single-extends',
        },
      ],
    },
  },

  // Vue 规则
  ...pluginVue.configs['flat/recommended'].map((config) => ({
    ...config,
    files: ['**/*.vue'],
  })),

  // 针对 Vue 文件的环境与下层 TS 解析器补充
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tsEslint.parser,
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: ['.vue'],
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // 针对纯 TS/JS 文件的环境声明
  {
    files: ['**/*.{ts,mts,cts,js,mjs,cjs}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // 关闭配置文件的强类型检查
  {
    files: ['**/*.config.ts', '**/*.config.js', '**/*.config.cjs', '**/*.config.mjs'],
    ...tsEslint.configs.disableTypeChecked,
  },

  // JSON 与 MD 的专属规则
  // 标准 JSON (如 package.json)
  {
    files: ['**/*.json'],
    ignores: ['tsconfig.json', 'tsconfig.*.json'],
    plugins: { json },
    language: 'json/json',
    extends: ['json/recommended'],
  },
  // 针对 tsconfig.json 等支持注释和逗号的文件，使用 json5
  {
    files: ['tsconfig.json', 'tsconfig.*.json'],
    plugins: { json },
    language: 'json/json5',
    extends: ['json/recommended'],
  },
  {
    files: ['**/*.jsonc'],
    plugins: { json },
    language: 'json/jsonc',
    extends: ['json/recommended'],
  },
  {
    files: ['**/*.json5'],
    plugins: { json },
    language: 'json/json5',
    extends: ['json/recommended'],
  },
  {
    files: ['**/*.md'],
    plugins: { markdown },
    language: 'markdown/gfm',
    extends: ['markdown/recommended'],
  },

  // 把未定义变量的检查权全权移交给 TypeScript
  {
    files: ['**/*.{ts,mts,cts,vue}'],
    rules: {
      'no-undef': 'off',
    },
  },

  // 处理 Prettier 与 ESLint 的冲突
  eslintConfigPrettier,
])
