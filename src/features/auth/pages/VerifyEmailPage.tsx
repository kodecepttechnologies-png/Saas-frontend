import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Alert } from '@/components/feedback/Alert'
import { Button, Input } from '@/components/ui'
import { useCooldown } from '../hooks/useCooldown'
import { useResendEmailOtp, useVerifyEmailOtp } from '../hooks/useEmailVerification'
import { verifyEmailSchema, type VerifyEmailFormValues } from '../schemas/auth.schemas'

const RESEND_SECONDS = 30

export function VerifyEmailPage() {
  const navigate = useNavigate()
  const emailParam = useSearchParams()[0].get('email') ?? ''
  const verify = useVerifyEmailOtp()
  const resend = useResendEmailOtp()
  // Arriving from registration means a code was just sent, so start the cooldown.
  const cooldown = useCooldown(emailParam ? RESEND_SECONDS : 0)

  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { email: emailParam, otp: '' },
  })

  const onSubmit = handleSubmit((values) =>
    verify.mutate(values, {
      onSuccess: () => navigate('/login', { replace: true, state: { verified: true } }),
    }),
  )

  const onResend = async () => {
    if (!(await trigger('email'))) return
    resend.mutate({ email: getValues('email') }, { onSuccess: () => cooldown.start(RESEND_SECONDS) })
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Verify your email</h1>
      <p className="mt-1 text-sm text-fg-muted">Enter the 6-digit code we sent to your inbox.</p>

      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
        {verify.error && <Alert tone="error">{verify.error.message}</Alert>}
        {resend.error && <Alert tone="error">{resend.error.message}</Alert>}
        {resend.isSuccess && <Alert tone="success">A new code is on its way.</Alert>}

        <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <Input
          label="Verification code"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="123456"
          error={errors.otp?.message}
          {...register('otp')}
        />

        <Button type="submit" size="lg" className="w-full" loading={verify.isPending}>
          Verify email
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          onClick={onResend}
          loading={resend.isPending}
          disabled={cooldown.remaining > 0}
        >
          {cooldown.remaining > 0 ? `Resend code in ${cooldown.remaining}s` : 'Resend code'}
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
