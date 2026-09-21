import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useHls } from '~/feature/video/hooks/useHls'

const { mockLoadSource, mockAttachMedia, mockDestroy, mockIsSupported } =
  vi.hoisted(() => ({
    mockLoadSource: vi.fn(),
    mockAttachMedia: vi.fn(),
    mockDestroy: vi.fn(),
    mockIsSupported: vi.fn(),
  }))

vi.mock('hls.js', () => {
  class HlsMock {
    static isSupported = mockIsSupported
    loadSource = mockLoadSource
    attachMedia = mockAttachMedia
    destroy = mockDestroy
  }

  return {
    default: HlsMock,
    __esModule: true,
  }
})

describe('useHls', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes Hls when supported and src ends with .m3u8', () => {
    mockIsSupported.mockReturnValue(true)
    const videoEl = document.createElement('video')
    const videoRef = { current: videoEl }

    const { unmount } = renderHook(() =>
      useHls(videoRef, 'https://example.com/video.m3u8'),
    )

    expect(mockLoadSource).toHaveBeenCalledWith(
      'https://example.com/video.m3u8',
    )
    expect(mockAttachMedia).toHaveBeenCalledWith(videoEl)

    unmount()
    expect(mockDestroy).toHaveBeenCalled()
  })

  it('sets src attribute directly when Hls is not supported or not m3u8', () => {
    mockIsSupported.mockReturnValue(false)
    const videoEl = document.createElement('video')
    const videoRef = { current: videoEl }

    renderHook(() => useHls(videoRef, 'https://example.com/video.mp4'))

    expect(mockLoadSource).not.toHaveBeenCalled()
    expect(videoEl.getAttribute('src')).toBe('https://example.com/video.mp4')
  })

  it('handles null videoRef safely', () => {
    const videoRef = { current: null }
    renderHook(() => useHls(videoRef, 'https://example.com/video.mp4'))
    expect(mockLoadSource).not.toHaveBeenCalled()
  })
})
