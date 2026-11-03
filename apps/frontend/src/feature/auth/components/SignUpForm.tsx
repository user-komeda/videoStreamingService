import { useFetcher } from 'react-router'

import { useStore } from '@tanstack/react-store'

import { Alert, AlertDescription } from '~/components/ui/alert'
import {
  EmailFormField,
  SignUpPasswordFormField,
  SignUpSubmitFormField,
} from '~/feature/auth/components/AuthFormInputs'
import { useSignUpForm } from '~/feature/auth/hooks/useSignUpForm'

import type { AuthActionResult } from '~/feature/auth/types/type'

const SignUpFormAlerts = ({ submitError }: { submitError?: string | null }) => {
  if (!submitError) {
    return null
  }

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertDescription>{submitError}</AlertDescription>
    </Alert>
  )
}

export const SignUpForm = () => {
  const fetcher = useFetcher<AuthActionResult>()
  const form = useSignUpForm(fetcher.data)
  const submitError = useStore(form.store, (formState) =>
    typeof formState.errorMap.onSubmit === 'string'
      ? formState.errorMap.onSubmit
      : null,
  )

  return (
    <div className="mx-auto w-full max-w-md">
      <SignUpFormAlerts submitError={submitError} />
      <fetcher.Form method="post" action="/signup" className="space-y-6">
        <EmailFormField form={form} />
        <SignUpPasswordFormField form={form} />
        <SignUpSubmitFormField form={form} />
      </fetcher.Form>
    </div>
  )
}
