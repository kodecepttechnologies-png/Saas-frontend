import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Alert } from '@/components/feedback/Alert'
import { PasswordInput } from '@/components/forms/PasswordInput'
import { Button, Input } from '@/components/ui'
import { useResetPassword } from '../hooks/usePasswordReset'
import { resetPasswordSchema, type ResetPasswordFormValues } from '../schemas/auth.schemas'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  // The token format is whatever the backend emails; we only pass it through.
  const tokenParam = useSearchParams()[0].get('token') ?? ''
  const reset = useResetPassword()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token: tokenParam },
  })

  const onSubmit = handleSubmit(({ token, password }) =>
    reset.mutate(
      { token, password },
      { onSuccess: () => navigate('/login', { replace: true, state: { passwordReset: true } }) },
    ),
  )

  return (
    <>
      <h1 className="text-2xl font-bold">Choose a new password</h1>
      <p className="mt-1 text-sm text-fg-muted">Pick something you haven't used before.</p>

      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
        {reset.error && <Alert tone="error">{reset.error.message}</Alert>}

        {/* Only ask for the token when the link didn't carry one. */}
        {tokenParam ? (
          <input type="hidden" {...register('token')} />
        ) : (
          <Input label="Reset token" error={errors.token?.message} {...register('token')} />
        )}
        <PasswordInput
          label="New password"
          autoComplete="new-password"
          hint="Use at least 8 characters."
          error={errors.password?.message}
          {...register('password')}
        />
        <PasswordInput
          label="Confirm new password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button type="submit" size="lg" className="w-full" loading={reset.isPending}>
          Update password
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-fg-muted">
        <Link to="/login" className="font-semibold text-primary-hover hover:underline">
          Back to sign in
        </Link>
      </p>
    </>
  )
}
