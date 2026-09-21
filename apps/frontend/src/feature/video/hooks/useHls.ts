/* eslint-disable import/no-named-as-default, import/no-named-as-default-member -- hls.js exports class default and static members */
import { useEffect } from 'react'
import type { RefObject } from 'react'

import Hls from 'hls.js'

export const useHls = (
  videoRef: RefObject<HTMLVideoElement | null>,
  src: string,
) => {
  useEffect(() => {
    const video = videoRef.current
    if (!video) {
      return
    }

    let hls: Hls | null = null

    if (Hls.isSupported() && src.endsWith('.m3u8')) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      })
      hls.loadSource(src)
      hls.attachMedia(video)
    } else {
      video.setAttribute('src', src)
    }

    return () => {
      if (hls) {
        hls.destroy()
      }
    }
  }, [src, videoRef])
}
