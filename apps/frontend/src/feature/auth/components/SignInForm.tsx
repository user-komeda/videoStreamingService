import { useFetcher } from 'react-router'

import { useStore } from '@tanstack/react-store'

import { Alert, AlertDescription } from '~/components/ui/alert'
import {
  EmailFormField,
  PasswordFormField,
  SignInSubmitFormField,
} from '~/feature/auth/components/AuthFormInputs'
import { useSignInForm } from '~/feature/auth/hooks/useSignInForm'

import type { AuthActionResult } from '~/feature/auth/types/type'

const SignInFormAlerts = ({ submitError }: { submitError?: string | null }) => {
  if (!submitError) {
    return null
  }

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertDescription>{submitError}</AlertDescription>
    </Alert>
  )
}

export const SignInForm = () => {
  const fetcher = useFetcher<AuthActionResult>()
  const form = useSignInForm(fetcher.data)
  const submitError = useStore(form.store, (formState) =>
    typeof formState.errorMap.onSubmit === 'string'
      ? formState.errorMap.onSubmit
      : null,
  )

  return (
    <div className="mx-auto w-full max-w-md">
      <SignInFormAlerts submitError={submitError} />
      <fetcher.Form method="post" action="/signin" className="space-y-6">
        <EmailFormField form={form} />
        <PasswordFormField form={form} />
        <SignInSubmitFormField form={form} />
      </fetcher.Form>
    </div>
  )
}
