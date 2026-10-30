import React from 'react'

import { render, renderHook, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import {
  EmailFormField,
  PasswordFormField,
  SignInSubmitFormField,
  SignUpSubmitFormField,
} from '~/feature/auth/components/AuthFormInputs'
import { useSignInForm } from '~/feature/auth/hooks/useSignInForm'
import { useSignUpForm } from '~/feature/auth/hooks/useSignUpForm'

describe('AuthFormInputs', () => {
  it('renders all form field inputs for SignIn correctly', () => {
    const { result } = renderHook(() => useSignInForm())
    const form = result.current

    render(
      <form>
        <EmailFormField form={form} />
        <PasswordFormField form={form} />
        <SignInSubmitFormField form={form} />
      </form>,
    )

    expect(screen.getByPlaceholderText('example@example.com')).toBeDefined()
    expect(screen.getByPlaceholderText('••••••••')).toBeDefined()
    expect(screen.getByRole('button', { name: 'サインイン' })).toBeDefined()
  })

  it('renders all form field inputs for SignUp correctly', () => {
    const { result } = renderHook(() => useSignUpForm())
    const form = result.current

    render(
      <form>
        <EmailFormField form={form} />
        <PasswordFormField form={form} />
        <SignUpSubmitFormField form={form} />
      </form>,
    )

    expect(screen.getByPlaceholderText('example@example.com')).toBeDefined()
    expect(screen.getByPlaceholderText('••••••••')).toBeDefined()
    expect(screen.getByRole('button', { name: 'アカウント作成' })).toBeDefined()
  })

  it('renders submitting label for SignIn and SignUp forms', () => {
    const mockSignInForm = {
      Field: ({
        children,
        name,
      }: {
        children: (field: unknown) => React.ReactNode
        name: string
      }) =>
        children({
          name,
          state: {
            value: '',
            meta: { isTouched: true, errors: [], isValidating: false },
          },
          handleBlur: vi.fn(),
          handleChange: vi.fn(),
        }),
      Subscribe: ({
        children,
      }: {
        children: (val: [boolean, boolean, string, string]) => React.ReactNode
      }) => children([true, true, 'test@example.com', 'password123']),
    } as unknown as Parameters<typeof SignInSubmitFormField>[0]['form']

    const mockSignUpForm = {
      Subscribe: ({
        children,
      }: {
        children: (val: [boolean, boolean, string, string]) => React.ReactNode
      }) => children([true, true, 'test@example.com', 'password123']),
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

  it('renders disabled submit button when values are whitespace or cannot submit', () => {
    const cases = [
      [true, false, '   ', 'valid-password'],
      [true, false, 'valid@example.com', '   '],
      [false, false, 'valid@example.com', 'valid-password'],
      [true, true, 'valid@example.com', 'valid-password'],
    ] as const

    for (const [canSubmit, isSubmitting, email, password] of cases) {
      const mockSignInForm = {
        Subscribe: ({
          children,
        }: {
          children: (val: [boolean, boolean, string, string]) => React.ReactNode
        }) => children([canSubmit, isSubmitting, email, password]),
      } as unknown as Parameters<typeof SignInSubmitFormField>[0]['form']

      const mockSignUpForm = {
        Subscribe: ({
          children,
        }: {
          children: (val: [boolean, boolean, string, string]) => React.ReactNode
        }) => children([canSubmit, isSubmitting, email, password]),
      } as unknown as Parameters<typeof SignUpSubmitFormField>[0]['form']

      const { unmount } = render(
        <form>
          <SignInSubmitFormField form={mockSignInForm} />
          <SignUpSubmitFormField form={mockSignUpForm} />
        </form>,
      )

      const signInBtn = screen.getByRole('button', {
        name: isSubmitting ? 'ログイン中...' : 'サインイン',
      })
      const signUpBtn = screen.getByRole('button', {
        name: isSubmitting ? '登録中...' : 'アカウント作成',
      })
      expect(signInBtn.getAttribute('disabled')).toBeDefined()
      expect(signUpBtn.getAttribute('disabled')).toBeDefined()

      unmount()
    }
  })
})
