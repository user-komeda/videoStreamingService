import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { VideoActionButtons } from '~/feature/video/components/info/VideoActionButtons'

describe('VideoActionButtons', () => {
  it('renders like count, triggers like and dislike', () => {
    const onToggleLike = vi.fn()
    const onToggleDislike = vi.fn()

    const { rerender } = render(
      <VideoActionButtons
        isLiked={false}
        isDisliked={false}
        likeCount={1234}
        onToggleLike={onToggleLike}
        onToggleDislike={onToggleDislike}
      />,
    )

    expect(screen.getByText('1,234')).toBeDefined()
    expect(screen.getByText('共有')).toBeDefined()

    fireEvent.click(screen.getByText('1,234'))
    expect(onToggleLike).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByLabelText('低評価'))
    expect(onToggleDislike).toHaveBeenCalledTimes(1)

    rerender(
      <VideoActionButtons
        isLiked={true}
        isDisliked={true}
        likeCount={1234}
        onToggleLike={onToggleLike}
        onToggleDislike={onToggleDislike}
      />,
    )
  })
})
