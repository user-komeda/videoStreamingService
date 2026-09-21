import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

interface AutoHideOptions {
  el: HTMLElement
  isPlaying: boolean
  hideDelay: number
  setShowControls: (show: boolean) => void
  timeoutRef: { current: NodeJS.Timeout | null }
}

const setupAutoHideListeners = ({
  el,
  isPlaying,
  hideDelay,
  setShowControls,
  timeoutRef,
}: AutoHideOptions) => {
  const onMouseMove = () => {
    setShowControls(true)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, hideDelay)
  }

  const onMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false)
    }
  }

  el.addEventListener('mousemove', onMouseMove)
  el.addEventListener('mouseleave', onMouseLeave)

  return () => {
    el.removeEventListener('mousemove', onMouseMove)
    el.removeEventListener('mouseleave', onMouseLeave)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }
}

export const useAutoHideControls = (
  isPlaying: boolean,
  containerRef: RefObject<HTMLElement | null>,
  hideDelay = 2500,
) => {
  const [showControls, setShowControls] = useState(true)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) {
      return
    }

    return setupAutoHideListeners({
      el,
      isPlaying,
      hideDelay,
      setShowControls,
      timeoutRef: controlsTimeoutRef,
    })
  }, [containerRef, hideDelay, isPlaying])

  return { showControls }
}
