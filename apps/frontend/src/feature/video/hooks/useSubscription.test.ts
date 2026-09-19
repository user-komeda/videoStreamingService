import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useSubscription } from '~/feature/video/hooks/useSubscription'

describe('useSubscription', () => {
  it('initializes with default value (false)', () => {
    const { result } = renderHook(() => useSubscription())
    expect(result.current.isSubscribed).toBe(false)
  })

  it('initializes with initialIsSubscribed when provided', () => {
    const { result } = renderHook(() =>
      useSubscription({ initialIsSubscribed: true }),
    )
    expect(result.current.isSubscribed).toBe(true)
  })

  it('toggles subscription state on handleToggleSubscribe', () => {
    const { result } = renderHook(() => useSubscription())

    act(() => {
      result.current.handleToggleSubscribe()
    })
    expect(result.current.isSubscribed).toBe(true)

    act(() => {
      result.current.handleToggleSubscribe()
    })
    expect(result.current.isSubscribed).toBe(false)
  })
})
