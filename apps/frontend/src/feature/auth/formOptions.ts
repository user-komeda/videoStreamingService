import { formOptions } from '@tanstack/react-form'
import { z } from 'zod'

export const signInSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードを入力してください'),
})

export const signUpSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(6, 'パスワードは6文字以上で入力してください'),
})

export type SignInFormData = z.infer<typeof signInSchema>
export type SignUpFormData = z.infer<typeof signUpSchema>

export const signInFormOpts = formOptions({
  defaultValues: {
    email: '',
    password: '',
  },
  validators: {
    onChange: signInSchema,
  },
})

export const signUpFormOpts = formOptions({
  defaultValues: {
    email: '',
    password: '',
  },
  validators: {
    onChange: signUpSchema,
  },
})
