import { ThumbsDown, ThumbsUp } from 'lucide-react'

import { Button } from '~/components/ui/button'

interface CommentItem {
  id: string
  authorName: string
  authorAvatarUrl: string
  content: string
  createdAt: string
  likes: number
  isLiked?: boolean
}

interface VideoCommentItemProps {
  comment: CommentItem
  onToggleLike: (commentId: string) => void
}

const CommentReactions = ({ comment, onToggleLike }: VideoCommentItemProps) => (
  <div className="flex items-center gap-2 pt-1">
    <Button
      variant="ghost"
      size="icon"
      onClick={() => onToggleLike(comment.id)}
      className={`hover:bg-muted h-7 w-7 rounded-full ${
        comment.isLiked ? 'text-primary' : 'text-muted-foreground'
      }`}
      aria-label="高評価"
    >
      <ThumbsUp
        className={`h-3.5 w-3.5 ${comment.isLiked ? 'fill-current' : ''}`}
      />
    </Button>
    {comment.likes > 0 && (
      <span className="text-muted-foreground text-xs">{comment.likes}</span>
    )}
    <Button
      variant="ghost"
      size="icon"
      className="text-muted-foreground hover:bg-muted h-7 w-7 rounded-full"
      aria-label="低評価"
    >
      <ThumbsDown className="h-3.5 w-3.5" />
    </Button>
    <button
      type="button"
      className="text-muted-foreground hover:text-foreground cursor-pointer text-xs font-medium"
    >
      返信
    </button>
  </div>
)

export const VideoCommentItem = ({
  comment,
  onToggleLike,
}: VideoCommentItemProps) => (
  <div className="flex gap-3">
    <img
      src={comment.authorAvatarUrl}
      alt={comment.authorName}
      className="h-9 w-9 shrink-0 rounded-full object-cover"
    />
    <div className="flex-1 space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold">{comment.authorName}</span>
        <span className="text-muted-foreground text-[11px]">
          {comment.createdAt}
        </span>
      </div>
      <p className="text-xs leading-relaxed sm:text-sm">{comment.content}</p>
      <CommentReactions comment={comment} onToggleLike={onToggleLike} />
    </div>
  </div>
)
