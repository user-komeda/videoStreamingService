import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as redisModule from '~/server/redis'
import {
  createSession,
  getSession,
  revokeSession,
  SESSION_TTL_SECONDS,
} from '~/server/session'

import type Redis from 'ioredis'

describe('server/session', () => {
  const mockStorage = new Map<string, string>()

  const mockRedis = {
    set: vi.fn((...args: [string, string, string?, number?]): Promise<'OK'> => {
      const [key, val] = args
      mockStorage.set(key, val)
      return Promise.resolve('OK')
    }),
    get: vi.fn((key: string): Promise<string | null> => {
      return Promise.resolve(mockStorage.get(key) ?? null)
    }),
    del: vi.fn((key: string): Promise<number> => {
      mockStorage.delete(key)
      return Promise.resolve(1)
    }),
    quit: vi.fn((): Promise<'OK'> => Promise.resolve('OK')),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockStorage.clear()
    vi.spyOn(redisModule, 'getRedisClient').mockReturnValue(
      mockRedis as unknown as Redis,
    )
  })

  it('createSession should create a random UUID sessionId and store in redis with 1-day TTL', async () => {
    const userId = 'user_123'
    const result = await createSession(userId)

    expect(result.sessionId).toBeDefined()
    expect(typeof result.sessionId).toBe('string')

    expect(mockRedis.set).toHaveBeenCalledWith(
      `session:${result.sessionId}`,
      expect.stringContaining(userId),
      'EX',
      SESSION_TTL_SECONDS,
    )

    const session = await getSession(result.sessionId)
    expect(session?.userId).toBe(userId)
    expect(typeof session?.createdAt).toBe('number')
  })

  it('getSession should return null if sessionId does not exist in redis', async () => {
    const session = await getSession('non-existent-session-id')
    expect(session).toBeNull()

    const emptySession = await getSession('')
    expect(emptySession).toBeNull()

    mockStorage.set('session:invalid-json', 'invalid json')
    const invalidJsonSession = await getSession('invalid-json')
    expect(invalidJsonSession).toBeNull()
  })

  it('revokeSession should return early if sessionId is empty', async () => {
    await revokeSession('')
    expect(mockRedis.del).not.toHaveBeenCalled()
  })

  it('revokeSession should delete the session from redis', async () => {
    const sessionId = 'session_to_delete'
    mockStorage.set(`session:${sessionId}`, JSON.stringify({ userId: 'u1' }))

    await revokeSession(sessionId)

    expect(mockRedis.del).toHaveBeenCalledWith(`session:${sessionId}`)
    expect(mockStorage.has(`session:${sessionId}`)).toBe(false)
  })
})
