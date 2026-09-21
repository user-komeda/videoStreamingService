import { useState } from 'react'

import type { VideoResponse, VideoVisibility } from '~/api/generated/models'

export const useEditFormState = (video: VideoResponse | null) => {
  const [title, setTitle] = useState(video?.title ?? '')
  const [description, setDescription] = useState(video?.description ?? '')
  const [visibility, setVisibility] = useState<VideoVisibility>(
    (video?.visibility as VideoVisibility) ?? 'public',
  )
  return {
    title,
    setTitle,
    description,
    setDescription,
    visibility,
    setVisibility,
  }
}
