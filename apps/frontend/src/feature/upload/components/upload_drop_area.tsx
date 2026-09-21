import type { HTMLAttributes, InputHTMLAttributes } from 'react'

import { cn } from '~/lib/utils'

type Props = {
  getRootProps: () => HTMLAttributes<HTMLDivElement>
  getInputProps: () => InputHTMLAttributes<HTMLInputElement>
}

export const UploadDropArea = ({ getRootProps, getInputProps }: Props) => {
  return (
    <div
      {...getRootProps()}
      role="button"
      tabIndex={0}
      className={cn(
        'min-h-[220px] w-full cursor-pointer text-center select-none',
        'rounded-lg border-2 border-dashed',
        'flex flex-col items-center justify-center',
        'border-border bg-card hover:border-primary/50',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus:outline-none focus-visible:ring-3',
        'px-6 py-10',
      )}
    >
      <input {...getInputProps()} className="hidden" tabIndex={-1} />

      <p className="text-card-foreground text-base font-medium">
        ここにドラッグ＆ドロップ
      </p>
      <p className="text-muted-foreground mt-2 text-sm">
        または <span className="underline">ファイルを選択</span>
      </p>

      <p className="text-muted-foreground mt-6 text-xs">
        ※対応ファイル形式： 動画（AVI、MP4、FLV、MOV）
      </p>
    </div>
  )
}
