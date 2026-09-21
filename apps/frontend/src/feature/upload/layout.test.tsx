import React from 'react'

import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import Layout from '~/feature/upload/layout'
import { createUppy, getVideoDurationMs } from '~/feature/upload/uppy'

let capturedFileAddedCallback:
  ((file: { id: string; data: unknown }) => void) | null = null

const mockSetFileMeta = vi.fn()

vi.mock('@uppy/core', () => {
  return {
    default: class MockUppy {
      use() {
        return this
      }
      on(event: string, cb: (file: { id: string; data: unknown }) => void) {
        if (event === 'file-added') {
          capturedFileAddedCallback = cb
        }
        return this
      }
      off() {
        return this
      }
      setFileMeta = mockSetFileMeta
    },
  }
})

vi.mock('react-router', () => ({
  Outlet: () => React.createElement('div', null, 'Outlet Content'),
}))

const originalCreateElement = document.createElement.bind(document)

describe('Upload Layout', () => {
  let lastCreatedVideo: HTMLVideoElement | null = null

  beforeEach(() => {
    vi.clearAllMocks()
    lastCreatedVideo = null
    global.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url')
    global.URL.revokeObjectURL = vi.fn()

    vi.spyOn(document, 'createElement').mockImplementation(
      (tagName: string) => {
        const el = originalCreateElement(tagName)
        if (tagName === 'video') {
          lastCreatedVideo = el as HTMLVideoElement
        }
        return el
      },
    )
  })

  it('renders Outlet properly', () => {
    render(<Layout />)
    expect(screen.getByText('Outlet Content')).toBeDefined()
  })

  it('getVideoDurationMs resolves positive duration on loadedmetadata', async () => {
    const blob = new Blob(['sample'], { type: 'video/mp4' })
    const durationPromise = getVideoDurationMs(blob)

    if (lastCreatedVideo) {
      Object.defineProperty(lastCreatedVideo, 'duration', {
        value: 12.5,
        writable: true,
      })
      lastCreatedVideo.onloadedmetadata?.(new Event('loadedmetadata'))
    }

    const duration = await durationPromise
    expect(duration).toBe(12500)
  })

  it('getVideoDurationMs resolves 0 on 0 duration or error', async () => {
    const blob = new Blob(['sample'], { type: 'video/mp4' })

    // Test 0 duration
    const durationPromiseZero = getVideoDurationMs(blob)
    if (lastCreatedVideo) {
      Object.defineProperty(lastCreatedVideo, 'duration', {
        value: 0,
        writable: true,
      })
      lastCreatedVideo.onloadedmetadata?.(new Event('loadedmetadata'))
    }
    expect(await durationPromiseZero).toBe(0)

    // Test error
    const durationPromiseErr = getVideoDurationMs(blob)
    if (lastCreatedVideo) {
      lastCreatedVideo.onerror?.('error')
    }
    expect(await durationPromiseErr).toBe(0)
  })

  it('createUppy configures uppy and handles file-added event', async () => {
    const uppyInst = createUppy()
    expect(uppyInst).toBeDefined()
    expect(capturedFileAddedCallback).toBeDefined()

    // Non-blob data
    capturedFileAddedCallback?.({ id: 'file-no-blob', data: null })
    capturedFileAddedCallback?.({ id: 'file-string', data: 'string' })

    const blobTest = new Blob(['sample'], { type: 'video/mp4' })
    capturedFileAddedCallback?.({ id: 'file-with-duration', data: blobTest })
    if (lastCreatedVideo) {
      Object.defineProperty(lastCreatedVideo, 'duration', {
        value: 10,
        writable: true,
      })
      lastCreatedVideo.onloadedmetadata?.(new Event('loadedmetadata'))
      await new Promise((r) => setTimeout(r, 50))
    }
    expect(mockSetFileMeta).toHaveBeenCalledWith('file-with-duration', {
      durationMs: '10000',
    })

    capturedFileAddedCallback?.({ id: 'file-zero-duration', data: blobTest })
    if (lastCreatedVideo) {
      Object.defineProperty(lastCreatedVideo, 'duration', {
        value: 0,
        writable: true,
      })
      lastCreatedVideo.onloadedmetadata?.(new Event('loadedmetadata'))
      await new Promise((r) => setTimeout(r, 50))
    }
  })
})
