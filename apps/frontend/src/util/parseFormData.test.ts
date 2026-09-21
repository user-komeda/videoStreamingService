import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { parseFormData } from '~/util/parseFormData'

describe('parseFormData', () => {
  it('parses valid FormData according to schema', () => {
    const schema = z.object({
      title: z.string(),
    })
    const formData = new FormData()
    formData.append('title', 'test video')

    const result = parseFormData(formData, schema)
    expect(result).toEqual({
      success: true,
      data: { title: 'test video' },
    })
  })

  it('fails on invalid FormData', () => {
    const schema = z.object({
      count: z.number(),
    })
    const formData = new FormData()
    formData.append('count', 'not-a-number')

    const result = parseFormData(formData, schema)
    expect(result.success).toBe(false)
  })
})
