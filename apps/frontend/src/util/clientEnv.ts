import { z } from 'zod'

const EnvSchema = z.object({
  VITE_API_BASE_URL: z.url(),
  VITE_TUS_ENDPOINT: z.url(),
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
