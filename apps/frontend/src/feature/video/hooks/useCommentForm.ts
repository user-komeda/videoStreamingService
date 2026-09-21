import { useState } from 'react'

interface UseCommentFormProps {
  onSubmit: (content: string) => void
}

export const useCommentForm = ({ onSubmit }: UseCommentFormProps) => {
  const [commentInput, setCommentInput] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = () => setIsFocused(true)

  const handleCancel = () => {
    setCommentInput('')
    setIsFocused(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentInput.trim()) {
      return
    }

    onSubmit(commentInput)
    setCommentInput('')
    setIsFocused(false)
  }

  return {
    commentInput,
    setCommentInput,
    isFocused,
    handleFocus,
    handleCancel,
    handleSubmit,
    canSubmit: commentInput.trim().length > 0,
  }
}
