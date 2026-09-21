import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { HeaderLeft } from '~/components/header/headerLeft'

describe('HeaderLeft', () => {
  it('renders logo and triggers sidebar toggle', () => {
    const onToggleSidebar = vi.fn()
    render(<HeaderLeft onToggleSidebar={onToggleSidebar} />)

    expect(screen.getByText('StreamHub')).toBeDefined()

    const menuButton = screen.getByLabelText('メニュー')
    fireEvent.click(menuButton)

    expect(onToggleSidebar).toHaveBeenCalledTimes(1)
  })
})
