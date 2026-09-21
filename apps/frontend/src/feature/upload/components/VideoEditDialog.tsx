import { Button } from '~/components/ui/button'
import {
  EditDescriptionField,
  EditTitleField,
  EditVisibilityField,
} from '~/feature/upload/components/VideoEditFormFields'
import { useEditFormState } from '~/feature/upload/hooks/useEditFormState'

import type { VideoResponse, VideoVisibility } from '~/api/generated/models'

type Props = {
  video: VideoResponse | null
  isOpen: boolean
  isUpdating: boolean
  onConfirm: (data: {
    title: string
    description: string
    visibility: VideoVisibility
  }) => void
  onClose: () => void
}

const DialogFooter = ({
  isUpdating,
  onClose,
}: {
  isUpdating: boolean
  onClose: () => void
}) => (
  <div className="mt-6 flex justify-end gap-3">
    <Button
      type="button"
      variant="outline"
      onClick={onClose}
      disabled={isUpdating}
    >
      キャンセル
    </Button>
    <Button type="submit" disabled={isUpdating}>
      {isUpdating ? '保存中...' : '保存'}
    </Button>
  </div>
)

const EditForm = ({
  formState,
  isUpdating,
  onClose,
  onSubmit,
}: {
  formState: ReturnType<typeof useEditFormState>
  isUpdating: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
}) => (
  <form onSubmit={onSubmit} className="mt-4 space-y-4">
    <EditTitleField title={formState.title} setTitle={formState.setTitle} />
    <EditDescriptionField
      description={formState.description}
      setDescription={formState.setDescription}
    />
    <EditVisibilityField
      visibility={formState.visibility}
      setVisibility={formState.setVisibility}
    />
    <DialogFooter isUpdating={isUpdating} onClose={onClose} />
  </form>
)

export const VideoEditDialog = ({
  video,
  isOpen,
  isUpdating,
  onConfirm,
  onClose,
}: Props) => {
  const formState = useEditFormState(video)
  if (!isOpen || !video) {
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onConfirm({
      title: formState.title,
      description: formState.description,
      visibility: formState.visibility,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="border-border bg-background w-full max-w-lg rounded-xl border p-6 shadow-2xl">
        <h3 className="text-foreground text-xl font-bold">動画の編集</h3>
        <EditForm
          formState={formState}
          isUpdating={isUpdating}
          onClose={onClose}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
