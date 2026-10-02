import { useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Alert } from '@/components/feedback/Alert'
import { Button, Checkbox, Input, Select } from '@/components/ui'
import type { AppError } from '@/services/errorHandler'
import { organizationSchema, type OrganizationFormValues } from '../schemas/organization.schemas'
import type { OrganizationRegistrationPayload } from '../types/organization.types'
import { getDefaultTimezone, getTimezoneOptions, languageOptions, themeOptions } from '../utils/options'
import { OrganizationLogoUpload } from './OrganizationLogoUpload'

export interface OrganizationFormProps {
  onSubmit: (payload: OrganizationRegistrationPayload) => void
  isPending?: boolean
  error?: AppError | null
  defaultValues?: Partial<OrganizationFormValues>
}

export function OrganizationForm({
  onSubmit,
  isPending = false,
  error,
  defaultValues,
}: OrganizationFormProps) {
  const timezoneOptions = useMemo(getTimezoneOptions, [])

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      organizationName: defaultValues?.organizationName ?? '',
      industry: defaultValues?.industry ?? '',
      workspaceUrl: defaultValues?.workspaceUrl ?? '',
      timezone: defaultValues?.timezone ?? getDefaultTimezone(),
      language: defaultValues?.language ?? 'en',
      theme: defaultValues?.theme ?? 'dark',
      termsAccepted: defaultValues?.termsAccepted ?? false,
      logo: defaultValues?.logo ?? undefined,
    },
  })

  const handleFormSubmit = handleSubmit((values) => {
    // Extract actual File object from logo (supports File or FileList)
    let logoFile: File | undefined = undefined
    if (values.logo instanceof File) {
      logoFile = values.logo
    } else if (typeof FileList !== 'undefined' && values.logo instanceof FileList && values.logo.length > 0) {
      logoFile = values.logo[0]
    }

    const payload: OrganizationRegistrationPayload = {
      organizationName: values.organizationName.trim(),
      industry: values.industry.trim(),
      workspaceUrl: values.workspaceUrl.trim().toLowerCase(),
      timezone: values.timezone,
      language: values.language,
      theme: values.theme,
      termsAccepted: values.termsAccepted,
      logo: logoFile,
    }

    onSubmit(payload)
  })

  return (
    <form onSubmit={handleFormSubmit} noValidate className="space-y-6">
      {error && <Alert tone="error">{error.message}</Alert>}

      <div className="space-y-4">
        <Input
          label="Organization name"
          placeholder="e.g. Acme Technologies"
          error={errors.organizationName?.message}
          disabled={isPending}
          required
          {...register('organizationName')}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Industry"
            placeholder="e.g. Software, Finance, Healthcare"
            error={errors.industry?.message}
            disabled={isPending}
            required
            {...register('industry')}
          />

          <Input
            label="Workspace address"
            placeholder="e.g. acme"
            hint="Unique slug for your organization workspace"
            autoCapitalize="none"
            error={errors.workspaceUrl?.message}
            disabled={isPending}
            required
            {...register('workspaceUrl')}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Select
            label="Timezone"
            options={timezoneOptions}
            error={errors.timezone?.message}
            disabled={isPending}
            required
            {...register('timezone')}
          />
          <Select
            label="Language"
            options={languageOptions}
            error={errors.language?.message}
            disabled={isPending}
            required
            {...register('language')}
          />
          <Select
            label="Theme"
            options={themeOptions}
            error={errors.theme?.message}
            disabled={isPending}
            required
            {...register('theme')}
          />
        </div>

        <Controller
          control={control}
          name="logo"
          render={({ field, fieldState }) => (
            <OrganizationLogoUpload
              value={field.value instanceof File ? field.value : undefined}
              onChange={(file) => field.onChange(file)}
              error={fieldState.error?.message}
              disabled={isPending}
            />
          )}
        />

        <div className="pt-2">
          <Checkbox
            label="I accept the terms and conditions and privacy policy"
            error={errors.termsAccepted?.message}
            disabled={isPending}
            {...register('termsAccepted')}
          />
        </div>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          size="lg"
          className="w-full sm:w-auto min-w-[200px]"
          loading={isPending}
          disabled={isPending}
        >
          {isPending ? 'Creating organization...' : 'Create organization'}
        </Button>
      </div>
    </form>
  )
}
