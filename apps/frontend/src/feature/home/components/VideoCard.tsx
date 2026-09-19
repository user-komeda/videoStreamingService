import { Link } from 'react-router'

import { formatDuration } from '~/util/format'

import type { VideoResponse } from '~/api/generated/models'

interface VideoCardProps {
  video: VideoResponse
}

const VideoThumbnail = ({ durationMs }: { durationMs?: number }) => {
  const formattedDuration =
    durationMs && durationMs > 0 ? formatDuration(durationMs) : null

  return (
    <div className="bg-muted relative aspect-video w-full overflow-hidden rounded-xl">
      {formattedDuration && (
        <span className="absolute right-2 bottom-2 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-semibold text-white">
          {formattedDuration}
        </span>
      )}
    </div>
  )
}

export const VideoCard = ({ video }: VideoCardProps) => (
  <Link
    to={`/videos/${video.id}`}
    className="group flex cursor-pointer flex-col gap-3"
  >
    <VideoThumbnail durationMs={video.duration_ms} />
    <div className="flex gap-3">
      <div className="flex flex-col">
        <h3 className="group-hover:text-primary line-clamp-2 text-sm leading-snug font-semibold">
          {video.title}
        </h3>
      </div>
    </div>
  </Link>
)
