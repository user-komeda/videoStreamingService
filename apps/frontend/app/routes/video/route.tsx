import type { ActionFunctionArgs } from 'react-router'

import { QueryClient } from '@tanstack/react-query'

import { postVideos } from '~/api/generated/endpoints'
import { PostVideosBody } from '~/api/generated/zod'
import { videoListQuery } from '~/feature/video/queries'
import { parseFormData } from '~/util/parseFormData'

import type { VideoActionResult } from '~/feature/video/types/type'

export const loader = async () => {
  const queryClient = new QueryClient()
  const query = videoListQuery()

  return (
    queryClient.getQueryData(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
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
