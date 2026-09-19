import { useState } from 'react'

export interface CommentItem {
  id: string
  authorName: string
  authorAvatarUrl: string
  content: string
  createdAt: string
  likes: number
  isLiked?: boolean
}

interface UseCommentsProps {
  initialComments: CommentItem[]
  initialTotalCount: number
}

const createNewComment = (content: string): CommentItem => ({
  id: `c_${Date.now()}`,
  authorName: '',
  authorAvatarUrl:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
  content,
  createdAt: 'たった今',
  likes: 0,
  isLiked: false,
})

const toggleCommentLike = (c: CommentItem): CommentItem => {
  const isLiked = !c.isLiked
  return {
    ...c,
    isLiked,
    likes: isLiked ? c.likes + 1 : c.likes - 1,
  }
}

export const useComments = ({
  initialComments,
  initialTotalCount,
}: UseCommentsProps) => {
  const [comments, setComments] = useState<CommentItem[]>(initialComments)

  const addComment = (content: string) => {
    const trimmed = content.trim()
    if (!trimmed) {
      return
    }
    setComments((prev) => [createNewComment(trimmed), ...prev])
  }

  const handleToggleLike = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? toggleCommentLike(c) : c)),
    )
  }

  return {
    comments,
    totalCount: initialTotalCount + (comments.length - initialComments.length),
    addComment,
    handleToggleLike,
  }
}
