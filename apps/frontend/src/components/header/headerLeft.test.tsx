import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { HeaderLeft } from '~/components/header/headerLeft'

describe('HeaderLeft', () => {
  it('renders logo and triggers sidebar toggle', async () => {
    const user = userEvent.setup()
    const onToggleSidebar = vi.fn()
    render(<HeaderLeft onToggleSidebar={onToggleSidebar} />)

    expect(screen.getByText('StreamHub')).toBeDefined()

    const menuButton = screen.getByLabelText('メニュー')
    await user.click(menuButton)

    expect(onToggleSidebar).toHaveBeenCalledTimes(1)
  })
})
