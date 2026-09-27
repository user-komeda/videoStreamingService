import { Suspense } from 'react'
import type { ActionFunctionArgs, MetaFunction } from 'react-router'
import { useLoaderData } from 'react-router'

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'

import { postVideos } from '~/api/generated/endpoints'
import { PostVideosBody } from '~/api/generated/zod'
import { VideoList } from '~/feature/video/components/list/VideoList'
import { videoListQuery } from '~/feature/video/queries'
import { parseFormData } from '~/util/parseFormData'

import type { VideoActionResult } from '~/feature/video/types/type'

export const meta: MetaFunction = () => {
  return [
    { title: 'Video Streaming Service' },
    { name: 'description', content: 'Explore and watch the latest videos.' },
  ]
}

export const loader = async () => {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery(videoListQuery())

  return {
    dehydratedState: dehydrate(queryClient),
  }
}

export const action = async ({
  request,
}: ActionFunctionArgs): Promise<Response | VideoActionResult> => {
  const formData = await request.formData()
  const parseResult = parseFormData(formData, PostVideosBody)

  if (!parseResult.success) {
    const issue = parseResult.error.issues[0]
    return {
      success: false,
      error: issue?.message || '入力内容に誤りがあります',
    }
  }

  try {
    const res = await postVideos(parseResult.data, { signal: request.signal })

    if (res.status === 201 && res.data.id) {
      return { success: true, videoId: res.data.id }
    }
    return { success: false, error: '動画メタデータの作成に失敗しました' }
  } catch {
    return { success: false, error: '通信エラーが発生しました' }
  }
}

const Route = () => {
  const { dehydratedState } = useLoaderData<typeof loader>()

  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense
        fallback={
          <div className="text-muted-foreground py-10 text-center">
            動画を読み込み中...
          </div>
        }
      >
        <VideoList />
      </Suspense>
    </HydrationBoundary>
  )
}

export default Route
