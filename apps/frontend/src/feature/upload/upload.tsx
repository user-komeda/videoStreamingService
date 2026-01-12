import { useContext } from 'react'

import { DragDrop, ProgressBar, UppyContext } from '@uppy/react'

export const Upload = () => {
  const { uppy } = useContext(UppyContext)
  return (
    <>
      <h2 className="my-10 text-center text-3xl font-bold">動画アップロード</h2>
      {uppy && (
        <>
          <div style={{ width: '100%', margin: '0 auto' }}>
            <DragDrop
              uppy={uppy}
              locale={{
                strings: {
                  dropHereOr: 'ここにドラッグ＆ドロップ、または %{browse}',
                  browse: 'ファイルを選択',
                },
              }}
              note="※対応ファイル形式：  動画（AVI、MP4、FLV、MOV）"
              width={'80%'}
            ></DragDrop>
          </div>
          <div>
            <ProgressBar uppy={uppy}></ProgressBar>
          </div>
        </>
      )}
    </>
  )
}
