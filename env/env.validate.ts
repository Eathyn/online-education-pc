import { envSchema, type Env } from './env.schema.ts'

/**
 * 在 Vite 配置阶段校验环境变量，校验失败直接终止构建
 */
export function validateEnv(rawEnv: Record<string, string>): Env {
  const result = envSchema.safeParse(rawEnv)
  if (!result.success) {
    const messages = result.error.issues.map((i) => ` - ${i.path.join('.') || '(root)'}: ${i.message}`).join('\n')
    throw new Error(`\n 环境变量校验失败：\n${messages}\n请检查 .env 文件配置\n`)
  }
  return result.data
}
