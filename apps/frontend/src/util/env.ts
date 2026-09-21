import { z } from 'zod'

const EnvSchema = z.object({
  API_BASE_URL: z.url(),
  // SESSION_PASSWORD: z.string().min(32),
  // JWT_SECRET: z.string().min(32),
  // BFF_JWT_SECRET: z.string().min(32),
  // JWT_ISSUER: z.string().min(1),
  // JWT_AUDIENCE: z.string().min(1),
  // REDIS_URL: z.url(),
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
