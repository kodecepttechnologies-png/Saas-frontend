import { z } from 'zod'

export const organizationSchema = z.object({
  organizationName: z
    .string()
    .trim()
    .min(1, 'Enter your organization name'),

  industry: z
    .string()
    .trim()
    .min(1, 'Enter your industry'),

  workspaceUrl: z
    .string()
    .trim()
    .min(1, 'Enter a workspace address')
    .regex(/^\S+$/, 'The address cannot contain spaces'),

  timezone: z
    .string()
    .min(1, 'Choose a timezone'),

  language: z
    .string()
    .min(1, 'Choose a language'),

  theme: z
    .string()
    .min(1, 'Choose a theme'),

  termsAccepted: z
    .boolean()
    .refine(
      (value) => value === true,
      'Accept the terms to continue',
    ),

  logo: z
    .custom<File | FileList | undefined>()
    .optional()
    .refine((value) => {
      if (!value) {
        return true
      }

      if (
        typeof File !== 'undefined' &&
        value instanceof File
      ) {
        return value.type.startsWith('image/')
      }

      if (
        typeof FileList !== 'undefined' &&
        value instanceof FileList
      ) {
        return (
          value.length === 0 ||
          value[0].type.startsWith('image/')
        )
      }

      return true
    }, 'Please choose an image file (PNG, JPG, SVG, WebP)'),
})

export type OrganizationFormValues =
  z.infer<typeof organizationSchema>

export const stepOneSchema = organizationSchema.pick({
  organizationName: true,
  industry: true,
  workspaceUrl: true,
  logo: true,
})

export type StepOneFormValues =
  z.infer<typeof stepOneSchema>

export const stepTwoSchema = organizationSchema.pick({
  timezone: true,
  language: true,
  theme: true,
  termsAccepted: true,
})

export type StepTwoFormValues =
  z.infer<typeof stepTwoSchema>