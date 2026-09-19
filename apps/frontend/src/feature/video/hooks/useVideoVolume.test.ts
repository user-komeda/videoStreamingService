import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useVideoVolume } from '~/feature/video/hooks/useVideoVolume'

describe('useVideoVolume', () => {
  it('manages volume and mute states', () => {
    const videoEl = document.createElement('video')
    const videoRef = { current: videoEl }

    const { result } = renderHook(() => useVideoVolume(videoRef))

    expect(result.current.volume).toBe(1)
    expect(result.current.isMuted).toBe(false)

    // Toggle mute
    act(() => {
      result.current.toggleMute()
    })
    expect(result.current.isMuted).toBe(true)
    expect(videoEl.muted).toBe(true)

    act(() => {
      result.current.toggleMute()
    })
    expect(result.current.isMuted).toBe(false)
    expect(videoEl.muted).toBe(false)

    // Volume change
    act(() => {
      result.current.handleVolumeChange({
        target: { value: '0.5' },
      } as React.ChangeEvent<HTMLInputElement>)
    })
    expect(result.current.volume).toBe(0.5)
    expect(videoEl.volume).toBe(0.5)
    expect(result.current.isMuted).toBe(false)

    // Volume change to 0 sets isMuted to true
    act(() => {
      result.current.handleVolumeChange({
        target: { value: '0' },
      } as React.ChangeEvent<HTMLInputElement>)
    })
    expect(result.current.volume).toBe(0)
    expect(videoEl.volume).toBe(0)
    expect(result.current.isMuted).toBe(true)
  })

  it('handles null videoRef safely', () => {
    const videoRef = { current: null }
    const { result } = renderHook(() => useVideoVolume(videoRef))

    act(() => {
      result.current.toggleMute()
    })
    expect(result.current.isMuted).toBe(true)

    act(() => {
      result.current.handleVolumeChange({
        target: { value: '0.8' },
      } as React.ChangeEvent<HTMLInputElement>)
    })
    expect(result.current.volume).toBe(0.8)
  })
})
