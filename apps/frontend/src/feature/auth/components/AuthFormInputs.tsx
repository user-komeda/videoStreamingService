import {
  EmailField,
  PasswordField,
} from '~/feature/auth/components/AuthFormFields'
import { signInSchema, signUpSchema } from '~/feature/auth/formOptions'

import type { SignInFormInstance } from '~/feature/auth/hooks/useSignInForm'
import type { SignUpFormInstance } from '~/feature/auth/hooks/useSignUpForm'

export {
  SignInSubmitFormField,
  SignUpSubmitFormField,
} from '~/feature/auth/components/AuthSubmitButtons'

export const EmailFormField = ({
  form,
}: {
  form: SignInFormInstance | SignUpFormInstance
}) => (
  <form.Field
    name="email"
    validators={{
      onChange: ({ value }) => {
        const res = signUpSchema.shape.email.safeParse(value)
        return res.success ? undefined : res.error.issues[0]?.message
      },
    }}
  >
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

export const SignInPasswordFormField = ({
  form,
}: {
  form: SignInFormInstance
}) => (
  <form.Field
    name="password"
    validators={{
      onChange: ({ value }) => {
        const res = signInSchema.shape.password.safeParse(value)
        return res.success ? undefined : res.error.issues[0]?.message
      },
    }}
  >
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

export const SignUpPasswordFormField = ({
  form,
}: {
  form: SignUpFormInstance
}) => (
  <form.Field
    name="password"
    validators={{
      onChange: ({ value }) => {
        const res = signUpSchema.shape.password.safeParse(value)
        return res.success ? undefined : res.error.issues[0]?.message
      },
    }}
  >
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
