import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useAutoHideControls } from '~/feature/video/hooks/useAutoHideControls'

describe('useAutoHideControls', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('handles mouse movements and auto hides when playing', () => {
    const el = document.createElement('div')
    const containerRef = { current: el }

    const { result, rerender, unmount } = renderHook(
      ({ isPlaying }) => useAutoHideControls(isPlaying, containerRef, 1000),
      { initialProps: { isPlaying: true } },
    )

    expect(result.current.showControls).toBe(true)

    // Trigger mousemove
    act(() => {
      el.dispatchEvent(new MouseEvent('mousemove'))
    })
    expect(result.current.showControls).toBe(true)

    // Fast forward timer by 1000ms
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current.showControls).toBe(false)

    // Trigger mousemove while playing
    act(() => {
      el.dispatchEvent(new MouseEvent('mousemove'))
    })
    expect(result.current.showControls).toBe(true)

    // Trigger mouseleave while playing
    act(() => {
      el.dispatchEvent(new MouseEvent('mouseleave'))
    })
    expect(result.current.showControls).toBe(false)

    // When not playing, timer expiring and mouseleave do not hide controls
    rerender({ isPlaying: false })
    act(() => {
      el.dispatchEvent(new MouseEvent('mousemove'))
    })
    expect(result.current.showControls).toBe(true)

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current.showControls).toBe(true)

    act(() => {
      el.dispatchEvent(new MouseEvent('mouseleave'))
    })
    expect(result.current.showControls).toBe(true)

    // Unmount clears timeout
    rerender({ isPlaying: true })
    act(() => {
      el.dispatchEvent(new MouseEvent('mousemove'))
    })
    unmount()
  })

  it('handles default delay and null container safely', () => {
    const el = document.createElement('div')
    const containerRef = { current: el }
    const { result } = renderHook(() => useAutoHideControls(true, containerRef))
    expect(result.current.showControls).toBe(true)

    const nullContainerRef = { current: null }
    const { result: nullResult } = renderHook(() =>
      useAutoHideControls(true, nullContainerRef, 1000),
    )
    expect(nullResult.current.showControls).toBe(true)
  })
})
