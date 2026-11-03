import { randomUUID } from 'node:crypto'

import { getRedisClient } from '~/server/redis'

export const SESSION_TTL_SECONDS = 24 * 60 * 60 // 1日 (86400秒)

export interface SessionData {
  createdAt: number
  userId: string
}

/**
 * ログイン時に呼出: ランダムな UUID (sessionId) を生成し、Redis にセッション情報を保存 (TTL: 1日)
 * ブラウザの HttpOnly Cookie には sessionId (UUID) をそのまま格納します
 */
export const createSession = async (
  userId: string,
  sessionId: string = randomUUID(),
): Promise<{ sessionId: string }> => {
  const redis = getRedisClient()

  const sessionKey = `session:${sessionId}`
  await redis.set(
    sessionKey,
    JSON.stringify({ userId, createdAt: Math.floor(Date.now() / 1000) }),
    'EX',
    SESSION_TTL_SECONDS,
  )

  return { sessionId }
}

/**
 * Cookie 内の sessionId (UUID) から Redis 上のセッション情報を取得・検証
 */
export const getSession = async (
  sessionId: string,
): Promise<SessionData | null> => {
  if (!sessionId || typeof sessionId !== 'string') {
    return null
  }

  const redis = getRedisClient()
  const sessionData = await redis.get(`session:${sessionId}`)
  if (!sessionData) {
    return null
  }

  try {
    return JSON.parse(sessionData) as SessionData
  } catch {
    return null
  }
}

/**
 * ログアウト時: セッションを Redis から破棄
 */
export const revokeSession = async (sessionId: string): Promise<void> => {
  if (!sessionId) {
    return
  }
  const redis = getRedisClient()
  await redis.del(`session:${sessionId}`)
}
