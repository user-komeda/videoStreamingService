import { getEnv } from '~/util/env'

export async function loader() {
  try {
    const { API_BASE_URL } = getEnv()
    const res = await fetch(`${API_BASE_URL}/health`, {
      signal: AbortSignal.timeout(3000),
    })

    if (!res.ok) {
      return Response.json(
        {
          status: 'error',
          backend: 'unhealthy',
          statusCode: res.status,
        },
        { status: 503 },
      )
    }

    return Response.json(
      {
        status: 'ok',
        backend: 'connected',
      },
      { status: 200 },
    )
  } catch (error) {
    return Response.json(
      {
        status: 'error',
        backend: 'unreachable',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 503 },
    )
  }
}
