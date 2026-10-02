import type { RefObject } from 'react'
import { LogOut, Menu } from 'lucide-react'
import { Link } from 'react-router-dom'
import { OrganizationBrand } from '@/features/organization/components/OrganizationBrand'
import { useAuth } from '@/hooks/useAuth'

interface HeaderProps {
  onMenuClick: () => void
  menuButtonRef: RefObject<HTMLButtonElement>
}

const headerButton =
  'inline-flex h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold hover:bg-white/10'

export function Header({ onMenuClick, menuButtonRef }: HeaderProps) {
  const { user, signOut } = useAuth()
  const name = user?.username ?? user?.email

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 bg-primary px-3 text-white sm:px-4">
      <button
        ref={menuButtonRef}
        type="button"
        onClick={onMenuClick}
        aria-label="Open navigation"
        aria-haspopup="dialog"
        className={`${headerButton} w-11 px-0 lg:hidden`}
      >
        <Menu aria-hidden="true" className="h-6 w-6" />
      </button>

      <Link
        to="/dashboard"
        className="flex items-center gap-2 rounded-lg font-extrabold focus-visible:ring-2 focus-visible:ring-white p-1"
        aria-label="Go to workspace dashboard"
      >
        <OrganizationBrand
          size="sm"
          logoClassName="bg-white/15 border-white/25 text-white"
          nameClassName="text-white text-sm sm:text-base font-extrabold"
          showSubtitle={false}
        />
      </Link>

      <div className="ml-auto flex items-center gap-1 sm:gap-3">
        {name && <span className="hidden max-w-[14rem] truncate text-sm text-white/90 sm:block">{name}</span>}
        <button type="button" onClick={signOut} aria-label="Sign out" className={headerButton}>
          <LogOut aria-hidden="true" className="h-5 w-5" />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  )
}
