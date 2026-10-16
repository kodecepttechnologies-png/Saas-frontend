import { useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Controller,
  useForm,
} from 'react-hook-form'
import {
  Alert,
} from '@/components/feedback/Alert'
import {
  Button,
  Checkbox,
  Input,
  Select,
} from '@/components/ui'
import type { AppError } from '@/services/errorHandler'
import {
  organizationSchema,
  type OrganizationFormValues,
} from '../schemas/organization.schemas'
import type {
  OrganizationRegistrationPayload,
} from '../types/organization.types'
import {
  getDefaultTimezone,
  getTimezoneOptions,
  languageOptions,
  themeOptions,
} from '../utils/options'
import {
  generateWorkspaceSlug,
} from '../hooks/useOrganizationSetup'
import { OrganizationLogoUpload } from './OrganizationLogoUpload'

export interface OrganizationFormProps {
  onSubmit: (
    payload: OrganizationRegistrationPayload,
  ) => void

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
  const timezoneOptions =
    useMemo(
      getTimezoneOptions,
      [],
    )

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } =
    useForm<OrganizationFormValues>({
      resolver:
        zodResolver(
          organizationSchema,
        ),

      defaultValues: {
        organizationName:
          defaultValues?.organizationName ??
          '',

        industry:
          defaultValues?.industry ??
          '',

        workspaceUrl:
          defaultValues?.workspaceUrl ??
          '',

        timezone:
          defaultValues?.timezone ??
          getDefaultTimezone(),

        language:
          defaultValues?.language ??
          'en',

        theme:
          defaultValues?.theme ??
          'dark',

        termsAccepted:
          defaultValues?.termsAccepted ??
          false,

        logo:
          defaultValues?.logo ??
          undefined,
      },
    })

  const organizationName =
    watch('organizationName')

  const workspaceUrl =
    watch('workspaceUrl')

  const generatedSlug =
    generateWorkspaceSlug(
      organizationName,
    )

  /**
   * Keep workspace slug synchronized with
   * organization name when the user has not
   * manually changed it.
   */
  const handleOrganizationNameChange =
    (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const name =
        event.target.value

      const currentSlug =
        workspaceUrl

      const previousGeneratedSlug =
        generateWorkspaceSlug(
          name,
        )

      const shouldUpdateSlug =
        !currentSlug ||
        currentSlug ===
          previousGeneratedSlug

      if (shouldUpdateSlug) {
        setValue(
          'workspaceUrl',
          generateWorkspaceSlug(
            name,
          ),
          {
            shouldValidate: true,
            shouldDirty: true,
          },
        )
      }
    }

  const handleFormSubmit =
    handleSubmit(
      (values) => {
        let logoFile:
          | File
          | undefined

        if (
          values.logo instanceof File
        ) {
          logoFile =
            values.logo
        } else if (
          typeof FileList !==
            'undefined' &&
          values.logo instanceof
            FileList &&
          values.logo.length > 0
        ) {
          logoFile =
            values.logo[0]
        }

        const timezone =
          values.timezone ===
          'Asia/Calcutta'
            ? 'Asia/Kolkata'
            : values.timezone

        const organizationName =
          values.organizationName.trim()

        const slug =
          generateWorkspaceSlug(
            organizationName,
          )

        const payload:
          OrganizationRegistrationPayload =
          {
            organizationName,

            industry:
              values.industry.trim(),

            workspaceUrl:
              slug,

            timezone,

            language:
              values.language,

            theme:
              values.theme,

            termsAccepted:
              values.termsAccepted,

            logo: logoFile,
          }

        onSubmit(payload)
      },
    )

  return (
    <form
      onSubmit={handleFormSubmit}
      noValidate
      className="space-y-6"
    >
      {error && (
        <Alert tone="error">
          {error.message}
        </Alert>
      )}

      <div className="space-y-4">
        <Input
          label="Organization name"
          placeholder="e.g. Acme Technologies"
          error={
            errors.organizationName
              ?.message
          }
          disabled={isPending}
          required
          {...register(
            'organizationName',
            {
              onChange:
                handleOrganizationNameChange,
            },
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Industry"
            placeholder="e.g. Software, Finance, Healthcare"
            error={
              errors.industry?.message
            }
            disabled={isPending}
            required
            {...register('industry')}
          />

          <Input
            label="Workspace address"
            placeholder="acme-technologies"
            hint="Unique slug for your organization workspace"
            autoCapitalize="none"
            autoComplete="off"
            error={
              errors.workspaceUrl?.message
            }
            disabled={isPending}
            required
            {...register(
              'workspaceUrl',
            )}
          />
        </div>

        <div className="rounded-lg border border-border/60 bg-muted/20 px-4 py-3">
          <p className="text-xs text-muted-foreground">
            Your workspace slug is generated
            from the organization name.
          </p>

          {generatedSlug && (
            <p className="mt-1 text-sm font-medium">
              {organizationName}
              {' → '}
              {generatedSlug}
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Select
            label="Timezone"
            options={timezoneOptions}
            error={
              errors.timezone?.message
            }
            disabled={isPending}
            required
            {...register('timezone')}
          />

          <Select
            label="Language"
            options={languageOptions}
            error={
              errors.language?.message
            }
            disabled={isPending}
            required
            {...register('language')}
          />

          <Select
            label="Theme"
            options={themeOptions}
            error={
              errors.theme?.message
            }
            disabled={isPending}
            required
            {...register('theme')}
          />
        </div>

        <Controller
          control={control}
          name="logo"
          render={({
            field,
            fieldState,
          }) => (
            <OrganizationLogoUpload
              value={
                field.value instanceof
                File
                  ? field.value
                  : undefined
              }
              onChange={(file) =>
                field.onChange(file)
              }
              error={
                fieldState.error?.message
              }
              disabled={isPending}
            />
          )}
        />

        <div className="pt-2">
          <Checkbox
            label="I accept the terms and conditions and privacy policy"
            error={
              errors.termsAccepted
                ?.message
            }
            disabled={isPending}
            {...register(
              'termsAccepted',
            )}
          />
        </div>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          size="lg"
          className="w-full min-w-[200px] sm:w-auto"
          loading={isPending}
          disabled={isPending}
        >
          {isPending
            ? 'Creating organization...'
            : 'Create organization'}
        </Button>
      </div>
    </form>
  )
}