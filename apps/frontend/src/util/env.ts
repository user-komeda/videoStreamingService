import { z } from 'zod'

const EnvSchema = z.object({
  API_BASE_URL: z.url(),
  JWT_SECRET: z.string().min(16).optional(),
  BFF_JWT_SECRET: z.string().min(16),
  USER_JWT_SECRET: z.string().min(16),
  REDIS_URL: z.string().min(1),
})

export const getEnv = () => {
  const result = EnvSchema.safeParse(process.env)

  if (!result.success) {
    console.error('Invalid frontend env:', result.error.issues)
    const messages = result.error.issues.map((issue) => {
      /* v8 ignore next -- @preserve */
      const path = issue.path.join('.') || 'unknown'
      return `${path}: ${issue.message}`
    })

    throw new Error(`Invalid frontend env:\n${messages.join('\n')}`)
  }
  return result.data
}
