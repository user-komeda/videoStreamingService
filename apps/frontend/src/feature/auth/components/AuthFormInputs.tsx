import { Button } from '~/components/ui/button'
import {
  EmailField,
  PasswordField,
} from '~/feature/auth/components/AuthFormFields'

import type { SignInFormInstance } from '~/feature/auth/hooks/useSignInForm'
import type { SignUpFormInstance } from '~/feature/auth/hooks/useSignUpForm'

export const EmailFormField = ({
  form,
}: {
  form: SignInFormInstance | SignUpFormInstance
}) => (
  <form.Field name="email">
    {(field) => (
      <EmailField
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={field.handleChange}
        isTouched={field.state.meta.isTouched}
        errors={field.state.meta.errors}
        isValidating={field.state.meta.isValidating}
      />
    )}
  </form.Field>
)

export const PasswordFormField = ({
  form,
}: {
  form: SignInFormInstance | SignUpFormInstance
}) => (
  <form.Field name="password">
    {(field) => (
      <PasswordField
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={field.handleChange}
        isTouched={field.state.meta.isTouched}
        errors={field.state.meta.errors}
        isValidating={field.state.meta.isValidating}
      />
    )}
  </form.Field>
)

export const SignInSubmitFormField = ({
  form,
}: {
  form: SignInFormInstance
}) => (
  <form.Subscribe
    selector={(state) =>
      [
        state.canSubmit,
        state.isSubmitting,
        state.values.email,
        state.values.password,
      ] as const
    }
  >
    {([canSubmit, isSubmitting, email, password]) => (
      <Button
        type="submit"
        disabled={
          !canSubmit ||
          Boolean(isSubmitting) ||
          !email?.trim() ||
          !password?.trim()
        }
        className="w-full"
      >
        {isSubmitting ? 'ログイン中...' : 'サインイン'}
      </Button>
    )}
  </form.Subscribe>
)

export const SignUpSubmitFormField = ({
  form,
}: {
  form: SignUpFormInstance
}) => (
  <form.Subscribe
    selector={(state) =>
      [
        state.canSubmit,
        state.isSubmitting,
        state.values.email,
        state.values.password,
      ] as const
    }
  >
    {([canSubmit, isSubmitting, email, password]) => (
      <Button
        type="submit"
        disabled={
          !canSubmit ||
          Boolean(isSubmitting) ||
          !email?.trim() ||
          !password?.trim()
        }
        className="w-full"
      >
        {isSubmitting ? '登録中...' : 'アカウント作成'}
      </Button>
    )}
  </form.Subscribe>
)
