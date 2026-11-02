import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import { customFetch } from '~/api/client'

const server = setupServer()

describe('customFetch', () => {
  beforeAll(() => {
    server.listen()
  })

  afterEach(() => {
    server.resetHandlers()
  })

  afterAll(() => {
    server.close()
  })

  beforeEach(() => {
    process.env.API_BASE_URL = 'http://localhost:8080'
    process.env.BFF_JWT_SECRET = 'bff-super-secret-key-at-least-16-bytes'
    process.env.USER_JWT_SECRET = 'user-super-secret-key-at-least-16-bytes'
    process.env.REDIS_URL = 'redis://localhost:6379'
    process.env.VITE_API_BASE_URL = 'http://localhost:8080'
    process.env.VITE_TUS_ENDPOINT = 'http://localhost:8080/files/'
  })

  it('fetches JSON response successfully', async () => {
    server.use(
      http.get('http://localhost:8080/test', ({ request }) => {
        if (request.headers.get('authorization') === 'Bearer token') {
          return HttpResponse.json({ id: '123' }, { status: 200 })
        }
        return new HttpResponse(null, { status: 401 })
      }),
    )

    const result = await customFetch<{
      data: { id: string }
      status: number
      headers: Headers
    }>('/test', {
      headers: { Authorization: 'Bearer token' },
    })

    expect(result.status).toBe(200)
    expect(result.data).toEqual({ id: '123' })
  })

  it('handles 204 No Content response', async () => {
    server.use(
      http.get('http://localhost:8080/empty', () => {
        return new HttpResponse(null, { status: 204 })
      }),
    )

    const result = await customFetch<{
      data: unknown
      status: number
      headers: Headers
    }>('/empty')

    expect(result.status).toBe(204)
    expect(result.data).toEqual({})
  })

  it('throws error with errorBody on failed response', async () => {
    server.use(
      http.get('http://localhost:8080/error', () => {
        return new HttpResponse('Invalid payload', { status: 400 })
      }),
    )

    await expect(customFetch('/error')).rejects.toThrow('Invalid payload')
  })

  it('throws fallback error message when errorBody is empty', async () => {
    server.use(
      http.get('http://localhost:8080/server-error', () => {
        return new HttpResponse('', { status: 500 })
      }),
    )

    await expect(customFetch('/server-error')).rejects.toThrow(
      'HTTP error! status: 500',
    )
  })

  it('uses clientEnv VITE_API_BASE_URL when executed in browser environment', async () => {
    vi.stubGlobal('window', {})
    server.use(
      http.get('http://localhost:8080/client-test', () => {
        return HttpResponse.json({ success: true }, { status: 200 })
      }),
    )

    const result = await customFetch<{
      data: { success: boolean }
      status: number
      headers: Headers
    }>('/client-test')

    expect(result.status).toBe(200)
    expect(result.data).toEqual({ success: true })
    vi.unstubAllGlobals()
  })

  it('uses env API_BASE_URL when executed in server environment', async () => {
    const originalWindow = globalThis.window
    // @ts-expect-error - jsdom 環境で window を一時的に undefined にする
    delete globalThis.window

    server.use(
      http.get('http://localhost:8080/server-test', () => {
        return HttpResponse.json({ success: true }, { status: 200 })
      }),
    )

    try {
      const result = await customFetch<{
        data: { success: boolean }
        status: number
        headers: Headers
      }>('/server-test')

      expect(result.status).toBe(200)
      expect(result.data).toEqual({ success: true })
    } finally {
      globalThis.window = originalWindow
    }
  })
})
