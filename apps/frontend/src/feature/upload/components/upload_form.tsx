import { useEffect } from 'react'
import { useFetcher } from 'react-router'

import { useStore } from '@tanstack/react-store'

import { Alert, AlertDescription } from '~/components/ui/alert'
import {
  DescriptionFormField,
  SubmitFormField,
  TitleFormField,
  VisibilityFormField,
} from '~/feature/upload/components/UploadFormInputs'
import { useUploadForm } from '~/feature/upload/hooks/useUploadForm'

import type { VideoActionResult } from '~/feature/video/types/type'

type Props = {
  onSuccess: (videoId: string) => void
}

// 送信時・サーバーエラー（onSubmit エラー）のみを Alert として表示
const UploadFormAlerts = ({ submitError }: { submitError?: string | null }) => {
  if (!submitError) {
    return null
  }

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertDescription>{submitError}</AlertDescription>
    </Alert>
  )
}

export const UploadForm = ({ onSuccess }: Props) => {
  const fetcher = useFetcher<VideoActionResult>()
  const form = useUploadForm(fetcher.data)
  const submitError = useStore(form.store, (formState) =>
    typeof formState.errorMap.onSubmit === 'string'
      ? formState.errorMap.onSubmit
      : null,
  )
  useEffect(() => {
    if (fetcher.data?.success && fetcher.data.videoId) {
      onSuccess(fetcher.data.videoId)
    }
  }, [fetcher.data, onSuccess])

  return (
    <div className="mx-auto w-4/5 max-w-xl">
      <h2 className="my-10 text-center text-3xl font-bold">動画情報の入力</h2>
      <UploadFormAlerts submitError={submitError} />
      <fetcher.Form method="post" action={'/videos'} className="space-y-6">
        <TitleFormField form={form} />
        <DescriptionFormField form={form} />
        <VisibilityFormField form={form} />
        <SubmitFormField form={form} />
      </fetcher.Form>
    </div>
  )
}
