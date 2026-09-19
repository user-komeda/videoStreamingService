import type { ChangeEvent } from 'react'

import {
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from 'lucide-react'

import { Button } from '~/components/ui/button'

export const PlaybackButton = ({
  isPlaying,
  onTogglePlay,
}: {
  isPlaying: boolean
  onTogglePlay: () => void
}) => (
  <Button
    variant="ghost"
    size="icon"
    onClick={onTogglePlay}
    className="h-8 w-8 text-white hover:bg-white/20 hover:text-white"
    aria-label={isPlaying ? '一時停止' : '再生'}
  >
    {isPlaying ? (
      <Pause className="h-5 w-5 fill-current" />
    ) : (
      <Play className="h-5 w-5 fill-current" />
    )}
  </Button>
)

export const VolumeControl = ({
  isMuted,
  volume,
  onToggleMute,
  onVolumeChange,
}: {
  isMuted: boolean
  volume: number
  onToggleMute: () => void
  onVolumeChange: (e: ChangeEvent<HTMLInputElement>) => void
}) => (
  <div className="flex items-center gap-1.5">
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggleMute}
      className="h-8 w-8 text-white hover:bg-white/20 hover:text-white"
      aria-label={isMuted ? 'ミュート解除' : 'ミュート'}
    >
      {isMuted || volume === 0 ? (
        <VolumeX className="h-5 w-5" />
      ) : (
        <Volume2 className="h-5 w-5" />
      )}
    </Button>
    <input
      type="range"
      min={0}
      max={1}
      step={0.05}
      value={isMuted ? 0 : volume}
      onChange={onVolumeChange}
      className="h-1 w-16 cursor-pointer appearance-none rounded bg-white/40 accent-white"
      aria-label="音量"
    />
  </div>
)

export const FullscreenButtons = ({
  isFullscreen,
  onRestart,
  onToggleFullscreen,
}: {
  isFullscreen: boolean
  onRestart: () => void
  onToggleFullscreen: () => void
}) => (
  <div className="flex items-center gap-2">
    <Button
      variant="ghost"
      size="icon"
      onClick={onRestart}
      className="h-8 w-8 text-white hover:bg-white/20 hover:text-white"
      aria-label="最初から再生"
    >
      <RotateCcw className="h-4 w-4" />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggleFullscreen}
      className="h-8 w-8 text-white hover:bg-white/20 hover:text-white"
      aria-label={isFullscreen ? '全画面解除' : '全画面'}
    >
      {isFullscreen ? (
        <Minimize className="h-5 w-5" />
      ) : (
        <Maximize className="h-5 w-5" />
      )}
    </Button>
  </div>
)
