import { VideoCommentForm } from '~/feature/video/components/comments/VideoCommentForm'
import { VideoCommentItem } from '~/feature/video/components/comments/VideoCommentItem'
import { VideoCommentsHeader } from '~/feature/video/components/comments/VideoCommentsHeader'
import { useComments } from '~/feature/video/hooks/useComments'

interface CommentItem {
  id: string
  authorName: string
  authorAvatarUrl: string
  content: string
  createdAt: string
  likes: number
  isLiked?: boolean
}

interface VideoCommentsProps {
  comments: CommentItem[]
  totalCount: number
}

export const VideoComments = ({
  comments: initialComments,
  totalCount: initialTotalCount,
}: VideoCommentsProps) => {
  const { comments, totalCount, addComment, handleToggleLike } = useComments({
    initialComments,
    initialTotalCount,
  })

  return (
    <div className="space-y-6 pt-4">
      {/* コメント数 & ソート */}
      <VideoCommentsHeader totalCount={totalCount} />

      {/* コメント投稿フォーム */}
      <VideoCommentForm onSubmit={addComment} />

      {/* コメントリスト */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <VideoCommentItem
            key={comment.id}
            comment={comment}
            onToggleLike={handleToggleLike}
          />
        ))}
      </div>
    </div>
  )
}
