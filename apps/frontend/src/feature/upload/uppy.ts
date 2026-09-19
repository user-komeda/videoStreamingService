import Uppy from '@uppy/core'
import Tus from '@uppy/tus'

export const getVideoDurationMs = (file: Blob): Promise<number> => {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    const url = URL.createObjectURL(file)

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url)
      if (!isNaN(video.duration) && video.duration > 0) {
        resolve(Math.round(video.duration * 1000))
      } else {
        resolve(0)
      }
    }

    video.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(0)
    }

    video.src = url
  })
}

export const createUppy = () => {
  const uppy = new Uppy({ debug: true, autoProceed: false }).use(Tus, {
    endpoint: 'http://localhost:8080/files/',
  })

  uppy.on('file-added', (file) => {
    if (file.data instanceof Blob) {
      void getVideoDurationMs(file.data).then((durationMs) => {
        if (durationMs > 0) {
          uppy.setFileMeta(file.id, { durationMs: String(durationMs) })
        }
      })
    }
  })

  return uppy
}
