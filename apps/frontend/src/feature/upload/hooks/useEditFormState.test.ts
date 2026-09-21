import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { VideoVisibility } from '~/api/generated/models/videoVisibility'
import { useEditFormState } from '~/feature/upload/hooks/useEditFormState'

describe('useEditFormState', () => {
  it('initializes with default values when video is null', () => {
    const { result } = renderHook(() => useEditFormState(null))

    expect(result.current.title).toBe('')
    expect(result.current.description).toBe('')
    expect(result.current.visibility).toBe('public')
  })

  it('initializes with video properties when provided', () => {
    const mockVideo = {
      id: '123',
      title: 'Initial Title',
      description: 'Initial Description',
      visibility: VideoVisibility.Private,
      createdAt: '',
      updatedAt: '',
    }

    const { result } = renderHook(() => useEditFormState(mockVideo))

    expect(result.current.title).toBe('Initial Title')
    expect(result.current.description).toBe('Initial Description')
    expect(result.current.visibility).toBe(VideoVisibility.Private)
  })

  it('updates state values correctly', () => {
    const { result } = renderHook(() => useEditFormState(null))

    act(() => {
      result.current.setTitle('Updated Title')
      result.current.setDescription('Updated Desc')
      result.current.setVisibility(VideoVisibility.Public)
    })

    expect(result.current.title).toBe('Updated Title')
    expect(result.current.description).toBe('Updated Desc')
    expect(result.current.visibility).toBe(VideoVisibility.Public)
  })
})
