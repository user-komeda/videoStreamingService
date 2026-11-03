import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  createAccessToken,
  createBffToken,
  createUserToken,
  TOKEN_TTL_SECONDS,
} from '~/server/auth'
import { verifyJwt } from '~/server/jwt'
import * as redisModule from '~/server/redis'

import type Redis from 'ioredis'

describe('server/auth', () => {
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
    process.env.API_BASE_URL = 'http://localhost:12345'
    process.env.BFF_JWT_SECRET = 'bff-super-secret-key-at-least-16-bytes'
    process.env.USER_JWT_SECRET = 'user-super-secret-key-at-least-16-bytes'
    process.env.REDIS_URL = 'redis://localhost:6379'

    vi.spyOn(redisModule, 'getRedisClient').mockReturnValue(
      mockRedis as unknown as Redis,
    )
  })

  it('createBffToken should throw error if secret is missing', () => {
    delete process.env.BFF_JWT_SECRET
    delete process.env.JWT_SECRET
    expect(() => createBffToken()).toThrow()
  })

  it('createUserToken should throw error if secret is missing', async () => {
    delete process.env.USER_JWT_SECRET
    delete process.env.JWT_SECRET
    await expect(createUserToken('u1', 's1')).rejects.toThrow()
  })

  it('createBffToken should generate a valid JWT with scope: bff and 60-second TTL', () => {
    const { bffToken, tokenId } = createBffToken()
    expect(bffToken).toBeDefined()
    expect(tokenId).toBeDefined()

    const payload = verifyJwt(
      bffToken,
      'bff-super-secret-key-at-least-16-bytes',
    )
    expect(payload).not.toBeNull()
    expect(payload?.scope).toBe('bff')
    expect(payload?.jti).toBe(tokenId)

    const invalidVerify = verifyJwt(
      bffToken,
      'user-super-secret-key-at-least-16-bytes',
    )
    expect(invalidVerify).toBeNull()
  })

  it('createUserToken should generate a valid JWT and store in redis with 60-second TTL', async () => {
    const userId = 'user_123'
    const sessionId = 'session_abc'

    const result = await createUserToken(userId, sessionId)

    expect(result.userToken).toBeDefined()
    expect(result.tokenId).toBeDefined()

    expect(mockRedis.set).toHaveBeenCalledWith(
      `token:access:${result.tokenId}`,
      JSON.stringify({ userId, sessionId }),
      'EX',
      TOKEN_TTL_SECONDS,
    )

    const payload = verifyJwt(
      result.userToken,
      'user-super-secret-key-at-least-16-bytes',
    )
    expect(payload).not.toBeNull()
    expect(payload?.sub).toBe(userId)
    expect(payload?.sid).toBe(sessionId)
    expect(payload?.jti).toBe(result.tokenId)
    expect(payload?.scope).toBe('user')

    const invalidVerify = verifyJwt(
      result.userToken,
      'bff-super-secret-key-at-least-16-bytes',
    )
    expect(invalidVerify).toBeNull()
  })

  it('createAccessToken should be compatible wrapper for createUserToken', async () => {
    const userId = 'user_123'
    const sessionId = 'session_abc'

    const result = await createAccessToken(userId, sessionId)
    expect(result.accessToken).toBeDefined()
    expect(result.tokenId).toBeDefined()
  })
})
