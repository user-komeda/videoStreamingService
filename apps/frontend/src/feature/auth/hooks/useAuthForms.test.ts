import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useSignInForm } from '~/feature/auth/hooks/useSignInForm'
import { useSignUpForm } from '~/feature/auth/hooks/useSignUpForm'

describe('auth form hooks', () => {
  describe('useSignInForm', () => {
    it('creates form with default options', () => {
      const { result } = renderHook(() => useSignInForm())

      expect(result.current.state.values.email).toBe('')
      expect(result.current.state.values.password).toBe('')
    })

    it('transforms error map when actionData contains error', () => {
      const { result } = renderHook(() =>
        useSignInForm({
          success: false,
          error: 'Invalid credentials',
        }),
      )

      expect(result.current.state.errorMap.onSubmit).toBe('Invalid credentials')
    })
  })

  describe('useSignUpForm', () => {
    it('creates form with default options', () => {
      const { result } = renderHook(() => useSignUpForm())

      expect(result.current.state.values.email).toBe('')
      expect(result.current.state.values.password).toBe('')
    })

    it('transforms error map when actionData contains error', () => {
      const { result } = renderHook(() =>
        useSignUpForm({
          success: false,
          error: 'User already exists',
        }),
      )

      expect(result.current.state.errorMap.onSubmit).toBe('User already exists')
    })
  })
})
