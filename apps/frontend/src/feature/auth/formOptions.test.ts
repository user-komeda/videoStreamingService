import { describe, expect, it } from 'vitest'

import {
  signInFormOpts,
  signInSchema,
  signUpFormOpts,
  signUpSchema,
} from '~/feature/auth/formOptions'

describe('auth formOptions and schemas', () => {
  describe('signInSchema', () => {
    it('validates correct email and password', () => {
      const result = signInSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
      })
      expect(result.success).toBe(true)
    })

    it('fails when email is invalid', () => {
      const result = signInSchema.safeParse({
        email: 'invalid-email',
        password: 'password123',
      })
      expect(result.success).toBe(false)
    })

    it('fails when password is empty', () => {
      const result = signInSchema.safeParse({
        email: 'test@example.com',
        password: '',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('signUpSchema', () => {
    it('validates correct email and password with length >= 6', () => {
      const result = signUpSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
      })
      expect(result.success).toBe(true)
    })

    it('fails when password is less than 6 characters', () => {
      const result = signUpSchema.safeParse({
        email: 'test@example.com',
        password: '12345',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('formOpts defaultValues', () => {
    it('has empty default values for signInFormOpts', () => {
      expect(signInFormOpts.defaultValues).toEqual({
        email: '',
        password: '',
      })
    })

    it('has empty default values for signUpFormOpts', () => {
      expect(signUpFormOpts.defaultValues).toEqual({
        email: '',
        password: '',
      })
    })
  })
})
