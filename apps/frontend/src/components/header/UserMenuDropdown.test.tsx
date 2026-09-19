import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { UserMenuDropdown } from '~/components/header/UserMenuDropdown'

describe('UserMenuDropdown', () => {
  it('returns null when isOpen is false', () => {
    const { container } = render(
      <UserMenuDropdown isOpen={false} onClose={vi.fn()} onLogout={vi.fn()} />,
    )
    expect(container.innerHTML).toBe('')
  })

  it('renders menu and handles closing via backdrop and escape key', () => {
    const onClose = vi.fn()
    const onLogout = vi.fn()

    render(
      <UserMenuDropdown isOpen={true} onClose={onClose} onLogout={onLogout} />,
    )

    expect(screen.getByText('チャンネルを表示')).toBeDefined()
    expect(screen.getByText('Google アカウント')).toBeDefined()

    const backdrop = screen.getByLabelText('メニューを閉じる')
    fireEvent.click(backdrop)
    expect(onClose).toHaveBeenCalledTimes(1)

    fireEvent.keyDown(backdrop, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(2)

    fireEvent.keyDown(backdrop, { key: 'Enter' })
    expect(onClose).toHaveBeenCalledTimes(2)
  })
})
