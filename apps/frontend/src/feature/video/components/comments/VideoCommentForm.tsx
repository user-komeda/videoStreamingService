import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { useCommentForm } from '~/feature/video/hooks/useCommentForm'

interface VideoCommentFormProps {
  onSubmit: (content: string) => void
}

const CommentFormActions = ({
  onCancel,
  canSubmit,
}: {
  onCancel: () => void
  canSubmit: boolean
}) => (
  <div className="flex justify-end gap-2 pt-1">
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onCancel}
      className="rounded-full text-xs"
    >
      キャンセル
    </Button>
    <Button
      type="submit"
      size="sm"
      disabled={!canSubmit}
      className="rounded-full text-xs"
    >
      コメント
    </Button>
  </div>
)

export const VideoCommentForm = ({ onSubmit }: VideoCommentFormProps) => {
  const {
    commentInput,
    setCommentInput,
    isFocused,
    handleFocus,
    handleCancel,
    handleSubmit,
    canSubmit,
  } = useCommentForm({ onSubmit })

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-700 text-xs font-bold text-white">
        {'TODO'}
      </div>
      <div className="flex-1 space-y-2">
        <Input
          type="text"
          placeholder="コメントを追加..."
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          onFocus={handleFocus}
          className="focus-visible:border-foreground rounded-none border-0 border-b px-0 shadow-none focus-visible:ring-0"
        />
        {isFocused && (
          <CommentFormActions onCancel={handleCancel} canSubmit={canSubmit} />
        )}
      </div>
    </form>
  )
}
