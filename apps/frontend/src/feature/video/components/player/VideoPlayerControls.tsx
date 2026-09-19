import type { ChangeEvent } from 'react'

import {
  FullscreenButtons,
  PlaybackButton,
  VolumeControl,
} from '~/feature/video/components/player/VideoPlayerActionRow'

import type { useVideoControls } from '~/feature/video/hooks/useVideoControls'

const formatTime = (seconds: number) => {
  if (isNaN(seconds)) {
    return '0:00'
  }
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

const ProgressBar = ({
  duration,
  currentTime,
  onSeek,
}: {
  duration: number
  currentTime: number
  onSeek: (e: ChangeEvent<HTMLInputElement>) => void
}) => (
  <input
    type="range"
    min={0}
    max={duration || 100}
    value={currentTime}
    onChange={onSeek}
    className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/30 accent-red-600 transition-all hover:h-2.5"
    aria-label="再生位置"
  />
)

const ControlsLeftActions = ({
  controls,
}: {
  controls: ReturnType<typeof useVideoControls>
}) => (
  <div className="flex items-center gap-3">
    <PlaybackButton
      isPlaying={controls.isPlaying}
      onTogglePlay={controls.togglePlay}
    />
    <VolumeControl
      isMuted={controls.isMuted}
      volume={controls.volume}
      onToggleMute={controls.toggleMute}
      onVolumeChange={controls.handleVolumeChange}
    />
    <div className="text-xs font-medium">
      <span>{formatTime(controls.currentTime)}</span>
      <span className="mx-1 text-white/60">/</span>
      <span className="text-white/60">{formatTime(controls.duration)}</span>
    </div>
  </div>
)

const ControlsBottomBar = ({
  controls,
}: {
  controls: ReturnType<typeof useVideoControls>
}) => (
  <div className="space-y-2">
    <ProgressBar
      duration={controls.duration}
      currentTime={controls.currentTime}
      onSeek={controls.handleSeek}
    />

    <div className="flex items-center justify-between text-white">
      <ControlsLeftActions controls={controls} />
      <FullscreenButtons
        isFullscreen={controls.isFullscreen}
        onRestart={controls.restartVideo}
        onToggleFullscreen={() => {
          void controls.toggleFullscreen()
        }}
      />
    </div>
  </div>
)

export const VideoPlayerControls = ({
  showControls,
  controls,
}: {
  showControls: boolean
  controls: ReturnType<typeof useVideoControls>
}) => (
  <div
    className={`pointer-events-none absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/80 via-transparent to-black/20 p-4 transition-opacity duration-300 ${
      showControls ? 'opacity-100' : 'opacity-0'
    }`}
  >
    <div className="flex justify-end">
      <span className="rounded bg-black/60 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur">
        4K 60fps
      </span>
    </div>
    <div className="pointer-events-auto">
      <ControlsBottomBar controls={controls} />
    </div>
  </div>
)
