import { useContext, useMemo, useState } from 'react'

import {
  UppyContext,
  useDropzone,
  useUppyEvent,
  useUppyState,
} from '@uppy/react'
import { twMerge } from 'tailwind-merge'

export const Upload = () => {
  const { uppy } = useContext(UppyContext)

  // ===== UI state =====
  const [completed, setCompleted] = useState(false)

  // ===== Uppy state =====
  const files = useUppyState(uppy!, (state) => Object.values(state.files))

  const progress = useUppyState(uppy!, (state) => state.totalProgress)

  const pct = useMemo(() => Math.round(progress ?? 0), [progress])

  // ===== 完了検知（正解）=====
  useUppyEvent(uppy!, 'complete', (result) => {
    if (result.failed?.length === 0) {
      const timer = setTimeout(() => {
        setCompleted(true)
      }, 1500)

      return () => clearTimeout(timer)
    }
  })

  // ===== リセット検知（正解）=====
  useUppyEvent(uppy!, 'cancel-all', () => {
    setCompleted(false)
  })

  // ===== Dropzone =====
  const { getRootProps, getInputProps } = useDropzone({
    noClick: false,
  })

  // ===== 完了UI =====
  if (completed) {
    return (
      <div className="mx-auto mt-20 w-4/5 text-center">
        <h2 className="text-3xl font-bold text-green-600">アップロード完了</h2>

        <p className="mt-4 text-gray-700">
          {files.length} 件の動画をアップロードしました
        </p>

        <button
          onClick={() => uppy!.cancelAll()}
          className="mt-8 rounded bg-blue-600 px-6 py-2 text-white"
        >
          もう一度アップロードする
        </button>
      </div>
    )
  }

  // ===== 通常UI =====
  return (
    <>
      <h2 className="my-10 text-center text-3xl font-bold">動画アップロード</h2>

      <div className="mx-auto w-4/5">
        {/* Drop area */}
        <div
          {...getRootProps()}
          role="button"
          tabIndex={0}
          className={twMerge(
            'min-h-[220px] w-full cursor-pointer text-center select-none',
            'rounded-lg border-2 border-dashed',
            'flex flex-col items-center justify-center',
            'border-gray-300 bg-white hover:border-gray-400',
            'focus:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-200',
            'px-6 py-10',
          )}
        >
          <input {...getInputProps()} className="hidden" tabIndex={-1} />

          <p className="text-base font-medium text-gray-800">
            ここにドラッグ＆ドロップ
          </p>
          <p className="mt-2 text-sm text-gray-600">
            または <span className="underline">ファイルを選択</span>
          </p>

          <p className="mt-6 text-xs text-gray-500">
            ※対応ファイル形式： 動画（AVI、MP4、FLV、MOV）
          </p>
        </div>

        {/* 選択済みファイル一覧 */}
        {files.length > 0 && (
          <ul className="mt-4 space-y-1 text-sm text-gray-700">
            {files.map((file) => (
              <li key={file.id} className="flex justify-between">
                <span>{file.name}</span>
                <span className="text-gray-500">
                  {Math.round(file.size ? file.size / 1024 / 1024 : 0)} MB
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* upload 開始 */}
        <button
          onClick={() => uppy!.upload()}
          disabled={files.length === 0}
          className="mt-4 rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          アップロード開始
        </button>
      </div>

      {/* Progress */}
      <div className="mx-auto mt-6 w-4/5">
        <div className="h-2 w-full overflow-hidden rounded bg-gray-200">
          <div
            className="h-full bg-blue-600 transition-all duration-200"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-2 text-right text-xs text-gray-600">{pct}%</div>
      </div>
    </>
  )
}
