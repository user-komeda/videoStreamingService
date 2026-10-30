import { useCallback } from 'react'

import { mergeForm, useForm } from '@tanstack/react-form'

import { signUpFormOpts } from '~/feature/auth/formOptions'

import type { AuthActionResult } from '~/feature/auth/types/type'

export const useSignUpForm = (actionData?: AuthActionResult) => {
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
    ...signUpFormOpts,
    transform,
  })
}

export type SignUpFormInstance = ReturnType<typeof useSignUpForm>
