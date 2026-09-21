import { Menu } from 'lucide-react'

import { Button } from '~/components/ui/button'

export const HeaderLeft = ({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void
}) => (
  <div className="flex items-center gap-4">
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggleSidebar}
      aria-label="メニュー"
    >
      <Menu className="h-5 w-5" />
    </Button>
    <div className="flex items-center gap-1 text-lg font-bold tracking-tight">
      <span className="flex h-6 w-8 items-center justify-center rounded-lg bg-red-600 text-xs font-black text-white">
        ▶
      </span>
      <span>StreamHub</span>
    </div>
  </div>
)
