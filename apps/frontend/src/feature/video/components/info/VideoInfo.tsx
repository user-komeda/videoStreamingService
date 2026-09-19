import { VideoActionButtons } from '~/feature/video/components/info/VideoActionButtons'
import { VideoChannelInfo } from '~/feature/video/components/info/VideoChannelInfo'
import { useSubscription } from '~/feature/video/hooks/useSubscription'
import { useVideoReaction } from '~/feature/video/hooks/useVideoReaction'

import type { VideoResponse } from '~/api/generated/models'

interface VideoInfoProps {
  video: VideoResponse
}

export const VideoInfo = ({ video }: VideoInfoProps) => {
  const { isSubscribed, handleToggleSubscribe } = useSubscription({
    initialIsSubscribed: false,
  })

  const reaction = useVideoReaction({
    initialLikes: 0,
    initialIsLiked: false,
    initialIsDisliked: false,
  })

  return (
    <div className="space-y-3 pt-3">
      <h1 className="text-lg font-bold sm:text-xl md:text-2xl">
        {video.title}
      </h1>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <VideoChannelInfo
          video={video}
          isSubscribed={isSubscribed}
          onToggleSubscribe={handleToggleSubscribe}
        />
        <VideoActionButtons
          isLiked={reaction.isLiked}
          isDisliked={reaction.isDisliked}
          likeCount={reaction.likeCount}
          onToggleLike={reaction.handleToggleLike}
          onToggleDislike={reaction.handleToggleDislike}
        />
      </div>
    </div>
  )
}
