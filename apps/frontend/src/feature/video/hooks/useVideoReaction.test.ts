import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useVideoReaction } from '~/feature/video/hooks/useVideoReaction'

describe('useVideoReaction', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => useVideoReaction({ initialLikes: 10 }))

    expect(result.current.likeCount).toBe(10)
    expect(result.current.isLiked).toBe(false)
    expect(result.current.isDisliked).toBe(false)
  })

  it('toggles like correctly', () => {
    const { result } = renderHook(() => useVideoReaction({ initialLikes: 10 }))

    act(() => {
      result.current.handleToggleLike()
    })
    expect(result.current.isLiked).toBe(true)
    expect(result.current.likeCount).toBe(11)

    act(() => {
      result.current.handleToggleLike()
    })
    expect(result.current.isLiked).toBe(false)
    expect(result.current.likeCount).toBe(10)
  })

  it('un-dislikes when like is toggled on', () => {
    const { result } = renderHook(() =>
      useVideoReaction({ initialLikes: 10, initialIsDisliked: true }),
    )

    act(() => {
      result.current.handleToggleLike()
    })
    expect(result.current.isLiked).toBe(true)
    expect(result.current.isDisliked).toBe(false)
    expect(result.current.likeCount).toBe(11)
  })

  it('toggles dislike correctly and un-likes if liked', () => {
    const { result } = renderHook(() =>
      useVideoReaction({ initialLikes: 10, initialIsLiked: true }),
    )

    act(() => {
      result.current.handleToggleDislike()
    })
    expect(result.current.isDisliked).toBe(true)
    expect(result.current.isLiked).toBe(false)
    expect(result.current.likeCount).toBe(9)

    act(() => {
      result.current.handleToggleDislike()
    })
    expect(result.current.isDisliked).toBe(false)
  })
})
