import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as videosApi from '~/api/generated/endpoints/videos/videos'
import { videoDetailQuery, videoListQuery } from '~/feature/video/queries'

vi.mock('~/api/generated/endpoints/videos/videos', () => ({
  getVideos: vi.fn(),
  getVideosId: vi.fn(),
}))

describe('video queries', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('videoListQuery', () => {
    it('returns data when status is 200', async () => {
      const mockList = [{ id: '1', title: 'Test' }]
      vi.mocked(videosApi.getVideos).mockResolvedValueOnce({
        status: 200,
        data: mockList,
      } as unknown as never)

      const options = videoListQuery()
      const queryFn = options.queryFn as (ctx: {
        signal?: AbortSignal
      }) => Promise<unknown>
      const res = await queryFn({})

      expect(res).toEqual(mockList)
    })

    it('returns empty array when status is not 200 or not array', async () => {
      vi.mocked(videosApi.getVideos).mockResolvedValueOnce({
        status: 500,
        data: null,
      } as unknown as never)

      const options = videoListQuery()
      const queryFn = options.queryFn as (ctx: {
        signal?: AbortSignal
      }) => Promise<unknown>
      const res = await queryFn({})

      expect(res).toEqual([])
    })

    it('returns empty array when fetch throws error', async () => {
      vi.mocked(videosApi.getVideos).mockRejectedValueOnce(
        new Error('Network error'),
      )

      const options = videoListQuery()
      const queryFn = options.queryFn as (ctx: {
        signal?: AbortSignal
      }) => Promise<unknown>
      const res = await queryFn({})

      expect(res).toEqual([])
    })
  })

  describe('videoDetailQuery', () => {
    it('returns video response when status is 200', async () => {
      const mockVideo = { id: 'vid-123', title: 'Test Video' }
      vi.mocked(videosApi.getVideosId).mockResolvedValueOnce({
        status: 200,
        data: mockVideo,
      } as unknown as never)

      const options = videoDetailQuery('vid-123')
      const queryFn = options.queryFn as (ctx: {
        signal?: AbortSignal
      }) => Promise<unknown>
      const res = await queryFn({})

      expect(res).toEqual(mockVideo)
      expect(videosApi.getVideosId).toHaveBeenCalledWith('vid-123', {
        signal: undefined,
      })
    })

    it('returns null when status is not 200', async () => {
      vi.mocked(videosApi.getVideosId).mockResolvedValueOnce({
        status: 404,
        data: null,
      } as unknown as never)

      const options = videoDetailQuery('vid-999')
      const queryFn = options.queryFn as (ctx: {
        signal?: AbortSignal
      }) => Promise<unknown>
      const res = await queryFn({})

      expect(res).toBeNull()
    })

    it('returns null when fetch throws error', async () => {
      vi.mocked(videosApi.getVideosId).mockRejectedValueOnce(
        new Error('Network error'),
      )

      const options = videoDetailQuery('vid-999')
      const queryFn = options.queryFn as (ctx: {
        signal?: AbortSignal
      }) => Promise<unknown>
      const res = await queryFn({})

      expect(res).toBeNull()
    })
  })
})
