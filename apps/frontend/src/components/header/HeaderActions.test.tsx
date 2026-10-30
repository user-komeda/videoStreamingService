import type React from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { HeaderActions } from '~/components/header/HeaderActions'

describe('HeaderActions', () => {
  it('renders login button when not logged in and toggles login', async () => {
    const user = userEvent.setup()
    const onToggleLogin = vi.fn()
    const setIsMenuOpen =
      vi.fn<(action: React.SetStateAction<boolean>) => void>()

    render(
      <HeaderActions
        isLoggedIn={false}
        isMenuOpen={false}
        setIsMenuOpen={setIsMenuOpen}
        onToggleLogin={onToggleLogin}
      />,
    )

    const loginBtn = screen.getByText('ログイン (切替)')
    await user.click(loginBtn)
    expect(onToggleLogin).toHaveBeenCalledTimes(1)
  })

  it('renders logged in actions, opens user menu, and handles logout', async () => {
    const user = userEvent.setup()
    const onToggleLogin = vi.fn()
    const setIsMenuOpen =
      vi.fn<(action: React.SetStateAction<boolean>) => void>()

    const { rerender } = render(
      <HeaderActions
        isLoggedIn={true}
        isMenuOpen={false}
        setIsMenuOpen={setIsMenuOpen}
        onToggleLogin={onToggleLogin}
      />,
    )

    expect(screen.getByLabelText('作成')).toBeDefined()
    expect(screen.getByLabelText('通知')).toBeDefined()

    const avatarBtn = screen.getByLabelText('ユーザーメニュー')
    await user.click(avatarBtn)
    expect(setIsMenuOpen).toHaveBeenCalled()

    const updater = setIsMenuOpen.mock.calls[0]?.[0]
    expect(typeof updater === 'function' ? updater(false) : updater).toBe(true)

    // Rerender with menu open
    rerender(
      <HeaderActions
        isLoggedIn={true}
        isMenuOpen={true}
        setIsMenuOpen={setIsMenuOpen}
        onToggleLogin={onToggleLogin}
      />,
    )

    const logoutBtn = screen.getByText('ログアウト')
    await user.click(logoutBtn)

    expect(setIsMenuOpen).toHaveBeenCalledWith(false)
    expect(onToggleLogin).toHaveBeenCalled()
  })
})
