import { Check } from 'lucide-react'
import { cn } from '@/utils/cn'
import { SETUP_STEPS, type OrganizationSetupStep } from '../types/organization.types'

export interface OrganizationStepIndicatorProps {
  currentStep: OrganizationSetupStep
  onStepClick?: (step: OrganizationSetupStep) => void
  className?: string
}

export function OrganizationStepIndicator({
  currentStep,
  onStepClick,
  className,
}: OrganizationStepIndicatorProps) {
  return (
    <div className={cn('w-full', className)}>
      {/* Mobile view: compact pill badge + progress dots */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary-hover">
            Step {currentStep} of 3
          </span>
          <span className="text-xs font-medium text-fg-muted">
            {SETUP_STEPS[currentStep - 1].title}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {SETUP_STEPS.map((s) => {
            const isCompleted = s.id < currentStep
            const isCurrent = s.id === currentStep

            return (
              <div
                key={s.id}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  isCompleted
                    ? 'bg-primary'
                    : isCurrent
                      ? 'bg-primary-hover shadow-sm shadow-primary/50'
                      : 'bg-surface-secondary',
                )}
                aria-hidden="true"
              />
            )
          })}
        </div>
      </div>

      {/* Tablet / Desktop horizontal alternative or embedded indicator */}
      <div className="hidden md:flex items-center justify-between">
        {SETUP_STEPS.map((s, index) => {
          const isCompleted = s.id < currentStep
          const isCurrent = s.id === currentStep
          const isClickable = isCompleted && onStepClick

          return (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <button
                type="button"
                onClick={() => isClickable && onStepClick(s.id)}
                disabled={!isClickable}
                className={cn(
                  'group flex items-center gap-3 text-left transition-all',
                  isClickable && 'cursor-pointer hover:opacity-90',
                  !isClickable && 'cursor-default',
                )}
              >
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all',
                    isCompleted && 'bg-primary text-white shadow-sm',
                    isCurrent && 'bg-primary-hover text-white ring-4 ring-primary/20 shadow-md',
                    !isCompleted && !isCurrent && 'border border-border bg-surface-secondary text-fg-muted',
                  )}
                >
                  {isCompleted ? <Check aria-hidden="true" className="h-4 w-4" /> : s.id}
                </div>
                <div>
                  <p
                    className={cn(
                      'text-xs font-bold uppercase tracking-wider',
                      isCurrent && 'text-primary-hover',
                      isCompleted && 'text-fg',
                      !isCompleted && !isCurrent && 'text-fg-muted',
                    )}
                  >
                    Step {s.id}
                  </p>
                  <p
                    className={cn(
                      'text-xs font-medium truncate max-w-[130px] lg:max-w-none',
                      isCurrent ? 'text-fg' : 'text-fg-muted',
                    )}
                  >
                    {s.title}
                  </p>
                </div>
              </button>

              {index < SETUP_STEPS.length - 1 && (
                <div
                  className={cn(
                    'mx-4 h-0.5 flex-1 transition-colors duration-300',
                    isCompleted ? 'bg-primary/60' : 'bg-border/60',
                  )}
                  aria-hidden="true"
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
