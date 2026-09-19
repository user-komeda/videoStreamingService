const BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ||
  'http://localhost:8080'

export const customFetch = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  const fullUrl = `${BASE_URL}${url}`

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
