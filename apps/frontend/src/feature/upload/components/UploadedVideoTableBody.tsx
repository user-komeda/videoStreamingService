import { UploadedVideoRow } from '~/feature/upload/components/UploadedVideoRow'

import type { VideoResponse } from '~/api/generated/models'

type Props = {
  videos: VideoResponse[]
  isLoading: boolean
  onEdit: (video: VideoResponse) => void
  onDelete: (video: VideoResponse) => void
}

const EmptyTableRow = ({ message }: { message: string }) => (
  <tbody>
    <tr>
      <td colSpan={5} className="text-muted-foreground p-8 text-center">
        {message}
      </td>
    </tr>
  </tbody>
)

export const UploadedVideoTableBody = ({
  videos,
  isLoading,
  onEdit,
  onDelete,
}: Props) => {
  if (isLoading) {
    return <EmptyTableRow message="読み込み中..." />
  }
  if (videos.length === 0) {
    return <EmptyTableRow message="アップロードされた動画はありません" />
  }

  return (
    <tbody>
      {videos.map((video) => (
        <UploadedVideoRow
          key={video.id}
          video={video}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </tbody>
  )
}
