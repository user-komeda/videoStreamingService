import { zfd } from 'zod-form-data'

import type { ZodTypeAny } from 'zod'

export const parseFormData = <T extends ZodTypeAny>(
  formData: FormData,
  schema: T,
) => {
  return zfd.formData(schema).safeParse(formData)
}
