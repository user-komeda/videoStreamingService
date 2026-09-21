import type { ReactNode } from 'react'

import { UploadArea } from '~/feature/upload/components/UploadArea'
import { UploadedVideoTable } from '~/feature/upload/components/UploadedVideoTable'
import { UploadCompleted } from '~/feature/upload/components/upload_completed'
import { UploadForm } from '~/feature/upload/components/upload_form'
import {
  type FileItem,
  type Step,
  useUploadState,
} from '~/feature/upload/hooks/useUploadState'

import type Uppy from '@uppy/core'
import type { Meta } from '@uppy/core'

type RenderItemProps = {
  step: Step
  form: {
    onSuccess: (videoId: string) => void
  }
  upload: {
    files: FileItem[]
    pct: number
    uppy: Uppy<Meta, Record<string, never>> | undefined
    onRemoveFile: (fileId: string) => void
  }
  completed: {
    filesCount: number
    onReset: () => void
  }
}

const renderItem = ({
  step,
  form,
  upload,
  completed,
}: RenderItemProps): ReactNode => {
  const componentByStep = {
    form: <UploadForm {...form} />,
    upload: <UploadArea {...upload} />,
    completed: <UploadCompleted {...completed} />,
  } satisfies Record<Step, ReactNode>

  return componentByStep[step]
}

export const Upload = () => {
  const {
    uppy,
    step,
    files,
    pct,
    handleFormSuccess,
    handleRemoveFile,
    handleReset,
  } = useUploadState()

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="border-border bg-card mb-12 rounded-2xl border p-6 shadow-sm">
        {renderItem({
          step,
          form: {
            onSuccess: handleFormSuccess,
          },
          upload: {
            files,
            pct,
            uppy,
            onRemoveFile: handleRemoveFile,
          },
          completed: {
            filesCount: files.length,
            onReset: handleReset,
          },
        })}
      </div>
      <UploadedVideoTable />
    </div>
  )
}
