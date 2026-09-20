import { describe, it, expect, beforeEach, vi } from 'vitest'

import { getEnv } from '~/util/env'

describe('env', () => {
  beforeEach(() => {
    vi.resetModules()
    process.env.SESSION_PASSWORD = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    process.env.JWT_SECRET = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    process.env.BFF_JWT_SECRET = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    process.env.JWT_ISSUER = 'test'
    process.env.JWT_AUDIENCE = 'test'
    process.env.REDIS_URL = 'redis://localhost:6379'
  })

  it('should return env variables when all are valid', () => {
    expect(getEnv()).toEqual({
      SESSION_PASSWORD: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      JWT_SECRET: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      BFF_JWT_SECRET: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      JWT_ISSUER: 'test',
      JWT_AUDIENCE: 'test',
      REDIS_URL: 'redis://localhost:6379',
    })
  })

  it('should throw an error when REDIS_URL is invalid', () => {
    process.env.REDIS_URL = 'invalid-url'

    expect(() => getEnv()).toThrow('Invalid frontend env')
  })

  it('should throw an error when all paths are missing', () => {
    process.env = {}

    expect(() => getEnv()).toThrow('Invalid frontend env')
  })
})
