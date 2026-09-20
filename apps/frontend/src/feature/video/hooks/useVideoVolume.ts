import { useState } from 'react'
import type { ChangeEvent, RefObject } from 'react'

const setMediaVolume = (el: HTMLVideoElement | null, vol: number) => {
  if (el) {
    el.volume = vol
  }
}

const setMediaMuted = (el: HTMLVideoElement | null, muted: boolean) => {
  if (el) {
    el.muted = muted
  }
}

export const useVideoVolume = (
  videoRef: RefObject<HTMLVideoElement | null>,
) => {
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)

  const toggleMute = () => {
    setMediaMuted(videoRef.current, !isMuted)
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value)
    setMediaVolume(videoRef.current, newVolume)
    setMediaMuted(videoRef.current, newVolume === 0)
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  return { volume, isMuted, toggleMute, handleVolumeChange }
}
