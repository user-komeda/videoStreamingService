import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SidebarUserSection } from '~/components/sidebar/SidebarUserSection'

describe('SidebarUserSection', () => {
  it('renders logged in section when isLoggedIn is true', () => {
    render(<SidebarUserSection isLoggedIn={true} onToggleLogin={vi.fn()} />)
    expect(screen.getByText('ライブラリ')).toBeDefined()
    expect(screen.getByText('履歴')).toBeDefined()
    expect(screen.getByText('後で見る')).toBeDefined()
    expect(screen.getByText('高く評価した動画')).toBeDefined()
  })

  it('renders logged out section and handles login click when isLoggedIn is false', () => {
    const onToggleLogin = vi.fn()
    render(
      <SidebarUserSection isLoggedIn={false} onToggleLogin={onToggleLogin} />,
    )
    expect(
      screen.getByText(
        'ログインすると、動画の高評価やチャンネル登録、コメントができるようになります。',
      ),
    ).toBeDefined()

    const loginBtn = screen.getByText('ログイン')
    fireEvent.click(loginBtn)
    expect(onToggleLogin).toHaveBeenCalledTimes(1)
  })
})
