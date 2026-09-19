import { useState } from 'react'

import { useSuspenseQuery } from '@tanstack/react-query'

import { Header } from '~/components/header/Header'
import { Sidebar } from '~/components/sidebar/Sidebar'
import { CategoryPills } from '~/feature/home/components/CategoryPills'
import { ShortsSection } from '~/feature/home/components/ShortsSection'
import { VideoCard } from '~/feature/home/components/VideoCard'
import { videoListQuery } from '~/feature/video/queries'

import type { VideoResponse } from '~/api/generated/models'

const MainContent = ({ videos }: { videos: VideoResponse[] }) => (
  <main className="flex-1 overflow-x-hidden">
    <CategoryPills categories={[]} />
    <div className="space-y-6 p-4 sm:p-6">
      <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
      <ShortsSection shorts={[]} />
    </div>
  </main>
)

export const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)

  const { data: rawVideos } = useSuspenseQuery(videoListQuery())

  const handleToggleLogin = () => {
    setIsLoggedIn((prev) => !prev)
  }

  const handleToggleSidebar = () => {
    setIsSidebarExpanded((prev) => !prev)
  }

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Header
        isLoggedIn={isLoggedIn}
        onToggleLogin={handleToggleLogin}
        onToggleSidebar={handleToggleSidebar}
      />
      <div className="flex flex-1">
        <Sidebar
          isExpanded={isSidebarExpanded}
          isLoggedIn={isLoggedIn}
          onToggleLogin={handleToggleLogin}
        />
        <MainContent videos={rawVideos} />
      </div>
    </div>
  )
}
