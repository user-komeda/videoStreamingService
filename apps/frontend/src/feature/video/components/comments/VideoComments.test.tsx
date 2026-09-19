import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { VideoComments } from '~/feature/video/components/comments/VideoComments'

describe('VideoComments', () => {
  const initialComments = [
    {
      id: 'c-1',
      authorName: 'User A',
      authorAvatarUrl: 'https://example.com/a.png',
      content: 'Initial Comment',
      createdAt: '1日前',
      likes: 2,
      isLiked: false,
    },
  ]

  it('renders comments, adds comment and toggles like', () => {
    render(<VideoComments comments={initialComments} totalCount={1} />)

    expect(screen.getByText('コメント 1件')).toBeDefined()
    expect(screen.getByText('Initial Comment')).toBeDefined()

    // Add comment
    const input = screen.getByPlaceholderText('コメントを追加...')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'Second Comment' } })

    const submitBtn = screen.getByText('コメント')
    fireEvent.click(submitBtn)

    expect(screen.getByText('Second Comment')).toBeDefined()
    expect(screen.getByText('コメント 2件')).toBeDefined()

    // Toggle like
    const likeButtons = screen.getAllByLabelText('高評価')
    fireEvent.click(likeButtons[1]) // like c-1
    expect(screen.getByText('3')).toBeDefined()
  })
})
