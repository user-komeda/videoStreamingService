import { Button } from '~/components/ui/button'

export type DeleteConfirmDialogProps = {
  isOpen: boolean
  fileName?: string
  onConfirm: () => void
  onCancel: () => void
}

export const DeleteConfirmDialog = ({
  isOpen,
  fileName,
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) => {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background border-border w-full max-w-md rounded-xl border p-6 shadow-xl">
        <h3 className="text-foreground text-lg font-semibold">
          アップロードを取り消しますか？
        </h3>
        <p className="text-muted-foreground mt-2 text-sm">
          {fileName ? (
            <>
              「<span className="text-foreground font-medium">{fileName}</span>
              」のアップロードを取り消します。この操作は取り消せません。
            </>
          ) : (
            'アップロードを破棄して最初からやり直します。この操作は取り消せません。'
          )}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            キャンセル
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            削除する
          </Button>
        </div>
      </div>
    </div>
  )
}
