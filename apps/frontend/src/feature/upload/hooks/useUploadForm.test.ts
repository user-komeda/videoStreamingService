import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useUploadForm } from '~/feature/upload/hooks/useUploadForm'

describe('useUploadForm', () => {
  it('creates form with default options', () => {
    const { result } = renderHook(() => useUploadForm())

    expect(result.current.state.values.title).toBe('')
    expect(result.current.state.values.description).toBe('')
    expect(result.current.state.values.visibility).toBe('public')
  })

  it('transforms error map when actionData contains error', () => {
    const { result } = renderHook(() =>
      useUploadForm({
        success: false,
        error: 'Upload error occurred',
      }),
    )

    expect(result.current.state.errorMap.onSubmit).toBe('Upload error occurred')
  })

  it('does not set error map when actionData is successful', () => {
    const { result } = renderHook(() =>
      useUploadForm({
        success: true,
        videoId: 'video-123',
      }),
    )

    expect(result.current.state.errorMap.onSubmit).toBeUndefined()
  })
})
