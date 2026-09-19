import { useDropzone } from '@uppy/react'

import { Button } from '~/components/ui/button'
import { UploadFileList } from '~/feature/upload/components/UploadFileList'
import { UploadProgress } from '~/feature/upload/components/uploadProgress'
import { UploadDropArea } from '~/feature/upload/components/upload_drop_area'

import type Uppy from '@uppy/core'
import type { Meta } from '@uppy/core'
import type { FileItem } from '~/feature/upload/hooks/useUploadState'

export const UploadArea = ({
  files,
  pct,
  uppy,
  onRemoveFile,
}: {
  files: FileItem[]
  pct: number
  uppy: Uppy<Meta, Record<string, never>> | undefined
  onRemoveFile: (fileId: string) => void
}) => {
  const { getRootProps, getInputProps } = useDropzone({ noClick: false })

  return (
    <>
      <h2 className="my-10 text-center text-3xl font-bold">動画アップロード</h2>
      <div className="mx-auto w-4/5">
        <UploadDropArea
          getRootProps={getRootProps}
          getInputProps={getInputProps}
        />
        {files.length > 0 && (
          <UploadFileList files={files} onRemoveFile={onRemoveFile} />
        )}
        <Button
          onClick={() => void uppy!.upload()}
          disabled={files.length === 0}
          className="mt-4"
        >
          アップロード開始
        </Button>
      </div>
      <UploadProgress pct={pct} />
    </>
  )
}
