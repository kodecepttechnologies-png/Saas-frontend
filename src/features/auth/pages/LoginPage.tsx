import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Alert } from '@/components/feedback/Alert'
import { PasswordInput } from '@/components/forms/PasswordInput'
import { Button, Input } from '@/components/ui'
import { useLogin } from '../hooks/useLogin'
import { loginSchema, type LoginFormValues } from '../schemas/auth.schemas'

interface LoginLocationState {
  from?: { pathname?: string }
  verified?: boolean
  passwordReset?: boolean
}

export function LoginPage() {
  const navigate = useNavigate()
  const state = useLocation().state as LoginLocationState | null
  const login = useLogin()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  const onSubmit = handleSubmit((values) =>
    login.mutate(values, {
      onSuccess: () => navigate(state?.from?.pathname ?? '/dashboard', { replace: true }),
    }),
  )

  return (
    <>
      <h1 className="text-2xl font-bold">Sign in</h1>
      <p className="mt-1 text-sm text-fg-muted">Welcome back. Enter your details to continue.</p>

      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
        {state?.verified && <Alert tone="success">Email verified. You can sign in now.</Alert>}
        {state?.passwordReset && <Alert tone="success">Password updated. Sign in with your new password.</Alert>}
        {login.error && <Alert tone="error">{login.error.message}</Alert>}

        <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <PasswordInput
          label="Password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="text-right text-sm">
          <Link to="/forgot-password" className="font-semibold text-primary-hover hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="lg" className="w-full" loading={login.isPending}>
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-fg-muted">
        New here?{' '}
        <Link to="/register" className="font-semibold text-primary-hover hover:underline">
          Create an account
        </Link>
      </p>
      <p className="mt-2 text-center text-sm text-fg-muted">
        Didn't verify your email?{' '}
        <Link to="/verify-email" className="font-semibold text-primary-hover hover:underline">
          Enter your code
        </Link>
      </p>
    </>
  )
}
