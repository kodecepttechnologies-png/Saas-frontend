import { useEffect, useRef, type RefObject } from 'react'
import { X } from 'lucide-react'
import { SidebarNav } from './SidebarNav'

interface MobileDrawerProps {
  onClose: () => void
  /** Focus goes back here when the drawer closes. */
  returnFocusRef: RefObject<HTMLButtonElement>
}

const FOCUSABLE = 'a[href], button:not([disabled])'

/** Rendered only while open. Handles Escape, focus trap, scroll lock and focus return. */
export function MobileDrawer({ onClose, returnFocusRef }: MobileDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const returnTarget = returnFocusRef.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab' || !panelRef.current) return
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    // The drawer is phone/tablet only: close it if the window grows to desktop.
    const onResize = () => {
      if (window.innerWidth >= 1024) onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', onResize)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', onResize)
      document.body.style.overflow = previousOverflow
      returnTarget?.focus()
    }
  }, [onClose, returnFocusRef])

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col overflow-y-auto border-r border-border bg-surface"
      >
        <div className="flex h-14 items-center justify-between px-4">
          <span className="font-extrabold">Menu</span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-fg-secondary hover:bg-surface-secondary hover:text-fg"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
        <SidebarNav onNavigate={onClose} />
      </div>
    </div>
  )
}
