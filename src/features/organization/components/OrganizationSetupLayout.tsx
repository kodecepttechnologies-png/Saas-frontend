import type { ReactNode } from 'react'
import { Layers } from 'lucide-react'
import { cn } from '@/utils/cn'
import type { OrganizationSetupStep } from '../types/organization.types'
import { OrganizationSetupSidebar } from './OrganizationSetupSidebar'
import { OrganizationStepIndicator } from './OrganizationStepIndicator'

export interface OrganizationSetupLayoutProps {
  currentStep: OrganizationSetupStep
  onStepClick?: (step: OrganizationSetupStep) => void
  title: string
  subtitle: string
  children: ReactNode
  className?: string
}

export function OrganizationSetupLayout({
  currentStep,
  onStepClick,
  title,
  subtitle,
  children,
  className,
}: OrganizationSetupLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row text-fg">
      {/* Desktop Persistent Dark Violet Sidebar */}
      <div className="hidden md:block">
        <OrganizationSetupSidebar currentStep={currentStep} onStepClick={onStepClick} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Mobile Header with brand & compact step indicator */}
        <header className="md:hidden border-b border-border bg-surface px-4 py-4 space-y-3 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
              <Layers aria-hidden="true" className="h-5 w-5 text-white" />
            </span>
            <span className="text-base font-bold text-fg">SaaS Workspace</span>
          </div>

          <OrganizationStepIndicator currentStep={currentStep} onStepClick={onStepClick} />
        </header>

        {/* Scrollable Container with centered content */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12 overflow-y-auto">
          <div className={cn('w-full max-w-xl mx-auto space-y-6', className)}>
            {/* Header Titles */}
            <div className="text-center md:text-left space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-fg">
                {title}
              </h1>
              <p className="text-sm sm:text-base text-fg-muted">
                {subtitle}
              </p>
            </div>

            {/* Card wrapper */}
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
