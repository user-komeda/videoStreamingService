import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { VideoCommentForm } from '~/feature/video/components/comments/VideoCommentForm'

describe('VideoCommentForm', () => {
  it('handles focus, typing, submit, and cancel actions', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<VideoCommentForm onSubmit={onSubmit} />)

    const input = screen.getByPlaceholderText('コメントを追加...')
    expect(screen.queryByText('コメント')).toBeNull()

    // Focus input
    await user.click(input)
    expect(screen.getByText('コメント')).toBeDefined()
    expect(screen.getByText('キャンセル')).toBeDefined()

    // Type text
    await user.type(input, 'Awesome content')

    // Cancel
    const cancelBtn = screen.getByText('キャンセル')
    await user.click(cancelBtn)
    expect(input.getAttribute('value')).toBe('')

    // Type again and submit
    await user.click(input)
    await user.type(input, 'Awesome content')

    const submitBtn = screen.getByText('コメント')
    await user.click(submitBtn)
    expect(onSubmit).toHaveBeenCalledWith('Awesome content')
  })
})
