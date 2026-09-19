import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Sidebar } from '~/components/sidebar/Sidebar'

describe('Sidebar', () => {
  it('renders collapsed sidebar when isExpanded is false', () => {
    render(
      <Sidebar isExpanded={false} isLoggedIn={false} onToggleLogin={vi.fn()} />,
    )
    expect(screen.getByText('ホーム')).toBeDefined()
    expect(screen.queryByText('探索')).toBeNull()
  })

  it('renders expanded sidebar when isExpanded is true', () => {
    render(
      <Sidebar isExpanded={true} isLoggedIn={false} onToggleLogin={vi.fn()} />,
    )
    expect(screen.getByText('探索')).toBeDefined()
  })
})
