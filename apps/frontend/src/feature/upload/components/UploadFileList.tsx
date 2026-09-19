import { useState } from 'react'

import { Trash2 } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { DeleteConfirmDialog } from '~/feature/upload/components/DeleteConfirmDialog'

import type { FileItem } from '~/feature/upload/hooks/useUploadState'

type UploadFileListProps = {
  files: FileItem[]
  onRemoveFile: (fileId: string) => void
}

const FileItemRow = ({
  file,
  onSelect,
}: {
  file: FileItem
  onSelect: (file: FileItem) => void
}) => {
  const sizeMb = Math.round(file.size ? file.size / 1024 / 1024 : 0)
  return (
    <li className="border-border bg-card flex items-center justify-between rounded-lg border p-3">
      <div className="flex flex-col truncate pr-4">
        <span className="truncate font-medium">{file.name}</span>
        <span className="text-muted-foreground text-xs">{sizeMb} MB</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-destructive shrink-0"
        onClick={() => onSelect(file)}
        title="ファイルを削除"
      >
        <Trash2 className="size-4" />
      </Button>
    </li>
  )
}

export const UploadFileList = ({
  files,
  onRemoveFile,
}: UploadFileListProps) => {
  const [targetFile, setTargetFile] = useState<FileItem | null>(null)

  const handleConfirm = () => {
    if (targetFile) {
      onRemoveFile(targetFile.id)
    }
    setTargetFile(null)
  }

  return (
    <>
      <ul className="text-foreground mt-4 space-y-2 text-sm">
        {files.map((file) => (
          <FileItemRow key={file.id} file={file} onSelect={setTargetFile} />
        ))}
      </ul>
      <DeleteConfirmDialog
        isOpen={targetFile !== null}
        fileName={targetFile?.name}
        onConfirm={handleConfirm}
        onCancel={() => setTargetFile(null)}
      />
    </>
  )
}
