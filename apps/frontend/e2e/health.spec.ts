import { expect, test } from '@playwright/test'

test.describe('Health check endpoint', () => {
  test('should return 200 OK and connected status from backend', async ({
    request,
  }) => {
    const response = await request.get('/health')

    expect(response.status()).toBe(200)

    const body: unknown = await response.json()
    expect(body).toEqual({
      status: 'ok',
      backend: 'connected',
    })
  })
})
