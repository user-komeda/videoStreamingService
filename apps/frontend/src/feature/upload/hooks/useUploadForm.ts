import { useCallback } from 'react'

import { mergeForm, useForm } from '@tanstack/react-form'

import { uploadFormOpts } from '~/feature/upload/formOptions'

import type { VideoActionResult } from '~/feature/video/types/type'

export const useUploadForm = (actionData?: VideoActionResult) => {
  const transform = useCallback(
    (baseForm: unknown) =>
      mergeForm(
        baseForm as never,
        (actionData && !actionData.success && actionData.error
          ? { errorMap: { onSubmit: actionData.error } }
          : {}) as never,
      ),
    [actionData],
  )

  return useForm({
    ...uploadFormOpts,
    transform,
  })
}

export type UploadFormInstance = ReturnType<typeof useUploadForm>
