import { randomUUID } from 'node:crypto'

import { signJwt } from '~/server/jwt'
import { getRedisClient } from '~/server/redis'
import { getEnv } from '~/util/env'

export const TOKEN_TTL_SECONDS = 60 // 60秒
export const ACCESS_TOKEN_TTL_SECONDS = TOKEN_TTL_SECONDS // 互換性のため維持

export interface UserTokenPayload {
  sessionId: string
  tokenId: string
  userId: string
}

export interface BffTokenPayload {
  scope: 'bff'
  tokenId: string
}

/**
 * BFF JWT 生成（認証前エンドポイント向け）:
 * 「このリクエストは BFF 経由である」ことの証明。有効期限 60 秒。
 */
export const createBffToken = (): { bffToken: string; tokenId: string } => {
  const { BFF_JWT_SECRET } = getEnv()
  const tokenId = randomUUID()

  const bffToken = signJwt(
    { scope: 'bff', jti: tokenId },
    BFF_JWT_SECRET,
    TOKEN_TTL_SECONDS,
  )

  return { bffToken, tokenId }
}

/**
 * USER JWT 生成（認証後エンドポイント向け）:
 * 「このユーザーとして実行する」ことの証明。有効期限 60 秒。
 * Redis に token:access:<tokenId> を保存し、Backend 側で検証・存在確認。
 */
export const createUserToken = async (
  userId: string,
  sessionId: string,
): Promise<{ tokenId: string; userToken: string }> => {
  const { USER_JWT_SECRET } = getEnv()
  const redis = getRedisClient()
  const tokenId = randomUUID()

  const userToken = signJwt(
    { sub: userId, sid: sessionId, jti: tokenId, scope: 'user' },
    USER_JWT_SECRET,
    TOKEN_TTL_SECONDS,
  )

  const tokenKey = `token:access:${tokenId}`
  await redis.set(
    tokenKey,
    JSON.stringify({ userId, sessionId }),
    'EX',
    TOKEN_TTL_SECONDS,
  )

  return { userToken, tokenId }
}

/**
 * 以前の createAccessToken との互換ラッパー
 */
export const createAccessToken = async (
  userId: string,
  sessionId: string,
): Promise<{ accessToken: string; tokenId: string }> => {
  const { userToken, tokenId } = await createUserToken(userId, sessionId)
  return { accessToken: userToken, tokenId }
}
