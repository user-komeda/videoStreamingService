import { Progress } from '~/components/ui/progress'

export const UploadProgress = ({ pct }: { pct: number }) => (
  <div className="mx-auto mt-6 w-4/5">
    <Progress value={pct} />
    <div className="text-muted-foreground mt-2 text-right text-xs">{pct}%</div>
  </div>
)
