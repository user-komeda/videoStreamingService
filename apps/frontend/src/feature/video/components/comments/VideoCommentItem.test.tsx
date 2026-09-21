import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { VideoCommentItem } from '~/feature/video/components/comments/VideoCommentItem'

describe('VideoCommentItem', () => {
  const comment = {
    id: 'c-1',
    authorName: 'Taro',
    authorAvatarUrl: 'https://example.com/avatar.png',
    content: 'Great video!',
    createdAt: '2時間前',
    likes: 3,
    isLiked: false,
  }

  it('renders comment details and toggles like', () => {
    const onToggleLike = vi.fn()
    const { rerender } = render(
      <VideoCommentItem comment={comment} onToggleLike={onToggleLike} />,
    )

    expect(screen.getByText('Taro')).toBeDefined()
    expect(screen.getByText('2時間前')).toBeDefined()
    expect(screen.getByText('Great video!')).toBeDefined()
    expect(screen.getByText('3')).toBeDefined()

    const likeButton = screen.getByLabelText('高評価')
    fireEvent.click(likeButton)

    expect(onToggleLike).toHaveBeenCalledWith('c-1')

    rerender(
      <VideoCommentItem
        comment={{ ...comment, isLiked: true, likes: 0 }}
        onToggleLike={onToggleLike}
      />,
    )
    expect(screen.queryByText('0')).toBeNull()
  })
})
