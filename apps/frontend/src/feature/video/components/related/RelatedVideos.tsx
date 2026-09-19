import { useState } from 'react'

import { RelatedVideoCard } from '~/feature/video/components/related/RelatedVideoCard'
import { RelatedVideoFilters } from '~/feature/video/components/related/RelatedVideoFilters'

interface RelatedVideoItem {
  id: string
  title: string
  thumbnailUrl: string
  channelName: string
  views: string
  uploadedAt: string
  duration: string
  isLive?: boolean
}

interface RelatedVideosProps {
  videos?: RelatedVideoItem[]
}

export const RelatedVideos = ({ videos = [] }: RelatedVideosProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('TODO')

  return (
    <div className="space-y-4">
      {/* フィルターピル */}
      <RelatedVideoFilters
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* 関連動画リスト */}
      <div className="space-y-3">
        {videos.map((video) => (
          <RelatedVideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  )
}
