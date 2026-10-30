import { useCallback } from 'react'

import { mergeForm, useForm } from '@tanstack/react-form'

import { signInFormOpts } from '~/feature/auth/formOptions'

import type { AuthActionResult } from '~/feature/auth/types/type'

export const useSignInForm = (actionData?: AuthActionResult) => {
  const transform = useCallback(
    (baseForm: unknown) =>
      mergeForm(
        baseForm as never,
        (actionData && !actionData.success && actionData.error
          ? { errorMap: { onSubmit: actionData.error } }
          : {}) as never,
      ),
    [actionData],
  )

  return useForm({
    ...signInFormOpts,
    transform,
  })
}

export type SignInFormInstance = ReturnType<typeof useSignInForm>
