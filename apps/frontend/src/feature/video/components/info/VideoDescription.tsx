import React, { type Dispatch } from 'react'

import type { VideoResponse } from '~/api/generated/models'

interface VideoDescriptionProps {
  video: VideoResponse
  isExpanded: boolean
  setIsExpanded: Dispatch<React.SetStateAction<boolean>>
}

export const VideoDescription = ({
  video,
  isExpanded,
  setIsExpanded,
}: VideoDescriptionProps) => {
  return (
    <div className="bg-muted/60 hover:bg-muted/80 rounded-xl p-3 text-sm transition-colors">
      <div className="flex flex-wrap items-center gap-2 text-xs font-bold sm:text-sm">
        <span>視聴回数：{'TODO'}</span>
        <span>{'TODO'}</span>
        <div className="flex flex-wrap gap-1">
          {/*{video.tags.map((tag) => (*/}
          {/*  <span*/}
          {/*    key={tag}*/}
          {/*    className="text-primary cursor-pointer hover:underline"*/}
          {/*  >*/}
          {/*    #{tag}*/}
          {/*  </span>*/}
          {/*))}*/}
        </div>
      </div>

      <div
        className={`mt-2 text-xs leading-relaxed whitespace-pre-line sm:text-sm ${
          isExpanded ? '' : 'line-clamp-3'
        }`}
      >
        {video.description}
      </div>

      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="text-foreground/80 hover:text-foreground mt-2 cursor-pointer text-xs font-semibold"
      >
        {isExpanded ? '一部を表示' : '...もっと見る'}
      </button>
    </div>
  )
}
