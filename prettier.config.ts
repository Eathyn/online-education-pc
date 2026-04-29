import { type Config } from 'prettier'

const prettierConfig = {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  singleAttributePerLine: true,
  htmlWhitespaceSensitivity: 'ignore',
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  endOfLine: 'lf',
  arrowParens: 'always',
  bracketSpacing: true,
  vueIndentScriptAndStyle: false,
} satisfies Config

export default prettierConfig
