import type { Dispatch, SetStateAction } from 'react'

import { Bell, LogIn, Video } from 'lucide-react'

import { UserMenuDropdown } from '~/components/header/UserMenuDropdown'
import { Button } from '~/components/ui/button'

const NotLogin = ({ onToggleLogin }: { onToggleLogin: () => void }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onToggleLogin}
      className="flex items-center gap-1.5 border-blue-200 text-blue-600 hover:bg-blue-50"
    >
      <LogIn className="h-4 w-4" />
      <span>ログイン (切替)</span>
    </Button>
  )
}

const AlreadyLogin = ({
  isMenuOpen,
  setIsMenuOpen,
  onToggleLogin,
}: {
  isMenuOpen: boolean
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>
  onToggleLogin: () => void
}) => {
  return (
    <>
      <Button variant="ghost" size="icon" aria-label="作成">
        <Video className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" aria-label="通知">
        <Bell className="h-5 w-5" />
      </Button>
      <button
        type="button"
        onClick={() => setIsMenuOpen((prev: boolean) => !prev)}
        className="hover:ring-primary flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-pink-700 text-xs font-bold text-white hover:ring-2 focus:outline-none"
        aria-label="ユーザーメニュー"
      >
        {'TODO'}
      </button>
      <UserMenuDropdown
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onLogout={() => {
          setIsMenuOpen(false)
          onToggleLogin()
        }}
      />
    </>
  )
}

export const HeaderActions = ({
  isLoggedIn,
  isMenuOpen,
  setIsMenuOpen,
  onToggleLogin,
}: {
  isLoggedIn: boolean
  isMenuOpen: boolean
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>
  onToggleLogin: () => void
}) => {
  return (
    <div className="relative flex items-center gap-2">
      {isLoggedIn ? (
        <AlreadyLogin
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          onToggleLogin={onToggleLogin}
        />
      ) : (
        <NotLogin onToggleLogin={onToggleLogin} />
      )}
    </div>
  )
}
