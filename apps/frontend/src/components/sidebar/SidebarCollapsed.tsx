import { Film, History, Home, Tv } from 'lucide-react'

import { Button } from '~/components/ui/button'

export const SidebarCollapsed = () => (
  <aside className="bg-background flex min-h-[calc(100vh-3.5rem)] w-18 shrink-0 flex-col items-center gap-4 border-r px-1 py-3">
    <Button
      variant="ghost"
      className="flex h-16 w-16 flex-col gap-1 p-0 text-[10px]"
    >
      <Home className="h-5 w-5" />
      ホーム
    </Button>
    <Button
      variant="ghost"
      className="flex h-16 w-16 flex-col gap-1 p-0 text-[10px]"
    >
      <Film className="h-5 w-5" />
      Shorts
    </Button>
    <Button
      variant="ghost"
      className="flex h-16 w-16 flex-col gap-1 p-0 text-[10px]"
    >
      <Tv className="h-5 w-5" />
      登録チャンネル
    </Button>
    <Button
      variant="ghost"
      className="flex h-16 w-16 flex-col gap-1 p-0 text-[10px]"
    >
      <History className="h-5 w-5" />
      ライブラリ
    </Button>
  </aside>
)
