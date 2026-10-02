import { z } from 'zod'

const email = z.string().trim().min(1, 'Enter your email').email('Enter a valid email address')
// Backend password rules are undocumented; the backend stays the final authority.
const newPassword = z.string().min(8, 'Use at least 8 characters')

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Enter your password'),
})

export const registerSchema = z
  .object({
    username: z.string().trim().min(3, 'Use at least 3 characters'),
    email,
    password: newPassword,
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

export const verifyEmailSchema = z.object({
  email,
  otp: z.string().regex(/^\d{6}$/, 'Enter the 6-digit code'),
})

export const forgotPasswordSchema = z.object({ email })

export const resetPasswordSchema = z
  .object({
    token: z.string().trim().min(1, 'Enter the reset token from your email'),
    password: newPassword,
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
