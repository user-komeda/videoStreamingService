import { useContext, useMemo, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { UppyContext, useUppyEvent, useUppyState } from '@uppy/react'

import type Uppy from '@uppy/core'

export type Step = 'form' | 'upload' | 'completed'
export type FileItem = { id: string; name: string; size?: number | null }

const useUppyLifecycle = (
  uppy: Uppy | undefined,
  setStep: (step: Step) => void,
) => {
  const queryClient = useQueryClient()

  useUppyEvent(uppy!, 'complete', (result) => {
    if (result.failed?.length === 0) {
      void queryClient.invalidateQueries({ queryKey: ['videos'] })
      setTimeout(() => setStep('completed'), 1500)
    }
  })

  useUppyEvent(uppy!, 'cancel-all', () => {
    void queryClient.invalidateQueries({ queryKey: ['videos'] })
    setStep('form')
  })
}

export const useUploadState = () => {
  const queryClient = useQueryClient()
  const { uppy } = useContext(UppyContext)
  const [step, setStep] = useState<Step>('form')
  const progress = useUppyState(uppy!, (state) => state.totalProgress)
  const pct = useMemo(() => Math.round(progress ?? 0), [progress])
  const files = useUppyState(
    uppy!,
    (state) => Object.values(state.files) as FileItem[],
  )

  useUppyLifecycle(uppy, setStep)

  const handleFormSuccess = (videoId: string) => {
    void queryClient.invalidateQueries({ queryKey: ['videos'] })
    uppy!.setMeta({ videoId })
    setStep('upload')
  }

  const handleReset = () => {
    void queryClient.invalidateQueries({ queryKey: ['videos'] })
    uppy!.cancelAll()
    setStep('form')
  }

  return {
    uppy,
    step,
    files,
    pct,
    handleFormSuccess,
    handleRemoveFile: (fileId: string) => uppy?.removeFile(fileId),
    handleReset,
  }
}
