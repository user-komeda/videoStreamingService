import { useState } from 'react'

import { HeaderActions } from '~/components/header/HeaderActions'
import { HeaderSearch } from '~/components/header/HeaderSearch'
import { HeaderLeft } from '~/components/header/headerLeft'

interface HeaderProps {
  isLoggedIn: boolean
  onToggleLogin: () => void
  onToggleSidebar: () => void
}

export const Header = ({
  isLoggedIn,
  onToggleLogin,
  onToggleSidebar,
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-background sticky top-0 z-50 flex h-14 w-full items-center justify-between border-b px-4">
      <HeaderLeft onToggleSidebar={onToggleSidebar} />
      <div className="hidden flex-1 items-center justify-center sm:flex">
        <HeaderSearch />
      </div>
      <HeaderActions
        isLoggedIn={isLoggedIn}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        onToggleLogin={onToggleLogin}
      />
    </header>
  )
}
