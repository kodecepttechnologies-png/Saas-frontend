import { Check, HelpCircle, Layers, ShieldCheck } from 'lucide-react'
import { cn } from '@/utils/cn'
import { SETUP_STEPS, type OrganizationSetupStep } from '../types/organization.types'

export interface OrganizationSetupSidebarProps {
  currentStep: OrganizationSetupStep
  onStepClick?: (step: OrganizationSetupStep) => void
  className?: string
}

export function OrganizationSetupSidebar({
  currentStep,
  onStepClick,
  className,
}: OrganizationSetupSidebarProps) {
  return (
    <aside
      className={cn(
        'w-72 lg:w-80 shrink-0 h-screen sticky top-0 flex flex-col justify-between p-6 lg:p-8 bg-[#130d24] border-r border-[#2d1f47] text-white select-none',
        className,
      )}
    >
      {/* Top: Brand Logo */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-hover shadow-lg shadow-primary/30 ring-1 ring-white/10">
            <Layers aria-hidden="true" className="h-6 w-6 text-white" />
          </span>
          <div>
            <span className="text-lg font-black tracking-tight text-white block">SaaS Workspace</span>
            <span className="text-xs font-semibold text-primary-hover uppercase tracking-wider block">
              Setup & Onboarding
            </span>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-border/80 via-primary/30 to-transparent" />

        {/* Step Indicator Navigation */}
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-[#9a96af] mb-4">
            Setup Progress
          </p>

          <nav aria-label="Onboarding Progress" className="relative space-y-6">
            {SETUP_STEPS.map((s, index) => {
              const isCompleted = s.id < currentStep
              const isCurrent = s.id === currentStep
              const isUpcoming = s.id > currentStep
              const isClickable = isCompleted && onStepClick

              return (
                <div key={s.id} className="relative flex items-start group">
                  {/* Vertical connector line */}
                  {index < SETUP_STEPS.length - 1 && (
                    <div
                      className={cn(
                        'absolute left-4 top-8 -bottom-6 w-0.5 transition-colors duration-300',
                        isCompleted ? 'bg-primary' : 'bg-[#2a1c42]',
                      )}
                      aria-hidden="true"
                    />
                  )}

                  <button
                    type="button"
                    onClick={() => isClickable && onStepClick(s.id)}
                    disabled={!isClickable}
                    className={cn(
                      'relative z-10 flex items-start gap-3.5 text-left w-full rounded-xl p-2 transition-all',
                      isClickable && 'hover:bg-white/5 cursor-pointer',
                      !isClickable && 'cursor-default',
                    )}
                  >
                    {/* Circle icon */}
                    <div
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-300',
                        isCompleted && 'bg-primary text-white shadow-md shadow-primary/40 ring-2 ring-primary/40',
                        isCurrent &&
                          'bg-primary-hover text-white ring-4 ring-primary/30 shadow-lg shadow-primary/50',
                        isUpcoming && 'border border-[#38265a] bg-[#1a1230] text-[#9a96af]',
                      )}
                    >
                      {isCompleted ? (
                        <Check aria-hidden="true" className="h-4 w-4 stroke-[2.5]" />
                      ) : (
                        <span>{s.id}</span>
                      )}
                    </div>

                    <div className="pt-0.5 min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={cn(
                            'text-xs font-bold uppercase tracking-wider',
                            isCurrent && 'text-primary-hover',
                            isCompleted && 'text-[#d4d2e0]',
                            isUpcoming && 'text-[#7d7796]',
                          )}
                        >
                          Step {s.id}
                        </span>
                        {isCompleted && (
                          <span className="text-[10px] font-semibold text-success bg-success/10 px-1.5 py-0.5 rounded-full">
                            Done
                          </span>
                        )}
                        {isCurrent && (
                          <span className="text-[10px] font-semibold text-primary-hover bg-primary/20 px-1.5 py-0.5 rounded-full animate-pulse">
                            Active
                          </span>
                        )}
                      </div>

                      <p
                        className={cn(
                          'text-sm font-semibold truncate transition-colors',
                          isCurrent && 'text-white font-bold',
                          isCompleted && 'text-white/90',
                          isUpcoming && 'text-[#9a96af]',
                        )}
                      >
                        {s.title}
                      </p>

                      <p className="text-xs text-[#7d7796] line-clamp-1 mt-0.5">
                        {s.subtitle}
                      </p>
                    </div>
                  </button>
                </div>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Bottom: Reassurance & Help */}
      <div className="pt-6 border-t border-[#2a1c42] space-y-3">
        <div className="flex items-center gap-2.5 text-xs text-[#9a96af]">
          <ShieldCheck aria-hidden="true" className="h-4 w-4 text-primary-hover shrink-0" />
          <span>Tenant workspace security enforced</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-[#7d7796]">
          <HelpCircle aria-hidden="true" className="h-4 w-4 shrink-0" />
          <span>Need help? Support is always available</span>
        </div>
      </div>
    </aside>
  )
}
