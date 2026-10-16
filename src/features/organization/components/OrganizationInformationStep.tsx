import {
  useEffect,
  type FormEvent,
} from 'react'
import { ArrowRight } from 'lucide-react'
import {
  Controller,
  type UseFormReturn,
} from 'react-hook-form'
import {
  Button,
  Card,
  Input,
  Select,
} from '@/components/ui'
import type { OrganizationFormValues } from '../schemas/organization.schemas'
import { industryOptions } from '../utils/options'
import { generateWorkspaceSlug } from '../hooks/useOrganizationSetup'
import { OrganizationLogoUpload } from './OrganizationLogoUpload'

export interface OrganizationInformationStepProps {
  form: UseFormReturn<OrganizationFormValues>
  onContinue: () => void
  isPending?: boolean
}

export function OrganizationInformationStep({
  form,
  onContinue,
  isPending = false,
}: OrganizationInformationStepProps) {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form

  const organizationName =
    watch('organizationName')

  const workspaceUrl =
    watch('workspaceUrl')

  useEffect(() => {
    const generatedSlug =
      generateWorkspaceSlug(
        organizationName,
      )

    if (
      generatedSlug &&
      (
        !workspaceUrl ||
        workspaceUrl ===
          generateWorkspaceSlug(
            organizationName,
          )
      )
    ) {
      setValue(
        'workspaceUrl',
        generatedSlug,
        {
          shouldValidate: true,
          shouldDirty: true,
        },
      )
    }
  }, [
    organizationName,
    setValue,
  ])

  const handleNext = (
    event: FormEvent,
  ) => {
    event.preventDefault()
    onContinue()
  }

  return (
    <Card className="rounded-2xl border border-border/80 bg-surface p-6 shadow-2xl sm:p-8">
      <form
        onSubmit={handleNext}
        noValidate
        className="space-y-6"
      >
        <div className="space-y-5">
          <Input
            label="Organization name"
            placeholder="e.g. Acme Technologies"
            error={
              errors.organizationName?.message
            }
            disabled={isPending}
            required
            autoFocus
            {...register(
              'organizationName',
            )}
          />

          <Select
            label="Industry"
            options={industryOptions}
            error={
              errors.industry?.message
            }
            disabled={isPending}
            required
            {...register('industry')}
          />

          <div>
            <Input
              label="Workspace URL"
              placeholder="acme-technologies"
              hint="This becomes your organization's unique workspace slug."
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

            <p className="mt-2 text-xs text-muted-foreground">
              Example:{' '}
              <span className="font-medium">
                Acme Technologies
              </span>{' '}
              →{' '}
              <span className="font-medium">
                acme-technologies
              </span>
            </p>
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
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            size="lg"
            className="w-full min-w-[160px] gap-2 font-bold sm:w-auto"
            disabled={isPending}
          >
            <span>Continue</span>

            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4"
            />
          </Button>
        </div>
      </form>
    </Card>
  )
}