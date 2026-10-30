import React from 'react'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SignInCard } from '~/feature/auth/components/SignInCard'

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

vi.mock('~/feature/auth/components/SignInForm', () => ({
  SignInForm: () => <div>SignInFormMock</div>,
}))

describe('SignInCard', () => {
  it('renders heading, description, form and signup link', () => {
    render(<SignInCard />)

    expect(screen.getByText('サインイン')).toBeDefined()
    expect(screen.getByText('アカウントにログインしてください')).toBeDefined()
    expect(screen.getByText('SignInFormMock')).toBeDefined()
    expect(
      screen.getByRole('link', { name: 'サインアップ' }).getAttribute('href'),
    ).toBe('/signup')
  })
})
