import { useRef } from 'react'
import type { RefObject } from 'react'

import { VideoPlayerControls } from '~/feature/video/components/player/VideoPlayerControls'
import { useAutoHideControls } from '~/feature/video/hooks/useAutoHideControls'
import { useHls } from '~/feature/video/hooks/useHls'
import { useVideoControls } from '~/feature/video/hooks/useVideoControls'

interface VideoPlayerProps {
  src: string
  poster?: string
}

const VideoMedia = ({
  videoRef,
  poster,
  onTimeUpdate,
  onLoadedMetadata,
  onTogglePlay,
}: {
  videoRef: RefObject<HTMLVideoElement | null>
  poster?: string
  onTimeUpdate: () => void
  onLoadedMetadata: () => void
  onTogglePlay: () => void
}) => (
  <button
    type="button"
    onClick={onTogglePlay}
    className="h-full w-full cursor-pointer border-0 bg-transparent p-0"
    aria-label="動画の再生または一時停止"
  >
    <video
      ref={videoRef}
      poster={poster}
      onTimeUpdate={onTimeUpdate}
      onLoadedMetadata={onLoadedMetadata}
      className="h-full w-full object-cover"
      playsInline
    >
      <track kind="captions" />
    </video>
  </button>
)

export const VideoPlayer = ({ src, poster }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useHls(videoRef, src)

  const controls = useVideoControls(videoRef, containerRef)
  const { showControls } = useAutoHideControls(controls.isPlaying, containerRef)

  return (
    <div
      ref={containerRef}
      className="group relative aspect-video w-full overflow-hidden rounded-xl bg-black shadow-lg"
    >
      <VideoMedia
        videoRef={videoRef}
        poster={poster}
        onTimeUpdate={controls.handleTimeUpdate}
        onLoadedMetadata={controls.handleLoadedMetadata}
        onTogglePlay={controls.togglePlay}
      />
      <VideoPlayerControls showControls={showControls} controls={controls} />
    </div>
  )
}
