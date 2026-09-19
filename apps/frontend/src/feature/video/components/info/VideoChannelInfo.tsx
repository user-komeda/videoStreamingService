import { Check } from 'lucide-react'

import { Button } from '~/components/ui/button'

import type { VideoResponse } from '~/api/generated/models'

interface VideoChannelInfoProps {
  video: VideoResponse
  isSubscribed: boolean
  onToggleSubscribe: () => void
}

export const VideoChannelInfo = ({
  video: _video,
  isSubscribed,
  onToggleSubscribe,
}: VideoChannelInfoProps) => (
  <div className="flex items-center gap-3">
    {/*<img*/}
    {/*  src={video.channelAvatarUrl}*/}
    {/*  alt={video.channelName}*/}
    {/*  className="h-10 w-10 rounded-full object-cover"*/}
    {/*/>*/}
    <div>
      <h2 className="cursor-pointer text-sm font-semibold hover:underline">
        {'TODO'}
      </h2>
      <p className="text-muted-foreground text-xs">{'TODO'}</p>
    </div>
    <Button
      variant={isSubscribed ? 'secondary' : 'default'}
      size="sm"
      onClick={onToggleSubscribe}
      className="ml-2 rounded-full px-4 text-xs font-semibold"
    >
      {isSubscribed ? (
        <span className="flex items-center gap-1">
          <Check className="h-3.5 w-3.5" /> 登録済み
        </span>
      ) : (
        'チャンネル登録'
      )}
    </Button>
  </div>
)
