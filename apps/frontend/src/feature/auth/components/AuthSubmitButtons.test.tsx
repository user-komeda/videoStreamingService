import React from 'react'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  SignInSubmitFormField,
  SignUpSubmitFormField,
} from '~/feature/auth/components/AuthSubmitButtons'

describe('AuthSubmitButtons', () => {
  it('renders submitting label for SignIn and SignUp forms', () => {
    const mockSignInForm = {
      Subscribe: ({
        children,
      }: {
        children: (state: {
          canSubmit: boolean
          isSubmitting: boolean
          values: { email: string; password: string }
        }) => React.ReactNode
      }) =>
        children({
          canSubmit: true,
          isSubmitting: true,
          values: { email: 'test@example.com', password: 'password123' },
        }),
    } as unknown as Parameters<typeof SignInSubmitFormField>[0]['form']

    const mockSignUpForm = {
      Subscribe: ({
        children,
      }: {
        children: (state: {
          canSubmit: boolean
          isSubmitting: boolean
          values: { email: string; password: string }
        }) => React.ReactNode
      }) =>
        children({
          canSubmit: true,
          isSubmitting: true,
          values: { email: 'test@example.com', password: 'password123' },
        }),
    } as unknown as Parameters<typeof SignUpSubmitFormField>[0]['form']

    render(
      <form>
        <SignInSubmitFormField form={mockSignInForm} />
        <SignUpSubmitFormField form={mockSignUpForm} />
      </form>,
    )

    expect(screen.getByRole('button', { name: 'ログイン中...' })).toBeDefined()
    expect(screen.getByRole('button', { name: '登録中...' })).toBeDefined()
  })

  it('renders disabled submit button when values are invalid, submitting, or canSubmit is false', () => {
    const cases = [
      [true, false, 'valid@example.com', 'valid-password'],
      [false, false, 'valid@example.com', 'valid-password'],
      [true, true, 'valid@example.com', 'valid-password'],
      [true, false, '', 'valid-password'],
      [true, false, '   ', 'valid-password'],
      [true, false, 'valid@example.com', ''],
      [true, false, 'valid@example.com', '   '],
    ] as const

    for (const [canSubmit, isSubmitting, email, password] of cases) {
      const mockSignInForm = {
        Subscribe: ({
          children,
        }: {
          children: (state: {
            canSubmit: boolean
            isSubmitting: boolean
            values: { email: string; password: string }
          }) => React.ReactNode
        }) =>
          children({
            canSubmit,
            isSubmitting,
            values: { email, password },
          }),
      } as unknown as Parameters<typeof SignInSubmitFormField>[0]['form']

      const mockSignUpForm = {
        Subscribe: ({
          children,
        }: {
          children: (state: {
            canSubmit: boolean
            isSubmitting: boolean
            values: { email: string; password: string }
          }) => React.ReactNode
        }) =>
          children({
            canSubmit,
            isSubmitting,
            values: { email, password },
          }),
      } as unknown as Parameters<typeof SignUpSubmitFormField>[0]['form']

      const { unmount } = render(
        <form>
          <SignInSubmitFormField form={mockSignInForm} />
          <SignUpSubmitFormField form={mockSignUpForm} />
        </form>,
      )

      const signInBtn = screen.getByRole('button', {
        name: isSubmitting ? 'ログイン中...' : 'ログイン',
      })
      const signUpBtn = screen.getByRole('button', {
        name: isSubmitting ? '登録中...' : 'アカウント作成',
      })

      const isDisabled = !canSubmit || Boolean(isSubmitting)

      expect(signInBtn.hasAttribute('disabled')).toBe(isDisabled)
      expect(signUpBtn.hasAttribute('disabled')).toBe(isDisabled)

      unmount()
    }
  })
})
