import React from 'react'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SignUpCard } from '~/feature/auth/components/SignUpCard'

vi.mock('react-router', () => ({
  Link: ({
    children,
    to,
    ...props
  }: {
    children: React.ReactNode
    to: string
  } & React.ComponentProps<'a'>) =>
    React.createElement('a', { href: to, ...props }, children),
}))

vi.mock('~/feature/auth/components/SignUpForm', () => ({
  SignUpForm: () => <div>SignUpFormMock</div>,
}))

describe('SignUpCard', () => {
  it('renders heading, description, form and signin link', () => {
    render(<SignUpCard />)

    expect(screen.getByText('アカウント作成')).toBeDefined()
    expect(screen.getByText('新規アカウントを作成してください')).toBeDefined()
    expect(screen.getByText('SignUpFormMock')).toBeDefined()
    expect(
      screen.getByRole('link', { name: 'サインイン' }).getAttribute('href'),
    ).toBe('/signin')
  })
})
