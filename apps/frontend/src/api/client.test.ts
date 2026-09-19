import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { customFetch } from '~/api/client'

describe('customFetch', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  it('fetches JSON response successfully', async () => {
    const mockHeaders = new Headers({ 'content-type': 'application/json' })
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: mockHeaders,
      json: vi.fn().mockResolvedValue({ id: '123' }),
    })

    const result = await customFetch<{
      data: { id: string }
      status: number
      headers: Headers
    }>('/test', {
      headers: { Authorization: 'Bearer token' },
    })

    expect(result.status).toBe(200)
    expect(result.data).toEqual({ id: '123' })
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/test',
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token',
        },
      }),
    )
  })

  it('handles 204 No Content response', async () => {
    const mockHeaders = new Headers()
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 204,
      headers: mockHeaders,
    })

    const result = await customFetch<{
      data: unknown
      status: number
      headers: Headers
    }>('/empty')

    expect(result.status).toBe(204)
    expect(result.data).toEqual({})
  })

  it('throws error with errorBody on failed response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      text: vi.fn().mockResolvedValue('Invalid payload'),
    })

    await expect(customFetch('/error')).rejects.toThrow('Invalid payload')
  })

  it('throws fallback error message when errorBody is empty', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: vi.fn().mockResolvedValue(''),
    })

    await expect(customFetch('/server-error')).rejects.toThrow(
      'HTTP error! status: 500',
    )
  })
})
