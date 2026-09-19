import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useVideoFullscreen } from '~/feature/video/hooks/useVideoFullscreen'

describe('useVideoFullscreen', () => {
  it('requests and exits fullscreen', async () => {
    const requestFullscreenMock = vi.fn().mockResolvedValue(undefined)
    const exitFullscreenMock = vi.fn().mockResolvedValue(undefined)
    const divEl = document.createElement('div')
    divEl.requestFullscreen = requestFullscreenMock
    document.exitFullscreen = exitFullscreenMock

    const containerRef = { current: divEl }
    const { result } = renderHook(() => useVideoFullscreen(containerRef))

    expect(result.current.isFullscreen).toBe(false)

    // Request fullscreen
    await act(async () => {
      await result.current.toggleFullscreen()
    })

    expect(requestFullscreenMock).toHaveBeenCalled()
    expect(result.current.isFullscreen).toBe(true)

    // Simulate fullscreen active
    Object.defineProperty(document, 'fullscreenElement', {
      value: divEl,
      configurable: true,
    })

    await act(async () => {
      await result.current.toggleFullscreen()
    })

    expect(exitFullscreenMock).toHaveBeenCalled()
    expect(result.current.isFullscreen).toBe(false)

    Object.defineProperty(document, 'fullscreenElement', {
      value: null,
      configurable: true,
    })
  })

  it('does nothing when containerRef.current is null', async () => {
    const containerRef = { current: null }
    const { result } = renderHook(() => useVideoFullscreen(containerRef))

    await act(async () => {
      await result.current.toggleFullscreen()
    })

    expect(result.current.isFullscreen).toBe(false)
  })
})
