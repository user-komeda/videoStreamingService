import {
  Bookmark,
  Download,
  MoreHorizontal,
  Scissors,
  Share2,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react'

import { Button } from '~/components/ui/button'

import type { LucideIcon } from 'lucide-react'

interface LikeDislikeGroupProps {
  isLiked: boolean
  isDisliked: boolean
  likeCount: number
  onToggleLike: () => void
  onToggleDislike: () => void
}

const ACTIONS: { icon: LucideIcon; label: string; className: string }[] = [
  { icon: Share2, label: '共有', className: 'flex' },
  { icon: Scissors, label: 'クリップ', className: 'hidden sm:flex' },
  { icon: Bookmark, label: '保存', className: 'hidden md:flex' },
  { icon: Download, label: 'ダウンロード', className: 'hidden lg:flex' },
]

const LikeDislikeGroup = ({
  isLiked,
  isDisliked,
  likeCount,
  onToggleLike,
  onToggleDislike,
}: LikeDislikeGroupProps) => (
  <div className="bg-secondary text-secondary-foreground flex items-center rounded-full">
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggleLike}
      className={`flex items-center gap-1.5 rounded-l-full rounded-r-none px-3 text-xs font-medium hover:bg-black/10 dark:hover:bg-white/10 ${
        isLiked ? 'text-primary font-bold' : ''
      }`}
    >
      <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
      <span>{likeCount.toLocaleString()}</span>
    </Button>
    <div className="bg-border h-4 w-px" />
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggleDislike}
      className={`rounded-l-none rounded-r-full px-3 text-xs hover:bg-black/10 dark:hover:bg-white/10 ${
        isDisliked ? 'text-primary' : ''
      }`}
      aria-label="低評価"
    >
      <ThumbsDown className={`h-4 w-4 ${isDisliked ? 'fill-current' : ''}`} />
    </Button>
  </div>
)

const ActionItems = () => (
  <>
    {ACTIONS.map(({ icon: Icon, label, className }) => (
      <Button
        key={label}
        variant="secondary"
        size="sm"
        className={`items-center gap-1.5 rounded-full px-3 text-xs font-medium ${className}`}
      >
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </Button>
    ))}
    <Button
      variant="secondary"
      size="icon"
      className="h-8 w-8 rounded-full"
      aria-label="その他のアクション"
    >
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  </>
)

export const VideoActionButtons = (props: LikeDislikeGroupProps) => (
  <div className="flex flex-wrap items-center gap-2">
    <LikeDislikeGroup {...props} />
    <ActionItems />
  </div>
)
