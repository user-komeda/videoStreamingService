import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useVideoControls } from '~/feature/video/hooks/useVideoControls'

describe('useVideoControls', () => {
  it('controls playback, seeking and metadata', async () => {
    const playMock = vi.fn().mockResolvedValue(undefined)
    const pauseMock = vi.fn()
    const videoEl = document.createElement('video')
    videoEl.play = playMock
    videoEl.pause = pauseMock
    Object.defineProperty(videoEl, 'paused', {
      value: true,
      writable: true,
    })

    const videoRef = { current: videoEl }
    const containerRef = { current: document.createElement('div') }

    const { result } = renderHook(() =>
      useVideoControls(videoRef, containerRef),
    )

    expect(result.current.isPlaying).toBe(false)

    // Play
    await act(async () => {
      await Promise.resolve(result.current.togglePlay())
    })
    expect(playMock).toHaveBeenCalled()
    expect(result.current.isPlaying).toBe(true)

    // Pause
    Object.defineProperty(videoEl, 'paused', {
      value: false,
      writable: true,
    })
    act(() => {
      result.current.togglePlay()
    })
    expect(pauseMock).toHaveBeenCalled()
    expect(result.current.isPlaying).toBe(false)

    // Time update
    videoEl.currentTime = 45
    act(() => {
      result.current.handleTimeUpdate()
    })
    expect(result.current.currentTime).toBe(45)

    // Loaded metadata
    Object.defineProperty(videoEl, 'duration', {
      value: 120,
      writable: true,
    })
    act(() => {
      result.current.handleLoadedMetadata()
    })
    expect(result.current.duration).toBe(120)

    // Seek
    act(() => {
      result.current.handleSeek({
        target: { value: '60' },
      } as React.ChangeEvent<HTMLInputElement>)
    })
    expect(videoEl.currentTime).toBe(60)
    expect(result.current.currentTime).toBe(60)

    // Restart
    act(() => {
      result.current.restartVideo()
    })
    expect(videoEl.currentTime).toBe(0)
  })

  it('handles null videoRef gracefully', () => {
    const videoRef = { current: null }
    const containerRef = { current: null }

    const { result } = renderHook(() =>
      useVideoControls(videoRef, containerRef),
    )

    act(() => {
      result.current.togglePlay()
      result.current.handleTimeUpdate()
      result.current.handleLoadedMetadata()
      result.current.restartVideo()
    })

    expect(result.current.isPlaying).toBe(false)
    expect(result.current.currentTime).toBe(0)
  })

  it('handles play rejection by keeping isPlaying false', async () => {
    const playMock = vi.fn().mockRejectedValue(new Error('Playback rejected'))
    const videoEl = document.createElement('video')
    videoEl.play = playMock
    Object.defineProperty(videoEl, 'paused', {
      value: true,
      writable: true,
    })

    const videoRef = { current: videoEl }
    const containerRef = { current: document.createElement('div') }

    const { result } = renderHook(() =>
      useVideoControls(videoRef, containerRef),
    )

    await act(async () => {
      await Promise.resolve(result.current.togglePlay())
    })

    expect(playMock).toHaveBeenCalled()
    expect(result.current.isPlaying).toBe(false)
  })
})
