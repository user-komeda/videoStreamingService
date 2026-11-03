import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import {
  FullscreenButtons,
  PlaybackButton,
  VolumeControl,
} from '~/feature/video/components/player/VideoPlayerActionRow'

describe('VideoPlayerActionRow components', () => {
  describe('PlaybackButton', () => {
    it('renders pause icon when isPlaying is true and triggers onTogglePlay', async () => {
      const user = userEvent.setup()
      const onTogglePlay = vi.fn()
      const { rerender } = render(
        <PlaybackButton isPlaying={true} onTogglePlay={onTogglePlay} />,
      )

      const button = screen.getByLabelText('一時停止')
      await user.click(button)
      expect(onTogglePlay).toHaveBeenCalledTimes(1)

      rerender(<PlaybackButton isPlaying={false} onTogglePlay={onTogglePlay} />)
      expect(screen.getByLabelText('再生')).toBeDefined()
    })
  })

  describe('VolumeControl', () => {
    it('renders mute/unmute and volume slider', async () => {
      const user = userEvent.setup()
      const onToggleMute = vi.fn()
      const onVolumeChange = vi.fn()

      const { rerender } = render(
        <VolumeControl
          isMuted={false}
          volume={0.7}
          onToggleMute={onToggleMute}
          onVolumeChange={onVolumeChange}
        />,
      )

      const muteBtn = screen.getByLabelText('ミュート')
      await user.click(muteBtn)
      expect(onToggleMute).toHaveBeenCalledTimes(1)

      const slider = screen.getByLabelText('音量')
      // eslint-disable-next-line testing-library/prefer-user-event
      fireEvent.change(slider, { target: { value: '0.3' } })
      expect(onVolumeChange).toHaveBeenCalled()

      rerender(
        <VolumeControl
          isMuted={true}
          volume={0}
          onToggleMute={onToggleMute}
          onVolumeChange={onVolumeChange}
        />,
      )
      expect(screen.getByLabelText('ミュート解除')).toBeDefined()
    })
  })

  describe('FullscreenButtons', () => {
    it('renders restart and fullscreen toggle buttons', async () => {
      const user = userEvent.setup()
      const onRestart = vi.fn()
      const onToggleFullscreen = vi.fn()

      const { rerender } = render(
        <FullscreenButtons
          isFullscreen={false}
          onRestart={onRestart}
          onToggleFullscreen={onToggleFullscreen}
        />,
      )

      const restartBtn = screen.getByLabelText('最初から再生')
      await user.click(restartBtn)
      expect(onRestart).toHaveBeenCalledTimes(1)

      const fullscreenBtn = screen.getByLabelText('全画面')
      await user.click(fullscreenBtn)
      expect(onToggleFullscreen).toHaveBeenCalledTimes(1)

      rerender(
        <FullscreenButtons
          isFullscreen={true}
          onRestart={onRestart}
          onToggleFullscreen={onToggleFullscreen}
        />,
      )
      expect(screen.getByLabelText('全画面解除')).toBeDefined()
    })
  })
})
