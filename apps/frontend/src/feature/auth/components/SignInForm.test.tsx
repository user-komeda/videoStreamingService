import React from 'react'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SignInForm } from '~/feature/auth/components/SignInForm'

let mockFetcherData: unknown = null

vi.mock('react-router', () => ({
  useFetcher: () => ({
    data: mockFetcherData,
    Form: ({ children, ...props }: React.ComponentProps<'form'>) =>
      React.createElement('form', props, children),
  }),
}))

describe('SignInForm', () => {
  it('renders form inputs and handles submit error', () => {
    mockFetcherData = null
    const { rerender } = render(<SignInForm />)

    expect(screen.getByPlaceholderText('example@example.com')).toBeDefined()
    expect(screen.getByPlaceholderText('••••••••')).toBeDefined()

    mockFetcherData = {
      success: false,
      error: 'Invalid email or password',
    }

    rerender(<SignInForm />)
    expect(screen.getByText('Invalid email or password')).toBeDefined()
  })
})
