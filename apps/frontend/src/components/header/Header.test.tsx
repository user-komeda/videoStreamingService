import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Header } from '~/components/header/Header'

describe('Header', () => {
  it('renders header elements and children', () => {
    const onToggleLogin = vi.fn()
    const onToggleSidebar = vi.fn()

    render(
      <MemoryRouter>
        <Header
          isLoggedIn={true}
          onToggleLogin={onToggleLogin}
          onToggleSidebar={onToggleSidebar}
        />
      </MemoryRouter>,
    )

    expect(screen.getByLabelText('メニュー')).toBeDefined()
    expect(screen.getByText('StreamHub')).toBeDefined()
    expect(screen.getByPlaceholderText('検索')).toBeDefined()
    expect(screen.getByLabelText('ユーザーメニュー')).toBeDefined()
  })
})
