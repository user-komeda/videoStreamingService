import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCommentForm } from '~/feature/video/hooks/useCommentForm'

describe('useCommentForm', () => {
  it('handles focus, input, cancel and submit', () => {
    const onSubmit = vi.fn()
    const { result } = renderHook(() => useCommentForm({ onSubmit }))

    expect(result.current.commentInput).toBe('')
    expect(result.current.isFocused).toBe(false)
    expect(result.current.canSubmit).toBe(false)

    act(() => {
      result.current.handleFocus()
      result.current.setCommentInput('Nice video!')
    })

    expect(result.current.isFocused).toBe(true)
    expect(result.current.commentInput).toBe('Nice video!')
    expect(result.current.canSubmit).toBe(true)

    // Submit
    const preventDefault = vi.fn()
    const fakeEvent = {
      preventDefault,
    } as unknown as React.FormEvent

    act(() => {
      result.current.handleSubmit(fakeEvent)
    })

    expect(preventDefault).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledWith('Nice video!')
    expect(result.current.commentInput).toBe('')
    expect(result.current.isFocused).toBe(false)
  })

  it('does not submit when input is only whitespace', () => {
    const onSubmit = vi.fn()
    const { result } = renderHook(() => useCommentForm({ onSubmit }))

    act(() => {
      result.current.setCommentInput('   ')
    })

    expect(result.current.canSubmit).toBe(false)

    const fakeEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent

    act(() => {
      result.current.handleSubmit(fakeEvent)
    })

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('resets state on cancel', () => {
    const onSubmit = vi.fn()
    const { result } = renderHook(() => useCommentForm({ onSubmit }))

    act(() => {
      result.current.handleFocus()
      result.current.setCommentInput('Draft')
    })

    act(() => {
      result.current.handleCancel()
    })

    expect(result.current.commentInput).toBe('')
    expect(result.current.isFocused).toBe(false)
  })
})
