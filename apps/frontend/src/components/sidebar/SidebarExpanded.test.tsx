import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SidebarExpanded } from '~/components/sidebar/SidebarExpanded'

describe('SidebarExpanded', () => {
  it('renders navigation and sections when logged in', () => {
    render(<SidebarExpanded isLoggedIn={true} onToggleLogin={vi.fn()} />)

    expect(screen.getByText('ホーム')).toBeDefined()
    expect(screen.getByText('Shorts')).toBeDefined()
    expect(screen.getAllByText('登録チャンネル').length).toBeGreaterThanOrEqual(
      1,
    )
    expect(screen.getByText('探索')).toBeDefined()
    expect(screen.getByText('急上昇')).toBeDefined()
    expect(screen.getByText('設定')).toBeDefined()
    expect(screen.getByText('ヘルプ')).toBeDefined()
    expect(screen.getByText('報告履歴')).toBeDefined()
    expect(screen.getByText('ライブラリ')).toBeDefined()
  })

  it('renders sections when logged out', () => {
    render(<SidebarExpanded isLoggedIn={false} onToggleLogin={vi.fn()} />)

    expect(screen.getByText('ホーム')).toBeDefined()
    expect(screen.getByText('ログイン')).toBeDefined()
  })
})
