import type { RawEnv } from '../../env/env.schema.ts'

declare global {
  interface ImportMetaEnv extends RawEnv {}
  const __APP_VERSION__: string
  const __BUILD_TIME__: string
  const __DEV__: boolean
  const __PROD__: boolean
  const __GIT_COMMIT__: string
  const __GIT_BRANCH__: string
  const __VUE_OPTIONS_API__: boolean
  const __VUE_PROD_DEVTOOLS__: boolean
  const __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: boolean
}

export {}
