import { ArrowUpDown } from 'lucide-react'

interface VideoCommentsHeaderProps {
  totalCount: number
}

export const VideoCommentsHeader = ({
  totalCount,
}: VideoCommentsHeaderProps) => {
  return (
    <div className="flex items-center gap-6">
      <h3 className="text-lg font-bold">コメント {totalCount}件</h3>
      <button
        type="button"
        className="hover:text-primary flex cursor-pointer items-center gap-2 text-xs font-semibold"
      >
        <ArrowUpDown className="h-4 w-4" />
        <span>並べ替え</span>
      </button>
    </div>
  )
}
