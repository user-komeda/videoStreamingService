import React from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as videosApi from '~/api/generated/endpoints/videos/videos'
import { VideoVisibility } from '~/api/generated/models/videoVisibility'
import { useVideoTableMutations } from '~/feature/upload/hooks/useVideoTableMutations'

import type { VideoResponse } from '~/api/generated/models'

vi.mock('~/api/generated/endpoints/videos/videos', () => ({
  deleteVideosId: vi.fn(),
  putVideosId: vi.fn(),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  Wrapper.displayName = 'QueryClientTestWrapper'
  return Wrapper
}

describe('useVideoTableMutations', () => {
  const mockVideo: VideoResponse = {
    id: 'vid-1',
    title: 'Test',
    description: 'Desc',
    visibility: VideoVisibility.Public,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('manages deleteTarget and editTarget state', () => {
    const { result } = renderHook(() => useVideoTableMutations(), {
      wrapper: createWrapper(),
    })

    expect(result.current.deleteTarget).toBeNull()
    expect(result.current.editTarget).toBeNull()

    act(() => {
      result.current.setDeleteTarget(mockVideo)
      result.current.setEditTarget(mockVideo)
    })

    expect(result.current.deleteTarget).toEqual(mockVideo)
    expect(result.current.editTarget).toEqual(mockVideo)
  })

  it('executes deleteMutation successfully', async () => {
    vi.mocked(videosApi.deleteVideosId).mockResolvedValueOnce(
      {} as unknown as never,
    )

    const { result } = renderHook(() => useVideoTableMutations(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.setDeleteTarget(mockVideo)
    })

    await act(async () => {
      await result.current.deleteMutation.mutateAsync('vid-1')
    })

    expect(videosApi.deleteVideosId).toHaveBeenCalledWith('vid-1')
    expect(result.current.deleteTarget).toBeNull()
  })

  it('executes editMutation successfully', async () => {
    vi.mocked(videosApi.putVideosId).mockResolvedValueOnce(
      {} as unknown as never,
    )

    const { result } = renderHook(() => useVideoTableMutations(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.setEditTarget(mockVideo)
    })

    await act(async () => {
      await result.current.editMutation.mutateAsync({
        id: 'vid-1',
        data: {
          title: 'New title',
          description: 'New desc',
          visibility: VideoVisibility.Public,
        },
      })
    })

    expect(videosApi.putVideosId).toHaveBeenCalledWith('vid-1', {
      title: 'New title',
      description: 'New desc',
      visibility: VideoVisibility.Public,
    })
    expect(result.current.editTarget).toBeNull()
  })
})
