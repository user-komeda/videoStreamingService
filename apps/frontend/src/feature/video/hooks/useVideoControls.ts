import { useState } from 'react'
import type { ChangeEvent, RefObject } from 'react'

import { useVideoFullscreen } from '~/feature/video/hooks/useVideoFullscreen'
import { useVideoVolume } from '~/feature/video/hooks/useVideoVolume'

const setMediaTime = (el: HTMLVideoElement | null, time: number) => {
  if (el) {
    el.currentTime = time
  }
}

const seekVideo = (
  el: HTMLVideoElement | null,
  e: ChangeEvent<HTMLInputElement>,
  setCurrentTime: (time: number) => void,
) => {
  const time = Number(e.target.value)
  setMediaTime(el, time)
  setCurrentTime(time)
}

export const useVideoControls = (
  videoRef: RefObject<HTMLVideoElement | null>,
  containerRef: RefObject<HTMLDivElement | null>,
) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) {
      return
    }
    if (video.paused) {
      void video.play()?.then(
        () => setIsPlaying(true),
        () => setIsPlaying(false),
      )
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  return {
    isPlaying,
    currentTime,
    duration,
    ...useVideoVolume(videoRef),
    ...useVideoFullscreen(containerRef),
    togglePlay,
    handleTimeUpdate: () => setCurrentTime(videoRef.current?.currentTime ?? 0),
    handleLoadedMetadata: () => setDuration(videoRef.current?.duration ?? 0),
    handleSeek: (e: ChangeEvent<HTMLInputElement>) =>
      seekVideo(videoRef.current, e, setCurrentTime),
    restartVideo: () => setMediaTime(videoRef.current, 0),
  }
}
