import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { VideoPlayer } from '~/feature/video/components/player/VideoPlayer'

vi.mock('~/feature/video/hooks/useHls', () => ({
  useHls: vi.fn(),
}))

describe('VideoPlayer', () => {
  it('renders video element and controls', async () => {
    const user = userEvent.setup()
    render(<VideoPlayer src="http://localhost:8080/stream.m3u8" />)

    const toggleButton = screen.getByLabelText('動画の再生または一時停止')
    expect(toggleButton).toBeDefined()

    await user.click(toggleButton)
  })
})
