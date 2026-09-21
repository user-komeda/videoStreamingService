import { formOptions } from '@tanstack/react-form'

import { VideoVisibility } from '~/api/generated/models/videoVisibility'
import { PostVideosBody } from '~/api/generated/zod'

export type UploadFormData = {
  title: string
  description?: string
  visibility: VideoVisibility
}

const defaultValues: UploadFormData = {
  title: '',
  description: '',
  visibility: VideoVisibility.Public,
}

export const uploadFormOpts = formOptions({
  defaultValues,
  validators: {
    onChange: PostVideosBody,
  },
})
