import { getEnv as getClientEnv } from '~/util/clientEnv'
import { getEnv } from '~/util/env'

const getBaseUrl = () => {
  // サーバーサイド (Node.js) 実行時: env.ts (process.env) を参照
  if (typeof window === 'undefined') {
    return getEnv().API_BASE_URL
  }

  // クライアント (ブラウザ) 実行時: clientEnv.ts (import.meta.env) を参照
  const clientEnv = getClientEnv()
  return clientEnv.VITE_API_BASE_URL
}

export const customFetch = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  const fullUrl = `${getBaseUrl()}${url}`

  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(errorBody || `HTTP error! status: ${response.status}`)
  }

  let data: unknown = {}
  if (response.status !== 204) {
    data = await response.json()
  }

  return {
    data,
    status: response.status,
    headers: response.headers,
  } as T
}

export default customFetch
