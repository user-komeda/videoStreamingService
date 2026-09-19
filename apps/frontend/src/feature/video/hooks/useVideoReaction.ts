import { useState } from 'react'

interface UseVideoReactionProps {
  initialLikes: number
  initialIsLiked?: boolean
  initialIsDisliked?: boolean
}

export const useVideoReaction = ({
  initialLikes,
  initialIsLiked = false,
  initialIsDisliked = false,
}: UseVideoReactionProps) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [isDisliked, setIsDisliked] = useState(initialIsDisliked)
  const [likeCount, setLikeCount] = useState(initialLikes)

  const handleToggleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
    if (!isLiked && isDisliked) {
      setIsDisliked(false)
    }
  }

  const handleToggleDislike = () => {
    setIsDisliked(!isDisliked)
    if (!isDisliked && isLiked) {
      setIsLiked(false)
      setLikeCount((prev) => prev - 1)
    }
  }

  return {
    isLiked,
    isDisliked,
    likeCount,
    handleToggleLike,
    handleToggleDislike,
  }
}
