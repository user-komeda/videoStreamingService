import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { VideoPlayerControls } from '~/feature/video/components/player/VideoPlayerControls'

import type { useVideoControls } from '~/feature/video/hooks/useVideoControls'

describe('VideoPlayerControls', () => {
  const createMockControls = (overrides = {}) =>
    ({
      isPlaying: false,
      currentTime: 65,
      duration: 125,
      volume: 0.8,
      isMuted: false,
      isFullscreen: false,
      togglePlay: vi.fn(),
      handleSeek: vi.fn(),
      handleLoadedMetadata: vi.fn(),
      handleTimeUpdate: vi.fn(),
      toggleMute: vi.fn(),
      handleVolumeChange: vi.fn(),
      toggleFullscreen: vi.fn(),
      restartVideo: vi.fn(),
      ...overrides,
    }) as unknown as ReturnType<typeof useVideoControls>

  it('renders time format and handles seek and control clicks', async () => {
    const user = userEvent.setup()
    const controls = createMockControls()

    const { rerender } = render(
      <VideoPlayerControls showControls={true} controls={controls} />,
    )

    expect(screen.getByText('1:05')).toBeDefined()
    expect(screen.getByText('2:05')).toBeDefined()
    expect(screen.getByText('4K 60fps')).toBeDefined()

    const seekSlider = screen.getByLabelText('再生位置')
    // eslint-disable-next-line testing-library/prefer-user-event
    fireEvent.change(seekSlider, { target: { value: '30' } })
    expect(controls.handleSeek).toHaveBeenCalled()

    const playBtn = screen.getByLabelText('再生')
    await user.click(playBtn)
    expect(controls.togglePlay).toHaveBeenCalled()

    const fullscreenBtn = screen.getByLabelText('全画面')
    await user.click(fullscreenBtn)
    expect(controls.toggleFullscreen).toHaveBeenCalled()

    // Test with NaN time and hidden controls and secs >= 10
    const nanControls = createMockControls({
      currentTime: 75,
      duration: 75,
    })
    rerender(
      <VideoPlayerControls showControls={false} controls={nanControls} />,
    )
    expect(screen.getAllByText('1:15').length).toBeGreaterThanOrEqual(1)

    const zeroControls = createMockControls({
      currentTime: NaN,
      duration: NaN,
    })
    rerender(
      <VideoPlayerControls showControls={false} controls={zeroControls} />,
    )
    expect(screen.getAllByText('0:00').length).toBeGreaterThanOrEqual(1)
  })
})
