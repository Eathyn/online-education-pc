import type { Config } from 'stylelint'

const stylelintConfig = {
  ignoreFiles: ['**/*.{js,jsx,ts,tsx}', '**/*.json', '**/*.md', 'dist/**', 'node_modules/**'],
  extends: ['stylelint-config-standard', 'stylelint-config-standard-vue', 'stylelint-config-hudochenkov/order'],
  plugins: ['stylelint-no-unsupported-browser-features'],
  rules: {
    'import-notation': 'string',
    // 兼容 Tailwind 的特有指令 (At-Rules 和 Functions)
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
          'layer',
          'config',
          'theme',
          'source',
          'utility',
          'variant',
          'custom-variant',
          'reference',
          'plugin',
        ],
      },
    ],
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: ['theme', 'screen', '--alpha', '--spacing'],
      },
    ],
    // 如果使用了 Tailwind 推荐的嵌套，忽略空规则警告
    'no-empty-source': null,
    // 基于 browserslist 拦截不兼容代码
    'plugin/no-unsupported-browser-features': [
      true,
      {
        severity: 'warning', // 建议先设为 warning，避免老代码直接阻断 CI
        ignore: [
          'css-nesting',
          'custom-properties', // Chrome 87 / Safari 14 原生支持
          'css-color-function', // 会由 postcss-preset-env 降级
        ],
        ignorePartialSupport: true, // 忽略部分支持的警告，减少噪音
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
    },
  ],
} satisfies Config

export default stylelintConfig
