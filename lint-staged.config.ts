import type { Configuration } from 'lint-staged'

const eslint = `eslint
  --cache
  --fix
  --cache-location node_modules/.cache/eslint/.eslintcache
  --cache-strategy content
  --max-warnings 0
  --no-warn-ignored`

const stylelint = `stylelint
  --cache
  --fix
  --config ./stylelint.config.ts
  --cache-location node_modules/.cache/stylelint/.stylelintcache`

const prettier = 'prettier --write --ignore-unknown'

const lintStagedConfig = {
  '*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}': [eslint, prettier],
  '*.vue': [eslint, stylelint, prettier],
  '*.{css,scss,less}': [stylelint, prettier],
  '*.{html,md,json,jsonc,json5,yaml,yml}': [prettier],
} satisfies Configuration

export default lintStagedConfig
