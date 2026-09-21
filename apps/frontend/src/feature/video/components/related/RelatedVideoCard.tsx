import { Link } from 'react-router'

export interface RelatedVideoItem {
  id: string
  title: string
  thumbnailUrl: string
  channelName: string
  views: string
  uploadedAt: string
  duration: string
  isLive?: boolean
}
interface RelatedVideoCardProps {
  video: RelatedVideoItem
}

const RelatedVideoThumbnail = ({ video }: RelatedVideoCardProps) => (
  <div className="bg-muted relative aspect-video w-40 shrink-0 overflow-hidden rounded-lg">
    {/*<img*/}
    {/*  src={video.thumbnailUrl}*/}
    {/*  alt={video.title}*/}
    {/*  className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"*/}
    {/*/>*/}
    <span
      className={`absolute right-1.5 bottom-1.5 rounded px-1 py-0.5 text-[10px] font-semibold text-white ${
        video.isLive ? 'bg-red-600' : 'bg-black/80'
      }`}
    >
      {'TODO'}
    </span>
  </div>
)

const RelatedVideoMeta = ({ video }: RelatedVideoCardProps) => (
  <div className="flex flex-1 flex-col justify-start">
    <h4 className="group-hover:text-primary line-clamp-2 text-xs leading-snug font-semibold">
      {video.title}
    </h4>
    <p className="text-muted-foreground mt-1 text-[11px] hover:underline">
      {video.channelName}
    </p>
    <div className="text-muted-foreground flex items-center gap-1 text-[11px]">
      <span>{video.views}</span>
      {!video.isLive && (
        <>
          <span>•</span>
          <span>{video.uploadedAt}</span>
        </>
      )}
    </div>
  </div>
)

export const RelatedVideoCard = ({ video }: RelatedVideoCardProps) => (
  <Link
    to={`/video/${video.id}`}
    className="group hover:bg-muted/40 flex gap-2.5 rounded-xl p-1.5 transition-colors"
  >
    <RelatedVideoThumbnail video={video} />
    <RelatedVideoMeta video={video} />
  </Link>
)
