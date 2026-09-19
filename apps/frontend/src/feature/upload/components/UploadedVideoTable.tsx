import { useQuery } from '@tanstack/react-query'

import { UploadedVideoTableBody } from '~/feature/upload/components/UploadedVideoTableBody'
import { VideoDeleteDialog } from '~/feature/upload/components/VideoDeleteDialog'
import { VideoEditDialog } from '~/feature/upload/components/VideoEditDialog'
import { useVideoTableMutations } from '~/feature/upload/hooks/useVideoTableMutations'
import { videoListQuery } from '~/feature/video/queries'

const TableHeader = () => (
  <thead>
    <tr className="border-border text-muted-foreground border-b text-left text-xs font-semibold tracking-wider uppercase">
      <th className="p-4">動画</th>
      <th className="p-4">公開設定</th>
      <th className="p-4">ステータス</th>
      <th className="p-4">再生時間</th>
      <th className="p-4">サイズ</th>
      <th className="p-4 text-right">操作</th>
    </tr>
  </thead>
)

const TableDialogs = ({
  mutations,
}: {
  mutations: ReturnType<typeof useVideoTableMutations>
}) => {
  const {
    deleteTarget,
    setDeleteTarget,
    editTarget,
    setEditTarget,
    deleteMutation,
    editMutation,
  } = mutations

  return (
    <>
      <VideoDeleteDialog
        video={deleteTarget}
        isOpen={deleteTarget !== null}
        isDeleting={deleteMutation.isPending}
        onConfirm={() =>
          deleteTarget?.id && deleteMutation.mutate(deleteTarget.id)
        }
        onClose={() => setDeleteTarget(null)}
      />
      <VideoEditDialog
        key={editTarget?.id}
        video={editTarget}
        isOpen={editTarget !== null}
        isUpdating={editMutation.isPending}
        onConfirm={(data) =>
          editTarget?.id && editMutation.mutate({ id: editTarget.id, data })
        }
        onClose={() => setEditTarget(null)}
      />
    </>
  )
}

export const UploadedVideoTable = () => {
  const { data: videos = [], isLoading } = useQuery(videoListQuery())
  const mutations = useVideoTableMutations()

  return (
    <div className="mt-12 w-full">
      <h3 className="text-foreground mb-4 text-xl font-bold">
        アップロード済み動画
      </h3>
      <div className="border-border bg-card overflow-x-auto rounded-xl border">
        <table className="w-full text-left text-sm">
          <TableHeader />
          <UploadedVideoTableBody
            videos={videos}
            isLoading={isLoading}
            onEdit={mutations.setEditTarget}
            onDelete={mutations.setDeleteTarget}
          />
        </table>
      </div>
      <TableDialogs mutations={mutations} />
    </div>
  )
}
