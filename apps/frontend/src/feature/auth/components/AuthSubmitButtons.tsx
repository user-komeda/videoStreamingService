import { Button } from '~/components/ui/button'

import type { SignInFormInstance } from '~/feature/auth/hooks/useSignInForm'
import type { SignUpFormInstance } from '~/feature/auth/hooks/useSignUpForm'

export const SignInSubmitFormField = ({
  form,
}: {
  form: SignInFormInstance
}) => (
  <form.Subscribe>
    {(state) => (
      <Button
        type="submit"
        disabled={!state.canSubmit || Boolean(state.isSubmitting)}
        className="w-full"
      >
        {state.isSubmitting ? 'ログイン中...' : 'ログイン'}
      </Button>
    )}
  </form.Subscribe>
)

export const SignUpSubmitFormField = ({
  form,
}: {
  form: SignUpFormInstance
}) => (
  <form.Subscribe>
    {(state) => (
      <Button
        type="submit"
        disabled={!state.canSubmit || Boolean(state.isSubmitting)}
        className="w-full"
      >
        {state.isSubmitting ? '登録中...' : 'アカウント作成'}
      </Button>
    )}
  </form.Subscribe>
)
