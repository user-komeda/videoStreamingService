import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { VideoCommentForm } from '~/feature/video/components/comments/VideoCommentForm'

describe('VideoCommentForm', () => {
  it('handles focus, typing, submit, and cancel actions', () => {
    const onSubmit = vi.fn()
    render(<VideoCommentForm onSubmit={onSubmit} />)

    const input = screen.getByPlaceholderText('コメントを追加...')
    expect(screen.queryByText('コメント')).toBeNull()

    // Focus input
    fireEvent.focus(input)
    expect(screen.getByText('コメント')).toBeDefined()
    expect(screen.getByText('キャンセル')).toBeDefined()

    // Type text
    fireEvent.change(input, { target: { value: 'Awesome content' } })

    // Cancel
    const cancelBtn = screen.getByText('キャンセル')
    fireEvent.click(cancelBtn)
    expect(input.getAttribute('value')).toBe('')

    // Type again and submit
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'Awesome content' } })

    const submitBtn = screen.getByText('コメント')
    fireEvent.click(submitBtn)
    expect(onSubmit).toHaveBeenCalledWith('Awesome content')
  })
})
