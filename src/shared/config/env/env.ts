import { envSchema, type Env } from '@/../env/env.schema.ts'

/**
 * 运行时环境变量（已校验+转换）
 * - 在应用入口 import 一次即可完成校验
 * - 校验失败会在控制台抛错，便于定位
 */
function parseRuntimeEnv(): Env {
  const result = envSchema.safeParse(import.meta.env)
  if (!result.success) {
    console.error('[env] 运行时环境变量校验失败：', result.error.issues)
    throw new Error('Invalid runtime environment variables')
  }
  return result.data
}

export const env: Env = parseRuntimeEnv()
