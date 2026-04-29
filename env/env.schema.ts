import { z } from 'zod'

export const envSchema = z.object({
  // 公共路径，可选，默认 '/'
  VITE_PUBLIC_PATH: z.string().default('/'),
  // API 基础地址，必填，需为合法 URL
  VITE_API_BASE_URL: z.url({ message: 'VITE_API_BASE_URL 必须是合法 URL' }),
  // 应用环境标识，必填，枚举
  VITE_APP_ENV: z.enum(['dev', 'test', 'staging', 'prod']),
  // 端口号，可选，字符串转数字，范围校验
  VITE_PORT: z
    .string()
    .optional()
    .default('5173')
    .transform((v) => Number(v))
    .pipe(z.number().int().min(1).max(65535)),
  // 是否开启打包分析，可选，字符串转布尔
  VITE_ANALYZE: z
    .enum(['true', 'false'])
    .optional()
    .default('false')
    .transform((v) => v === 'true'),
})

/**
 * 原始（string 形式）的输入类型 —— 用于 ImportMetaEnv
 * z.input 得到的是转换前的类型（都是 string），与 Vite 注入到 import.meta.env 的真实类型一致
 * */
export type RawEnv = z.input<typeof envSchema>

/**
 * 解析后（含 transform）的输出类型 —— 用于运行时
 * z.output 得到的是转换后的类型（带 number/boolean），用于运行时访问
 * */
export type Env = z.output<typeof envSchema>
