import { AccountGroup } from '~/components/header/UserMenuAccountGroup'
import {
  SettingsAndHelpGroup,
  StudioAndDataGroup,
} from '~/components/header/UserMenuSettingsGroup'

interface UserMenuDropdownProps {
  isOpen: boolean
  onClose: () => void
  onLogout: () => void
}

const UserProfileHeader = () => (
  <div className="flex items-start gap-3 border-b px-4 py-3">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-700 text-sm font-bold text-white">
      {'TODO'}
    </div>
    <div className="flex min-w-0 flex-col">
      <span className="truncate text-sm font-semibold">{'TODO'}</span>
      <span className="text-muted-foreground truncate text-xs">{'TODO'}</span>
      <button
        type="button"
        className="mt-2 text-left text-xs text-blue-500 hover:underline"
      >
        チャンネルを表示
      </button>
    </div>
  </div>
)

export const UserMenuDropdown = ({
  isOpen,
  onClose,
  onLogout,
}: UserMenuDropdownProps) => {
  if (!isOpen) {
    return null
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-transparent"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            onClose()
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="メニューを閉じる"
      />
      <div className="bg-background absolute top-12 right-0 z-50 max-h-[calc(100vh-4rem)] w-72 overflow-y-auto rounded-2xl border py-2 text-sm shadow-2xl">
        <UserProfileHeader />
        <AccountGroup onLogout={onLogout} onClose={onClose} />
        <StudioAndDataGroup />
        <SettingsAndHelpGroup />
      </div>
    </>
  )
}
