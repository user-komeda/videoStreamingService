import React from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook } from '@testing-library/react'
import { UppyContextProvider } from '@uppy/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useUploadState } from '~/feature/upload/hooks/useUploadState'

import type Uppy from '@uppy/core'

describe('useUploadState', () => {
  let callbacks: Record<string, ((...args: unknown[]) => void)[]> = {}
  let mockUppy: Partial<Uppy>

  beforeEach(() => {
    callbacks = {}
    const state = {
      totalProgress: 50,
      files: {
        f1: { id: 'f1', name: 'video.mp4', size: 1024 },
      },
    }
    mockUppy = {
      on: vi.fn((event: string, callback: (...args: unknown[]) => void) => {
        if (!callbacks[event]) {
          callbacks[event] = []
        }
        callbacks[event].push(callback)
        return mockUppy as Uppy
      }),
      off: vi.fn((event: string, callback: (...args: unknown[]) => void) => {
        callbacks[event] = (callbacks[event] || []).filter(
          (cb) => cb !== callback,
        )
        return mockUppy as Uppy
      }),
      getState: vi.fn().mockReturnValue(state),
      store: {
        getState: vi.fn().mockReturnValue(state),
        subscribe: vi.fn(() => () => {}),
      } as unknown as Uppy['store'],
      setMeta: vi.fn(),
      cancelAll: vi.fn(),
      removeFile: vi.fn(),
    }
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const createWrapper = (uppyInstance: unknown) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
    const Wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(
          UppyContextProvider as React.ComponentType<{ uppy: Uppy }>,
          { uppy: uppyInstance as Uppy },
          children,
        ),
      )
    Wrapper.displayName = 'UppyTestWrapper'
    return Wrapper
  }

  it('manages uppy state and handlers', () => {
    const { result } = renderHook(() => useUploadState(), {
      wrapper: createWrapper(mockUppy),
    })

    expect(result.current.step).toBe('form')
    expect(result.current.pct).toBe(50)
    expect(result.current.files).toEqual([
      { id: 'f1', name: 'video.mp4', size: 1024 },
    ])

    // handleFormSuccess
    act(() => {
      result.current.handleFormSuccess('video-123')
    })
    expect(mockUppy.setMeta).toHaveBeenCalledWith({ videoId: 'video-123' })
    expect(result.current.step).toBe('upload')

    // handleRemoveFile
    act(() => {
      result.current.handleRemoveFile('f1')
    })
    expect(mockUppy.removeFile).toHaveBeenCalledWith('f1')

    // handleReset
    act(() => {
      result.current.handleReset()
    })
    expect(mockUppy.cancelAll).toHaveBeenCalled()
    expect(result.current.step).toBe('form')
  })

  it('handles complete and cancel-all events', () => {
    const { result } = renderHook(() => useUploadState(), {
      wrapper: createWrapper(mockUppy),
    })

    // Simulate complete event with no failures
    let cleanupFn: (() => void) | null = null
    act(() => {
      const completeCallbacks = callbacks['complete'] || []
      completeCallbacks.forEach((cb) => {
        const res = cb({ failed: [] })
        if (typeof res === 'function') {
          cleanupFn = res
        }
      })
    })

    if (cleanupFn !== null) {
      const fn = cleanupFn as () => void
      fn()
    }

    // Retrigger complete event
    act(() => {
      const completeCallbacks = callbacks['complete'] || []
      completeCallbacks.forEach((cb) => cb({ failed: [] }))
    })

    // Before timer expires, step is still 'form'
    expect(result.current.step).toBe('form')

    // Fast forward timer 1500ms
    act(() => {
      vi.advanceTimersByTime(1500)
    })
    expect(result.current.step).toBe('completed')

    // Simulate complete event with failures
    act(() => {
      const completeCallbacks = callbacks['complete'] || []
      completeCallbacks.forEach((cb) => cb({ failed: [{ id: 'err1' }] }))
      // Also test with undefined failed
      completeCallbacks.forEach((cb) => cb({}))
    })

    // Simulate cancel-all
    act(() => {
      const cancelCallbacks = callbacks['cancel-all'] || []
      cancelCallbacks.forEach((cb) => cb())
    })
    expect(result.current.step).toBe('form')
  })

  it('handles progress fallback safely when totalProgress is undefined', () => {
    const state = {
      totalProgress: undefined,
      files: {},
    }
    const emptyUppy = {
      ...mockUppy,
      getState: vi.fn().mockReturnValue(state),
      store: {
        getState: vi.fn().mockReturnValue(state),
        subscribe: vi.fn(() => () => {}),
      } as unknown as Uppy['store'],
    }

    const { result } = renderHook(() => useUploadState(), {
      wrapper: createWrapper(emptyUppy),
    })

    expect(result.current.pct).toBe(0)
    expect(result.current.files).toEqual([])
  })
})
