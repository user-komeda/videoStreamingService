import { Button } from '~/components/ui/button'

type Props = {
  filesCount: number
  onReset: () => void
}

export const UploadCompleted = ({ filesCount, onReset }: Props) => {
  return (
    <div className="mx-auto mt-20 w-4/5 text-center">
      <h2 className="text-3xl font-bold text-green-600">アップロード完了</h2>

      <p className="text-muted-foreground mt-4">
        {filesCount} 件の動画をアップロードしました
      </p>

      <Button onClick={onReset} className="mt-8">
        もう一度アップロードする
      </Button>
    </div>
  )
}
