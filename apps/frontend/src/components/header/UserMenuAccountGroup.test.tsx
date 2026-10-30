import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { AccountGroup } from '~/components/header/UserMenuAccountGroup'

describe('AccountGroup', () => {
  it('renders account items and handles logout click', async () => {
    const user = userEvent.setup()
    const onLogout = vi.fn()
    const onClose = vi.fn()

    render(<AccountGroup onLogout={onLogout} onClose={onClose} />)

    expect(screen.getByText('Google アカウント')).toBeDefined()
    expect(screen.getByText('アカウントを切り替える')).toBeDefined()

    const logoutBtn = screen.getByText('ログアウト')
    await user.click(logoutBtn)

    expect(onLogout).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
