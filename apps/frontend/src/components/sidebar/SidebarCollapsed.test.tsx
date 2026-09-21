import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SidebarCollapsed } from '~/components/sidebar/SidebarCollapsed'

describe('SidebarCollapsed', () => {
  it('renders collapsed navigation buttons', () => {
    render(<SidebarCollapsed />)

    expect(screen.getByText('ホーム')).toBeDefined()
    expect(screen.getByText('Shorts')).toBeDefined()
    expect(screen.getByText('登録チャンネル')).toBeDefined()
    expect(screen.getByText('ライブラリ')).toBeDefined()
  })
})
