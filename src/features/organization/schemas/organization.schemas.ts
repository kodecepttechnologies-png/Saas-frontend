import { z } from 'zod'

export const organizationSchema = z.object({
  organizationName: z.string().trim().min(1, 'Enter your organization name'),
  industry: z.string().trim().min(1, 'Enter your industry'),
  // Workspace URL: format is undocumented so only block empty values and spaces.
  workspaceUrl: z
    .string()
    .trim()
    .min(1, 'Enter a workspace address')
    .regex(/^\S+$/, 'The address cannot contain spaces'),
  timezone: z.string().min(1, 'Choose a timezone'),
  language: z.string().min(1, 'Choose a language'),
  theme: z.string().min(1, 'Choose a theme'),
  termsAccepted: z.boolean().refine((v) => v === true, 'Accept the terms to continue'),
  logo: z
    .custom<File | FileList | undefined>()
    .optional()
    .refine((val) => {
      if (!val) return true
      if (typeof File !== 'undefined' && val instanceof File) {
        return val.type.startsWith('image/')
      }
      if (typeof FileList !== 'undefined' && val instanceof FileList) {
        return val.length === 0 || val[0].type.startsWith('image/')
      }
      return true
    }, 'Please choose an image file (PNG, JPG, SVG, WebP)'),
})

export type OrganizationFormValues = z.infer<typeof organizationSchema>
