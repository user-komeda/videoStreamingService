import { ChevronRight, LogOut, UserCheck } from 'lucide-react'

export const AccountGroup = ({
  onLogout,
  onClose,
}: {
  onLogout: () => void
  onClose: () => void
}) => (
  <div className="border-b py-2">
    <button
      type="button"
      className="hover:bg-muted flex w-full items-center gap-3 px-4 py-2 text-left text-sm"
    >
      <span className="w-5 text-center text-base font-bold">G</span>
      <span>Google アカウント</span>
    </button>
    <button
      type="button"
      className="hover:bg-muted flex w-full items-center justify-between px-4 py-2 text-left text-sm"
    >
      <div className="flex items-center gap-3">
        <UserCheck className="h-5 w-5" />
        <span>アカウントを切り替える</span>
      </div>
      <ChevronRight className="text-muted-foreground h-4 w-4" />
    </button>
    <button
      type="button"
      onClick={() => {
        onLogout()
        onClose()
      }}
      className="hover:bg-muted flex w-full items-center gap-3 px-4 py-2 text-left text-sm"
    >
      <LogOut className="h-5 w-5" />
      <span>ログアウト</span>
    </button>
  </div>
)
