import type { Config } from 'postcss-load-config'
import type { pluginOptions } from 'postcss-preset-env'
import type { Options } from 'autoprefixer'

const postCssPresetEnvOptions: pluginOptions = {
  stage: 2,
  features: {
    // 因为 Chrome 87+ 和 Safari 14+ 原生支持变量，开启转换会导致 Tailwind 的动态颜色计算失效，并让 CSS 体积暴增
    'custom-properties': false,
    'nesting-rules': true,
    // 开启现代颜色函数降级（如 oklch, color-mix）
    'color-function': true,
    'oklab-function': true,
    // 逻辑属性降级（如 margin-inline），提升编写效率
    'logical-properties-and-values': true,
  },
}

const autoprefixerOptions: Options = {
  flexbox: 'no-2009',
  grid: false,
}

const config: Config = {
  plugins: {
    // 处理 CSS 导入 (如 @import 'parts/base.css')
    'postcss-import': {},
    '@tailwindcss/postcss': {},
    // 未来 CSS 语法降级
    'postcss-preset-env': postCssPresetEnvOptions,
    autoprefixer: autoprefixerOptions,
  },
}

export default config
