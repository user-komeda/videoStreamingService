import { Link } from 'react-router'

import { ExternalLink, Pencil, Trash2 } from 'lucide-react'

import { Badge } from '~/components/ui/badge'
import { Button, buttonVariants } from '~/components/ui/button'
import { formatDuration } from '~/util/format'

import type { VideoResponse } from '~/api/generated/models'

type Props = {
  video: VideoResponse
  onEdit: (video: VideoResponse) => void
  onDelete: (video: VideoResponse) => void
}

const getVisibilityBadge = (visibility?: string) => {
  if (visibility === 'public') {
    return <Badge variant="default">公開</Badge>
  }
  if (visibility === 'unlisted') {
    return <Badge variant="secondary">限定公開</Badge>
  }
  if (visibility === 'private') {
    return <Badge variant="outline">非公開</Badge>
  }
  return <Badge variant="secondary">{visibility ?? '未設定'}</Badge>
}

const RowActions = ({
  video,
  onEdit,
  onDelete,
}: {
  video: VideoResponse
  onEdit: (video: VideoResponse) => void
  onDelete: (video: VideoResponse) => void
}) => (
  <div className="flex items-center justify-end gap-1">
    {video.id && (
      <Link
        to={`/videos/${video.id}`}
        title="動画詳細を見る"
        className={buttonVariants({ variant: 'ghost', size: 'icon' })}
      >
        <ExternalLink className="size-4" />
      </Link>
    )}
    <Button
      variant="ghost"
      size="icon"
      onClick={() => onEdit(video)}
      title="編集"
      className="size-8"
    >
      <Pencil className="size-4" />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      onClick={() => onDelete(video)}
      title="削除"
      className="text-destructive hover:text-destructive hover:bg-destructive/10 size-8"
    >
      <Trash2 className="size-4" />
    </Button>
  </div>
)

export const UploadedVideoRow = ({ video, onEdit, onDelete }: Props) => {
  const formattedDuration =
    video.duration_ms && video.duration_ms > 0
      ? formatDuration(video.duration_ms)
      : '-'

  const formattedSize = video.file_size
    ? `${Math.round(video.file_size / 1024 / 1024)} MB`
    : '-'

  return (
    <tr className="border-border/60 hover:bg-muted/30 border-b transition-colors">
      <td className="text-foreground p-4 font-medium">
        <div className="flex flex-col">
          <span className="font-semibold">{video.title || '無題'}</span>
          <span className="text-muted-foreground line-clamp-1 text-xs">
            {video.description || '説明なし'}
          </span>
        </div>
      </td>
      <td className="p-4">{getVisibilityBadge(video.visibility)}</td>
      <td className="text-muted-foreground p-4 text-sm">
        {video.status ?? 'アップロード済'}
      </td>
      <td className="text-muted-foreground p-4 text-sm">{formattedDuration}</td>
      <td className="text-muted-foreground p-4 text-sm">{formattedSize}</td>
      <td className="p-4">
        <RowActions video={video} onEdit={onEdit} onDelete={onDelete} />
      </td>
    </tr>
  )
}
