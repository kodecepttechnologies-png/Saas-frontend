import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage'
import { VerifyEmailPage } from '@/features/auth/pages/VerifyEmailPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { OrganizationSetupPage } from '@/features/organization/pages/OrganizationSetupPage'
import { AppLayout } from '@/layouts/AppLayout/AppLayout'
import { AuthLayout } from '@/layouts/AuthLayout/AuthLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicRoute } from './PublicRoute'

function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="text-fg-muted">The page you opened does not exist.</p>
      <Link to="/dashboard" className="font-semibold text-primary-hover underline">
        Back to dashboard
      </Link>
    </main>
  )
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route element={<AuthLayout />}>
        {/* Signed-in users are redirected away from these */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>
        {/* Reachable from email links, signed in or not */}
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* Signed-in app: header + sidebar shell */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/organization/setup" element={<OrganizationSetupPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
