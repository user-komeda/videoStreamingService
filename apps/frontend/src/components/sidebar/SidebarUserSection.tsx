import { Clock, History, ThumbsUp, UserCircle } from 'lucide-react'

import { Button } from '~/components/ui/button'

const LoggedInUserSection = () => (
  <div className="space-y-1">
    <div className="text-muted-foreground px-3 py-1 text-xs font-semibold">
      ライブラリ
    </div>
    <Button variant="ghost" className="w-full justify-start gap-4">
      <History className="h-4 w-4" />
      履歴
    </Button>
    <Button variant="ghost" className="w-full justify-start gap-4">
      <Clock className="h-4 w-4" />
      後で見る
    </Button>
    <Button variant="ghost" className="w-full justify-start gap-4">
      <ThumbsUp className="h-4 w-4" />
      高く評価した動画
    </Button>
  </div>
)

const LoggedOutUserSection = ({
  onToggleLogin,
}: {
  onToggleLogin: () => void
}) => (
  <div className="bg-muted/40 space-y-3 rounded-lg px-3 py-2">
    <p className="text-muted-foreground text-xs leading-relaxed">
      ログインすると、動画の高評価やチャンネル登録、コメントができるようになります。
    </p>
    <Button
      variant="outline"
      size="sm"
      onClick={onToggleLogin}
      className="w-full border-blue-200 text-blue-600"
    >
      <UserCircle className="mr-2 h-4 w-4" />
      ログイン
    </Button>
  </div>
)

export const SidebarUserSection = ({
  isLoggedIn,
  onToggleLogin,
}: {
  isLoggedIn: boolean
  onToggleLogin: () => void
}) => {
  if (isLoggedIn) {
    return <LoggedInUserSection />
  }

  return <LoggedOutUserSection onToggleLogin={onToggleLogin} />
}
