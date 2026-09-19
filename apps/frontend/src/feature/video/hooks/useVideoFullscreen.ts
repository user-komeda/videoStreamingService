import { useState } from 'react'
import type { RefObject } from 'react'

export const useVideoFullscreen = (
  containerRef: RefObject<HTMLDivElement | null>,
) => {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = async () => {
    if (!containerRef.current) {
      return
    }
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else {
      await document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return { isFullscreen, toggleFullscreen }
}
