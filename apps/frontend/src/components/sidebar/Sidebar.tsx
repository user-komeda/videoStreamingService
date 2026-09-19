import { SidebarCollapsed } from '~/components/sidebar/SidebarCollapsed'
import { SidebarExpanded } from '~/components/sidebar/SidebarExpanded'

interface SidebarProps {
  isExpanded: boolean
  isLoggedIn: boolean
  onToggleLogin: () => void
}

export const Sidebar = ({
  isExpanded,
  isLoggedIn,
  onToggleLogin,
}: SidebarProps) => {
  if (!isExpanded) {
    return <SidebarCollapsed />
  }

  return (
    <SidebarExpanded isLoggedIn={isLoggedIn} onToggleLogin={onToggleLogin} />
  )
}
