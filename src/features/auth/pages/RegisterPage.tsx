import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Alert } from '@/components/feedback/Alert'
import { PasswordInput } from '@/components/forms/PasswordInput'
import { Button, Input } from '@/components/ui'
import { useRegister } from '../hooks/useRegister'
import { registerSchema, type RegisterFormValues } from '../schemas/auth.schemas'

export function RegisterPage() {
  const navigate = useNavigate()
  const registerUser = useRegister()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) })

  const onSubmit = handleSubmit((values) =>
    registerUser.mutate(values, {
      onSuccess: () => navigate('/organization/setup'),
    }),
  )

  return (
    <>
      <h1 className="text-2xl font-bold">Create your account</h1>
      <p className="mt-1 text-sm text-fg-muted">We'll email you a 6-digit code to verify your address.</p>

      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
        {registerUser.error && <Alert tone="error">{registerUser.error.message}</Alert>}

        <Input label="Username" autoComplete="username" error={errors.username?.message} {...register('username')} />
        <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <PasswordInput
          label="Password"
          autoComplete="new-password"
          hint="Use at least 8 characters."
          error={errors.password?.message}
          {...register('password')}
        />
        <PasswordInput
          label="Confirm password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button type="submit" size="lg" className="w-full" loading={registerUser.isPending}>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-fg-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-primary-hover hover:underline">
          Sign in
        </Link>
      </p>
    </>
  )
}
