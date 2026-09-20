import { describe, it, expect, beforeEach, vi } from 'vitest'

import { getEnv } from '~/util/clientEnv'

describe('clientEnv', () => {
  beforeEach(() => {
    vi.resetModules()
    process.env.VITE_API_BASE_URL = 'http://localhost:12345'
    process.env.VITE_TUS_ENDPOINT = 'http://localhost:12345'
  })

  it('should return env variables when all are valid', () => {
    expect(getEnv()).toEqual({
      VITE_API_BASE_URL: 'http://localhost:12345',
      VITE_TUS_ENDPOINT: 'http://localhost:12345',
    })
  })

  it('should throw an error when VITE_API_BASE_URL is invalid', () => {
    process.env.VITE_API_BASE_URL = 'invalid-url'

    expect(() => getEnv()).toThrow('Invalid frontend env')
  })

  it('should throw an error when all paths are missing', () => {
    process.env = {}

    expect(() => getEnv()).toThrow('Invalid frontend env')
  })
})
