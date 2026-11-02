import Redis from 'ioredis'

import { getEnv } from '~/util/env'

let redisClient: Redis | null = null

export const getRedisClient = (): Redis => {
  if (typeof window !== 'undefined') {
    throw new Error('Redis client cannot be accessed on the client side.')
  }

  if (!redisClient) {
    const { REDIS_URL } = getEnv()
    redisClient = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 3,
      lazyConnect: false,
    })
  }

  return redisClient
}

export const closeRedisClient = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit()
    redisClient = null
  }
}
