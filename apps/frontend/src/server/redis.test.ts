import Redis from 'ioredis'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { closeRedisClient, getRedisClient } from '~/server/redis'

vi.mock('ioredis')

describe('server/redis', () => {
  const originalWindow = global.window

  beforeEach(async () => {
    // @ts-expect-error simulating Node server environment without window
    delete global.window
    await closeRedisClient()
    vi.clearAllMocks()
    process.env.API_BASE_URL = 'http://localhost:12345'
    process.env.BFF_JWT_SECRET = 'bff-super-secret-key-at-least-16-bytes'
    process.env.USER_JWT_SECRET = 'user-super-secret-key-at-least-16-bytes'
    process.env.REDIS_URL = 'redis://localhost:6379'
  })

  afterEach(() => {
    global.window = originalWindow
  })

  it('getRedisClient creates and returns redis client', () => {
    const client = getRedisClient()
    expect(client).toBeDefined()
    expect(Redis).toHaveBeenCalledWith('redis://localhost:6379', {
      maxRetriesPerRequest: 3,
      lazyConnect: false,
    })

    const client2 = getRedisClient()
    expect(client2).toBe(client)
  })

  it('closeRedisClient quits and clears client', async () => {
    const client = getRedisClient()
    const quitMock = vi.spyOn(client, 'quit')
    await closeRedisClient()
    expect(quitMock).toHaveBeenCalled()
  })

  it('throws error when accessed on client side', () => {
    global.window = originalWindow

    expect(() => getRedisClient()).toThrow(
      'Redis client cannot be accessed on the client side.',
    )
  })
})
