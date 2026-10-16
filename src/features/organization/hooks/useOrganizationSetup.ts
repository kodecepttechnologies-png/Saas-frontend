import { useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  useForm,
  type UseFormReturn,
} from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useObjectUrl } from '@/hooks/useObjectUrl'
import type { AppError } from '@/services/errorHandler'
import {
  organizationSchema,
  type OrganizationFormValues,
} from '../schemas/organization.schemas'
import type {
  OrganizationRegistrationPayload,
  OrganizationSetupStep,
} from '../types/organization.types'
import { getDefaultTimezone } from '../utils/options'
import { useRegisterOrganization } from './useRegisterOrganization'

export { useRegisterOrganization }

export interface UseOrganizationSetupReturn {
  step: OrganizationSetupStep
  setStep: (step: OrganizationSetupStep) => void
  form: UseFormReturn<OrganizationFormValues>
  values: OrganizationFormValues
  logoFile?: File
  logoPreviewUrl: string | null
  goToNextStep: () => Promise<boolean>
  goToPrevStep: () => void
  goToStep: (step: OrganizationSetupStep) => void
  createOrganization: () => Promise<void>
  isPending: boolean
  error: AppError | null
}

/**
 * Converts an organization name into the backend workspace slug.
 *
 * Examples:
 *
 * Acme Technologies -> acme-technologies
 * Kodecept -> kodecept
 * My Company Ltd -> my-company-ltd
 */
export function generateWorkspaceSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
}

export function useOrganizationSetup(
  initialValues?: Partial<OrganizationFormValues>,
): UseOrganizationSetupReturn {
  const navigate = useNavigate()

  const [step, setStep] =
    useState<OrganizationSetupStep>(1)

  const registerMutation =
    useRegisterOrganization()

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    mode: 'onTouched',

    defaultValues: {
      organizationName:
        initialValues?.organizationName ?? '',

      industry:
        initialValues?.industry ?? '',

      workspaceUrl:
        initialValues?.workspaceUrl ?? '',

      timezone:
        initialValues?.timezone ??
        getDefaultTimezone(),

      language:
        initialValues?.language ?? 'en',

      theme:
        initialValues?.theme ?? 'dark',

      termsAccepted:
        initialValues?.termsAccepted ?? false,

      logo:
        initialValues?.logo ?? undefined,
    },
  })

  const rawLogo = form.watch('logo')

  const logoFile = useMemo<File | undefined>(() => {
    if (rawLogo instanceof File) {
      return rawLogo
    }

    if (
      typeof FileList !== 'undefined' &&
      rawLogo instanceof FileList &&
      rawLogo.length > 0
    ) {
      return rawLogo[0]
    }

    return undefined
  }, [rawLogo])

  const logoPreviewUrl =
    useObjectUrl(logoFile)

  const goToNextStep =
    async (): Promise<boolean> => {
      if (step === 1) {
        const isValid =
          await form.trigger([
            'organizationName',
            'industry',
            'workspaceUrl',
            'logo',
          ])

        if (!isValid) {
          return false
        }

        setStep(2)

        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })

        return true
      }

      if (step === 2) {
        const isValid =
          await form.trigger([
            'timezone',
            'language',
            'theme',
            'termsAccepted',
          ])

        if (!isValid) {
          return false
        }

        setStep(3)

        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })

        return true
      }

      return true
    }

  const goToPrevStep = () => {
    if (step === 2) {
      setStep(1)

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })

      return
    }

    if (step === 3) {
      setStep(2)

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }

  const goToStep = (
    targetStep: OrganizationSetupStep,
  ) => {
    if (targetStep < step) {
      setStep(targetStep)

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }

  const createOrganization = async () => {
    /*
     * Validate the complete form.
     */
    const isValid =
      await form.trigger()

    if (!isValid) {
      return
    }

    const values = form.getValues()

    const organizationName =
      values.organizationName.trim()

    /*
     * Generate workspace slug from organization name.
     *
     * Kodecept
     *   ↓
     * kodecept
     */
    const workspaceSlug =
      generateWorkspaceSlug(
        organizationName,
      )

    if (!workspaceSlug) {
      form.setError(
        'organizationName',
        {
          type: 'manual',
          message:
            'Enter a valid organization name',
        },
      )

      return
    }

    /*
     * Normalize timezone.
     */
    const timezone =
      values.timezone === 'Asia/Calcutta'
        ? 'Asia/Kolkata'
        : values.timezone

    const payload: OrganizationRegistrationPayload =
      {
        organizationName,

        industry:
          values.industry.trim(),

        workspaceUrl:
          workspaceSlug,

        timezone,

        language:
          values.language,

        theme:
          values.theme,

        termsAccepted:
          values.termsAccepted,

        logo:
          logoFile,
      }

    try {
      /*
       * The mutation stores the created organization before returning.
       * Its authenticated-user refresh runs in the background so it
       * cannot delay the redirect.
       */
      await registerMutation.mutateAsync(
        payload,
      )

      /*
       * Only navigate after the organization state
       * has been successfully established.
       */
      navigate('/dashboard', {
        replace: true,
      })
    } catch {
      /*
       * Do nothing here.
       *
       * registerMutation.error is exposed to the
       * review component and will display the API error.
       *
       * Most importantly, don't navigate to dashboard
       * when organization creation failed.
       */
    }
  }

  return {
    step,

    setStep,

    form,

    values:
      form.getValues(),

    logoFile,

    logoPreviewUrl,

    goToNextStep,

    goToPrevStep,

    goToStep,

    createOrganization,

    isPending:
      registerMutation.isPending,

    error:
      registerMutation.error,
  }
}
