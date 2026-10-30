import { type ActionFunctionArgs, redirect } from 'react-router'

import { customFetch } from '~/api/client'
import { SignInCard } from '~/feature/auth/components/SignInCard'
import { signInSchema } from '~/feature/auth/formOptions'
import { createSession, SESSION_TTL_SECONDS } from '~/server/session'
import { parseFormData } from '~/util/parseFormData'

import type { AuthActionResult } from '~/feature/auth/types/type'

type SignInResponse = {
  data: {
    user_id: string
  }
}

const handleSignIn = async (
  data: unknown,
  signal?: AbortSignal,
): Promise<Response> => {
  const res = await customFetch<SignInResponse>('/auth/signin', {
    method: 'POST',
    body: JSON.stringify(data),
    signal,
  })

  const { sessionId } = await createSession(res.data.user_id)
  const cookieHeader = `sessionId=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}`

  const redirectFn = redirect as (url: string, init?: ResponseInit) => Response
  return redirectFn('/', {
    headers: {
      'Set-Cookie': cookieHeader,
    },
  })
}

export const action = async ({
  request,
}: ActionFunctionArgs): Promise<Response | AuthActionResult> => {
  const formData = await request.formData()
  const parseResult = parseFormData(formData, signInSchema)

  if (!parseResult.success) {
    const issue = parseResult.error.issues[0]
    return {
      success: false,
      error: issue?.message || '入力内容に誤りがあります',
    }
  }

  try {
    return await handleSignIn(parseResult.data, request.signal)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '認証に失敗しました'
    return { success: false, error: message }
  }
}

const Route = () => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <SignInCard />
    </div>
  )
}

export default Route
