import { useState } from 'react'
import { Link, useParams } from 'react-router'

import { useQuery } from '@tanstack/react-query'

import { Header } from '~/components/header/Header'
import { buttonVariants } from '~/components/ui/button'
import { VideoComments } from '~/feature/video/components/comments/VideoComments'
import { VideoDescription } from '~/feature/video/components/info/VideoDescription'
import { VideoInfo } from '~/feature/video/components/info/VideoInfo'
import { VideoPlayer } from '~/feature/video/components/player/VideoPlayer'
import { RelatedVideos } from '~/feature/video/components/related/RelatedVideos'
import { videoDetailQuery } from '~/feature/video/queries'
import { getEnv } from '~/util/clientEnv'

import type { VideoResponse } from '~/api/generated/models'

const VideoMainContent = ({
  video,
  isExpanded,
  setIsExpanded,
}: {
  video: VideoResponse
  isExpanded: boolean
  setIsExpanded: (expanded: boolean | ((prev: boolean) => boolean)) => void
}) => (
  <div className="min-w-0 flex-1 space-y-4">
    <VideoPlayer
      src={`${getEnv().VITE_API_BASE_URL}/videos/${video.id}/stream`}
    />
    <VideoInfo video={video} />
    <VideoDescription
      isExpanded={isExpanded}
      setIsExpanded={setIsExpanded}
      video={video}
    />
    <VideoComments comments={[]} totalCount={0} />
  </div>
)

const VideoNotFound = () => (
  <div className="flex-1 p-12 text-center">
    <h2 className="text-2xl font-bold">動画が見つかりませんでした</h2>
    <p className="text-muted-foreground mt-2">
      指定された動画は削除されたか、存在しない可能性があります。
    </p>
    <Link to="/upload" className={buttonVariants({ className: 'mt-6' })}>
      アップロード一覧へ戻る
    </Link>
  </div>
)

export const VideoDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const { data: video, isLoading } = useQuery(videoDetailQuery(id ?? ''))

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Header
        isLoggedIn={isLoggedIn}
        onToggleLogin={() => setIsLoggedIn((prev) => !prev)}
        onToggleSidebar={() => {}}
      />
      <main className="flex-1 p-4 lg:p-6">
        {isLoading && (
          <div className="text-muted-foreground p-12 text-center">
            動画情報を読み込み中...
          </div>
        )}
        {!isLoading && !video && <VideoNotFound />}
        {!isLoading && video && (
          <div className="mx-auto flex max-w-[1750px] flex-col gap-6 lg:flex-row">
            <VideoMainContent
              video={video}
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
            />
            <aside className="w-full shrink-0 lg:w-[380px] xl:w-[420px]">
              <RelatedVideos videos={[]} />
            </aside>
          </div>
        )}
      </main>
    </div>
  )
}
