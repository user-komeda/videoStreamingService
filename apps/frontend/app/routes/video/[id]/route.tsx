import { Suspense } from 'react'
import type { LoaderFunctionArgs } from 'react-router'
import { useLoaderData } from 'react-router'

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'

import { videoDetailQuery } from '~/feature/video/queries'
import { VideoDetail } from '~/feature/video/video'

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const queryClient = new QueryClient()
  if (params.id) {
    await queryClient.prefetchQuery(videoDetailQuery(params.id))
  }

  return {
    dehydratedState: dehydrate(queryClient),
  }
}

const Route = () => {
  const { dehydratedState } = useLoaderData<typeof loader>()

  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense
        fallback={
          <div className="text-muted-foreground py-10 text-center">
            動画情報を読み込み中...
          </div>
        }
      >
        <VideoDetail />
      </Suspense>
    </HydrationBoundary>
  )
}

export default Route
