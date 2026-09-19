import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useComments } from '~/feature/video/hooks/useComments'

import type { CommentItem } from '~/feature/video/hooks/useComments'

describe('useComments', () => {
  const initialComments: CommentItem[] = [
    {
      id: 'c1',
      authorName: 'User 1',
      authorAvatarUrl: 'https://example.com/avatar1.png',
      content: 'First comment',
      createdAt: '1日前',
      likes: 5,
      isLiked: false,
    },
    {
      id: 'c2',
      authorName: 'User 2',
      authorAvatarUrl: 'https://example.com/avatar2.png',
      content: 'Second comment',
      createdAt: '2日前',
      likes: 0,
      isLiked: false,
    },
  ]

  it('initializes comments and total count', () => {
    const { result } = renderHook(() =>
      useComments({
        initialComments,
        initialTotalCount: 2,
      }),
    )

    expect(result.current.comments).toEqual(initialComments)
    expect(result.current.totalCount).toBe(2)
  })

  it('adds a comment and updates totalCount', () => {
    const { result } = renderHook(() =>
      useComments({
        initialComments,
        initialTotalCount: 2,
      }),
    )

    act(() => {
      result.current.addComment('New comment')
    })

    expect(result.current.comments.length).toBe(3)
    expect(result.current.comments[0]?.content).toBe('New comment')
    expect(result.current.totalCount).toBe(3)
  })

  it('ignores empty comment addition', () => {
    const { result } = renderHook(() =>
      useComments({
        initialComments,
        initialTotalCount: 2,
      }),
    )

    act(() => {
      result.current.addComment('   ')
    })

    expect(result.current.comments.length).toBe(2)
    expect(result.current.totalCount).toBe(2)
  })

  it('toggles comment like and count', () => {
    const { result } = renderHook(() =>
      useComments({
        initialComments,
        initialTotalCount: 2,
      }),
    )

    act(() => {
      result.current.handleToggleLike('c1')
    })

    expect(result.current.comments[0]?.isLiked).toBe(true)
    expect(result.current.comments[0]?.likes).toBe(6)
    expect(result.current.comments[1]?.isLiked).toBe(false)
    expect(result.current.comments[1]?.likes).toBe(0)

    act(() => {
      result.current.handleToggleLike('c1')
    })

    expect(result.current.comments[0]?.isLiked).toBe(false)
    expect(result.current.comments[0]?.likes).toBe(5)
  })
})
