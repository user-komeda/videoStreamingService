import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { getEnv } from '~/util/env'

describe('env', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
    process.env.API_BASE_URL = 'http://localhost:12345'
    process.env.BFF_JWT_SECRET = 'test-bff-secret-min-16-chars'
    process.env.USER_JWT_SECRET = 'test-user-secret-min-16-chars'
    process.env.REDIS_URL = 'redis://localhost:6379'
  })

  afterEach(() => {
    process.env = { ...originalEnv }
  })

  it('should return env variables when all are valid', () => {
    expect(getEnv()).toEqual({
      API_BASE_URL: 'http://localhost:12345',
      BFF_JWT_SECRET: 'test-bff-secret-min-16-chars',
      USER_JWT_SECRET: 'test-user-secret-min-16-chars',
      REDIS_URL: 'redis://localhost:6379',
    })
  })

  it('should throw an error when API_BASE_URL is invalid', () => {
    process.env.API_BASE_URL = 'invalid-url'

    expect(() => getEnv()).toThrow('Invalid frontend env')
  })

  it('should throw an error when all paths are missing', () => {
    process.env = {}

    expect(() => getEnv()).toThrow('Invalid frontend env')
  })
})
