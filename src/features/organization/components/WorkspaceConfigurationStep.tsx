import { useMemo } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import { Button, Card, Checkbox, Select } from '@/components/ui'
import type { OrganizationFormValues } from '../schemas/organization.schemas'
import {
  getTimezoneOptions,
  languageOptions,
  themeOptions,
} from '../utils/options'

export interface WorkspaceConfigurationStepProps {
  form: UseFormReturn<OrganizationFormValues>
  onContinue: () => void
  onBack: () => void
  isPending?: boolean
}

export function WorkspaceConfigurationStep({
  form,
  onContinue,
  onBack,
  isPending = false,
}: WorkspaceConfigurationStepProps) {
  const timezoneOptions = useMemo(getTimezoneOptions, [])

  const {
    register,
    formState: { errors },
  } = form

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    onContinue()
  }

  return (
    <Card className="border border-border/80 bg-surface shadow-2xl p-6 sm:p-8 rounded-2xl">
      <form onSubmit={handleNext} noValidate className="space-y-6">
        <div className="space-y-5">
          {/* Timezone */}
          <Select
            label="Timezone"
            options={timezoneOptions}
            error={errors.timezone?.message}
            disabled={isPending}
            required
            hint="Determines date, time, and scheduling display across the application"
            {...register('timezone')}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Language */}
            <Select
              label="Language"
              options={languageOptions}
              error={errors.language?.message}
              disabled={isPending}
              required
              {...register('language')}
            />

            {/* Theme */}
            <Select
              label="Theme"
              options={themeOptions}
              error={errors.theme?.message}
              disabled={isPending}
              required
              {...register('theme')}
            />
          </div>

          {/* Terms and Conditions */}
          <div className="pt-2 border-t border-border/60">
            <Checkbox
              label="I accept the Terms of Service, Privacy Policy, and Workspace Agreement"
              error={errors.termsAccepted?.message}
              disabled={isPending}
              {...register('termsAccepted')}
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="pt-4 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 border-t border-border/60">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={onBack}
            disabled={isPending}
            className="w-full sm:w-auto gap-2"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            <span>Back</span>
          </Button>

          <Button
            type="submit"
            size="lg"
            className="w-full sm:w-auto min-w-[160px] gap-2 font-bold"
            disabled={isPending}
          >
            <span>Continue</span>
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </Card>
  )
}
