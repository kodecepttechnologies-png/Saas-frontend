import { useCallback, useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from '@/components/navigation/Header'
import { MobileDrawer } from '@/components/navigation/MobileDrawer'
import { SidebarNav } from '@/components/navigation/SidebarNav'

/**
 * Desktop: header on top, fixed sidebar + content below.
 * Mobile/tablet: sidebar becomes a drawer opened from the header menu button.
 */
export function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const { pathname } = useLocation()
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  useEffect(() => {
    setDrawerOpen(false)
  }, [pathname])

  return (
    <div className="min-h-dvh bg-background">
      <Header onMenuClick={() => setDrawerOpen(true)} menuButtonRef={menuButtonRef} />
      {drawerOpen && <MobileDrawer onClose={closeDrawer} returnFocusRef={menuButtonRef} />}

      <div className="lg:flex">
        <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r border-border bg-surface lg:block">
          <SidebarNav />
        </aside>
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
