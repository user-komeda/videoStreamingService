import { createHmac } from 'node:crypto'

export interface JwtPayload {
  [key: string]: unknown
  exp?: number
  iat?: number
  jti?: string
  scope?: string
  sid?: string
  sub?: string
}

const base64UrlEncode = (input: string | Buffer): string => {
  const buf = typeof input === 'string' ? Buffer.from(input, 'utf-8') : input
  return buf.toString('base64url')
}

const base64UrlDecode = (input: string): string => {
  return Buffer.from(input, 'base64url').toString('utf-8')
}

export const signJwt = (
  payload: Record<string, unknown>,
  secret: string,
  expiresInSeconds: number,
): string => {
  const header = { alg: 'HS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const fullPayload: JwtPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  }

  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload))
  const signatureInput = `${encodedHeader}.${encodedPayload}`

  const signature = createHmac('sha256', secret).update(signatureInput).digest()
  const encodedSignature = base64UrlEncode(signature)

  return `${signatureInput}.${encodedSignature}`
}

export const verifyJwt = (token: string, secret: string): JwtPayload | null => {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }

    const [encodedHeader, encodedPayload, encodedSignature] = parts
    const signatureInput = `${encodedHeader}.${encodedPayload}`

    const expectedSignature = createHmac('sha256', secret)
      .update(signatureInput)
      .digest()
    const expectedEncodedSignature = base64UrlEncode(expectedSignature)

    if (encodedSignature !== expectedEncodedSignature) {
      return null
    }

    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as JwtPayload
    const now = Math.floor(Date.now() / 1000)
    if (typeof payload.exp === 'number' && payload.exp < now) {
      return null
    }

    return payload
  } catch {
    return null
  }
}
