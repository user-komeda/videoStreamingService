import { createHmac } from 'node:crypto'

import { describe, expect, it } from 'vitest'

import { signJwt, verifyJwt } from '~/server/jwt'

describe('server/jwt', () => {
  it('signJwt and verifyJwt works as expected', () => {
    const secret = 'super-secret-key-at-least-16-bytes'
    const token = signJwt({ sub: 'user-1' }, secret, 60)
    const verified = verifyJwt(token, secret)
    expect(verified?.sub).toBe('user-1')
  })

  it('verifyJwt should return null for malformed tokens or expired tokens', () => {
    expect(verifyJwt('invalid-token', 'secret')).toBeNull()
    expect(verifyJwt('a.b', 'secret')).toBeNull()
    expect(verifyJwt('a.b.c.d', 'secret')).toBeNull()

    const expiredToken = signJwt({ sub: 'u1' }, 'secret', -10)
    expect(verifyJwt(expiredToken, 'secret')).toBeNull()

    // Invalid base64url payload
    const header = Buffer.from(
      JSON.stringify({ alg: 'HS256', typ: 'JWT' }),
    ).toString('base64url')
    const signature = 'sig'
    expect(
      verifyJwt(`${header}.invalid%%%payload.${signature}`, 'secret'),
    ).toBeNull()

    // Invalid JSON payload that causes JSON.parse to throw
    const invalidJsonPayload = Buffer.from('not a json').toString('base64url')
    const secret = 'secret'
    const sigInput = `${header}.${invalidJsonPayload}`
    const expectedSig = Buffer.from(
      createHmac('sha256', secret).update(sigInput).digest(),
    ).toString('base64url')
    expect(verifyJwt(`${sigInput}.${expectedSig}`, secret)).toBeNull()
  })
})
