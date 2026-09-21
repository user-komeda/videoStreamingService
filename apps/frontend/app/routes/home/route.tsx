import { Suspense } from 'react'
import type { MetaFunction } from 'react-router'

import { Home as HomeComponent } from '~/feature/home/home'

export const meta: MetaFunction = () => {
  return [
    { title: 'Video Streaming Service' },
    { name: 'description', content: 'Explore and watch the latest videos.' },
  ]
}

const Route = () => {
  return (
    <Suspense
      fallback={
        <div className="text-muted-foreground py-10 text-center">
          動画を読み込み中...
        </div>
      }
    >
      <HomeComponent />
    </Suspense>
  )
}
export default Route
