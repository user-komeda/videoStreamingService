import React from 'react'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SignUpForm } from '~/feature/auth/components/SignUpForm'

let mockFetcherData: unknown = null

vi.mock('react-router', () => ({
  useFetcher: () => ({
    data: mockFetcherData,
    Form: ({ children, ...props }: React.ComponentProps<'form'>) =>
      React.createElement('form', props, children),
  }),
}))

describe('SignUpForm', () => {
  it('renders form inputs and handles submit error', () => {
    mockFetcherData = null
    const { rerender } = render(<SignUpForm />)

    expect(screen.getByPlaceholderText('example@example.com')).toBeDefined()
    expect(screen.getByPlaceholderText('••••••••')).toBeDefined()

    mockFetcherData = {
      success: false,
      error: 'User already exists',
    }

    rerender(<SignUpForm />)
    expect(screen.getByText('User already exists')).toBeDefined()
  })
})
