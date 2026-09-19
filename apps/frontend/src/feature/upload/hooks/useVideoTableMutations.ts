import { useState } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  deleteVideosId,
  putVideosId,
} from '~/api/generated/endpoints/videos/videos'

import type { VideoResponse, VideoVisibility } from '~/api/generated/models'

export const useVideoTableMutations = () => {
  const queryClient = useQueryClient()
  const [deleteTarget, setDeleteTarget] = useState<VideoResponse | null>(null)
  const [editTarget, setEditTarget] = useState<VideoResponse | null>(null)

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteVideosId(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['videos'] })
      setDeleteTarget(null)
    },
  })

  const editMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: { title: string; description: string; visibility: VideoVisibility }
    }) => putVideosId(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['videos'] })
      setEditTarget(null)
    },
  })

  return {
    deleteTarget,
    setDeleteTarget,
    editTarget,
    setEditTarget,
    deleteMutation,
    editMutation,
  }
}
