import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AccountGroup } from '~/components/header/UserMenuAccountGroup'

describe('AccountGroup', () => {
  it('renders account items and handles logout click', () => {
    const onLogout = vi.fn()
    const onClose = vi.fn()

    render(<AccountGroup onLogout={onLogout} onClose={onClose} />)

    expect(screen.getByText('Google アカウント')).toBeDefined()
    expect(screen.getByText('アカウントを切り替える')).toBeDefined()

    const logoutBtn = screen.getByText('ログアウト')
    fireEvent.click(logoutBtn)

    expect(onLogout).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
