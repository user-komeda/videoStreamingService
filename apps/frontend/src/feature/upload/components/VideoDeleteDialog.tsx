import { useState } from 'react'

import { Button } from '~/components/ui/button'

import type { VideoResponse } from '~/api/generated/models'

type Props = {
  video: VideoResponse | null
  isOpen: boolean
  isDeleting: boolean
  onConfirm: () => void
  onClose: () => void
}

const DeleteNotice = ({
  title,
  understood,
  setUnderstood,
}: {
  title?: string
  understood: boolean
  setUnderstood: (v: boolean) => void
}) => (
  <>
    <p className="text-muted-foreground mt-3 text-sm">
      「<span className="text-foreground font-semibold">{title || '無題'}</span>
      」を完全に削除しようとしています。この操作は取り消せません。
    </p>
    <label className="border-border bg-muted/40 mt-4 flex cursor-pointer items-start gap-2 rounded-lg border p-3 text-sm">
      <input
        type="checkbox"
        checked={understood}
        onChange={(e) => setUnderstood(e.target.checked)}
        className="accent-destructive mt-0.5 size-4"
      />
      <span className="text-muted-foreground">
        動画が完全に削除され、復元できないことを理解しました。
      </span>
    </label>
  </>
)

const DialogActions = ({
  isDeleting,
  understood,
  onClose,
  onConfirm,
}: {
  isDeleting: boolean
  understood: boolean
  onClose: () => void
  onConfirm: () => void
}) => (
  <div className="mt-6 flex justify-end gap-3">
    <Button variant="outline" onClick={onClose} disabled={isDeleting}>
      キャンセル
    </Button>
    <Button
      variant="destructive"
      onClick={onConfirm}
      disabled={!understood || isDeleting}
    >
      {isDeleting ? '削除中...' : '完全に削除'}
    </Button>
  </div>
)

export const VideoDeleteDialog = ({
  video,
  isOpen,
  isDeleting,
  onConfirm,
  onClose,
}: Props) => {
  const [understood, setUnderstood] = useState(false)
  if (!isOpen || !video) {
    return null
  }

  const handleClose = () => {
    setUnderstood(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="border-border bg-background w-full max-w-lg rounded-xl border p-6 shadow-2xl">
        <h3 className="text-foreground text-xl font-bold">
          この動画を完全に削除しますか？
        </h3>
        <DeleteNotice
          title={video.title}
          understood={understood}
          setUnderstood={setUnderstood}
        />
        <DialogActions
          isDeleting={isDeleting}
          understood={understood}
          onClose={handleClose}
          onConfirm={onConfirm}
        />
      </div>
    </div>
  )
}
