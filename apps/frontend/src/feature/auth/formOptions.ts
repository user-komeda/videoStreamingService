import { formOptions } from '@tanstack/react-form'

import { PostAuthSigninBody, PostAuthSignupBody } from '~/api/generated/zod'

import type { z } from 'zod'

export const signInSchema = PostAuthSigninBody
export const signUpSchema = PostAuthSignupBody

export type SignInFormData = z.infer<typeof signInSchema>
export type SignUpFormData = z.infer<typeof signUpSchema>

export const signInFormOpts = formOptions({
  defaultValues: {
    email: '',
    password: '',
  },
})

export const signUpFormOpts = formOptions({
  defaultValues: {
    email: '',
    password: '',
  },
})
