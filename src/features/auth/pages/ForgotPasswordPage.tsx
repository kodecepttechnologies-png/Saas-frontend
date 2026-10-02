import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Alert } from '@/components/feedback/Alert'
import { Button, Input } from '@/components/ui'
import { useForgotPassword } from '../hooks/usePasswordReset'
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '../schemas/auth.schemas'

export function ForgotPasswordPage() {
  const forgot = useForgotPassword()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema) })

  const onSubmit = handleSubmit((values) => forgot.mutate(values))

  return (
    <>
      <h1 className="text-2xl font-bold">Reset your password</h1>
      <p className="mt-1 text-sm text-fg-muted">Enter your email and we'll send reset instructions.</p>

      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
        {forgot.error && <Alert tone="error">{forgot.error.message}</Alert>}
        {forgot.isSuccess && <Alert tone="success">Check your email for reset instructions.</Alert>}

        <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />

        <Button type="submit" size="lg" className="w-full" loading={forgot.isPending}>
          Send reset instructions
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
