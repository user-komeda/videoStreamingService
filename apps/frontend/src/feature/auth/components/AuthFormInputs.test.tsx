import React from 'react'

import { render, renderHook, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  EmailFormField,
  SignInPasswordFormField,
  SignUpPasswordFormField,
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
        <SignInPasswordFormField form={form} />
      </form>,
    )

    expect(screen.getByPlaceholderText('example@example.com')).toBeDefined()
    expect(screen.getByPlaceholderText('••••••••')).toBeDefined()
  })

  it('renders all form field inputs for SignUp correctly', () => {
    const { result } = renderHook(() => useSignUpForm())
    const form = result.current

    render(
      <form>
        <EmailFormField form={form} />
        <SignUpPasswordFormField form={form} />
      </form>,
    )

    expect(screen.getByPlaceholderText('example@example.com')).toBeDefined()
    expect(screen.getByPlaceholderText('••••••••')).toBeDefined()
  })

  it('executes field validators for Email, SignInPassword, and SignUpPassword', () => {
    type ValidatorFn = (args: { value: string }) => string | undefined

    const capturedValidators: Record<string, ValidatorFn> = {}

    const mockForm = {
      Field: ({
        children,
        name,
        validators,
      }: {
        children: (field: unknown) => React.ReactNode
        name: string
        validators?: { onChange: ValidatorFn }
      }) => {
        if (validators?.onChange) {
          capturedValidators[name] = validators.onChange
        }
        return children({
          name,
          state: {
            value: '',
            meta: { isTouched: false, errors: [], isValidating: false },
          },
          handleBlur: () => {},
          handleChange: () => {},
        })
      },
    } as unknown as Parameters<typeof EmailFormField>[0]['form']

    render(
      <form>
        <EmailFormField form={mockForm} />
        <SignInPasswordFormField
          form={
            mockForm as Parameters<typeof SignInPasswordFormField>[0]['form']
          }
        />
        <SignUpPasswordFormField
          form={
            mockForm as Parameters<typeof SignUpPasswordFormField>[0]['form']
          }
        />
      </form>,
    )

    // Email validator
    expect(
      capturedValidators.email({ value: 'valid@example.com' }),
    ).toBeUndefined()
    expect(
      capturedValidators.email({ value: 123 as unknown as string }),
    ).toBeDefined()

    // SignInPassword validator (render individually to avoid key collision)
    const mockSignInForm = {
      Field: ({
        children,
        name,
        validators,
      }: {
        children: (field: unknown) => React.ReactNode
        name: string
        validators?: { onChange: ValidatorFn }
      }) => {
        if (validators?.onChange) {
          capturedValidators.signinPassword = validators.onChange
        }
        return children({
          name,
          state: {
            value: '',
            meta: { isTouched: false, errors: [], isValidating: false },
          },
          handleBlur: () => {},
          handleChange: () => {},
        })
      },
    } as unknown as Parameters<typeof SignInPasswordFormField>[0]['form']

    render(
      <form>
        <SignInPasswordFormField form={mockSignInForm} />
      </form>,
    )

    expect(
      capturedValidators.signinPassword({ value: 'password123' }),
    ).toBeUndefined()
    expect(
      capturedValidators.signinPassword({ value: 123 as unknown as string }),
    ).toBeDefined()

    // SignUpPassword validator (rerender to capture signup password validator)
    const mockSignUpForm = {
      Field: ({
        children,
        name,
        validators,
      }: {
        children: (field: unknown) => React.ReactNode
        name: string
        validators?: { onChange: ValidatorFn }
      }) => {
        if (validators?.onChange) {
          capturedValidators.signupPassword = validators.onChange
        }
        return children({
          name,
          state: {
            value: '',
            meta: { isTouched: false, errors: [], isValidating: false },
          },
          handleBlur: () => {},
          handleChange: () => {},
        })
      },
    } as unknown as Parameters<typeof SignUpPasswordFormField>[0]['form']

    render(
      <form>
        <SignUpPasswordFormField form={mockSignUpForm} />
      </form>,
    )

    expect(
      capturedValidators.signupPassword({ value: 'valid-password' }),
    ).toBeUndefined()
    expect(capturedValidators.signupPassword({ value: '123' })).toBeDefined()
  })
})
