import { queryOptions } from '@tanstack/react-query'

import { getVideos, getVideosId } from '~/api/generated/endpoints/videos/videos'

import type { VideoResponse } from '~/api/generated/models'

export const videoListQuery = () =>
  queryOptions({
    queryKey: ['videos'] as const,
    queryFn: async ({ signal }): Promise<VideoResponse[]> => {
      try {
        const res = await getVideos({ signal })
        if (res.status === 200 && Array.isArray(res.data)) {
          return res.data
        }
        return []
      } catch {
        return []
      }
    },
  })

export const videoDetailQuery = (id: string) =>
  queryOptions({
    queryKey: ['videos', id] as const,
    queryFn: async ({ signal }): Promise<VideoResponse | null> => {
      try {
        const res = await getVideosId(id, { signal })
        if (res.status === 200 && res.data) {
          return res.data
        }
        return null
      } catch {
        return null
      }
    },
  })
