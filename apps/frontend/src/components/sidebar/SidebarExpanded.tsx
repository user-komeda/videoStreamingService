import {
  Compass,
  Film,
  Flag,
  HelpCircle,
  Home,
  Settings,
  Tv,
} from 'lucide-react'

import { SidebarSubscriptions } from '~/components/sidebar/SidebarSubscriptions'
import { SidebarUserSection } from '~/components/sidebar/SidebarUserSection'
import { Button } from '~/components/ui/button'

const MainNavigation = () => (
  <div className="space-y-1">
    <Button variant="secondary" className="w-full justify-start gap-4">
      <Home className="h-4 w-4" />
      ホーム
    </Button>
    <Button variant="ghost" className="w-full justify-start gap-4">
      <Film className="h-4 w-4" />
      Shorts
    </Button>
    <Button variant="ghost" className="w-full justify-start gap-4">
      <Tv className="h-4 w-4" />
      登録チャンネル
    </Button>
  </div>
)

const ExploreSection = () => (
  <div className="space-y-1">
    <div className="text-muted-foreground px-3 py-1 text-xs font-semibold">
      探索
    </div>
    <Button variant="ghost" className="w-full justify-start gap-4">
      <Compass className="h-4 w-4" />
      急上昇
    </Button>
  </div>
)

const SidebarFooter = () => (
  <div className="space-y-1">
    <Button variant="ghost" className="w-full justify-start gap-4">
      <Settings className="h-4 w-4" />
      設定
    </Button>
    <Button variant="ghost" className="w-full justify-start gap-4">
      <Flag className="h-4 w-4" />
      報告履歴
    </Button>
    <Button variant="ghost" className="w-full justify-start gap-4">
      <HelpCircle className="h-4 w-4" />
      ヘルプ
    </Button>
  </div>
)

export const SidebarExpanded = ({
  isLoggedIn,
  onToggleLogin,
}: {
  isLoggedIn: boolean
  onToggleLogin: () => void
}) => (
  <aside className="bg-background min-h-[calc(100vh-3.5rem)] w-60 shrink-0 space-y-4 overflow-y-auto border-r p-3 text-sm">
    <MainNavigation />
    <hr className="border-border" />
    <SidebarUserSection isLoggedIn={isLoggedIn} onToggleLogin={onToggleLogin} />
    {isLoggedIn && (
      <>
        <hr className="border-border" />
        <SidebarSubscriptions />
      </>
    )}
    <hr className="border-border" />
    <ExploreSection />
    <hr className="border-border" />
    <SidebarFooter />
  </aside>
)
