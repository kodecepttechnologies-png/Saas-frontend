import { ArrowLeft, Building2, CheckCircle2, Globe, Shield, Sparkles } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert } from '@/components/feedback/Alert'
import { Badge, buttonStyles, Card, PageHeader } from '@/components/ui'
import { useOrganization } from '@/hooks/useOrganization'
import { OrganizationBrand } from '../components/OrganizationBrand'
import { OrganizationForm } from '../components/OrganizationForm'
import { useRegisterOrganization } from '../hooks/useRegisterOrganization'
import type { OrganizationRegistrationPayload } from '../types/organization.types'

export function OrganizationSetupPage() {
  const navigate = useNavigate()
  const { organization, organizationId, hasOrganization } = useOrganization()
  const registerOrganization = useRegisterOrganization()

  const handleCreateOrganization = (payload: OrganizationRegistrationPayload) => {
    registerOrganization.mutate(payload, {
      onSuccess: () => {
        navigate('/dashboard', { replace: true })
      },
    })
  }

  // When an organization is already configured, present active workspace status
  if (hasOrganization && organization) {
    return (
      <div className="max-w-3xl space-y-6">
        <PageHeader
          title="Organization Workspace"
          description="Your active tenant workspace identity for workforce management."
        />

        <Alert tone="success" className="border-success/40 bg-success/10">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <span>Organization workspace is configured and active.</span>
          </div>
        </Alert>

        <Card className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
            <OrganizationBrand size="lg" />
            <div className="flex items-center gap-2">
              <Badge tone="success">Active Workspace</Badge>
              <Badge tone="primary">Tenant</Badge>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div className="rounded-xl border border-border bg-surface-secondary/50 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-fg-muted mb-1">
                <Building2 className="h-4 w-4 text-primary-hover" />
                Industry
              </div>
              <p className="font-semibold text-fg">{organization.industry || 'Not specified'}</p>
            </div>

            <div className="rounded-xl border border-border bg-surface-secondary/50 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-fg-muted mb-1">
                <Globe className="h-4 w-4 text-primary-hover" />
                Workspace Address
              </div>
              <p className="font-mono text-sm font-semibold text-primary-hover">
                {organization.workspaceUrl ? `${organization.workspaceUrl}.workspace` : 'Not specified'}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-surface-secondary/50 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-fg-muted mb-1">
                <Sparkles className="h-4 w-4 text-primary-hover" />
                Timezone & Language
              </div>
              <p className="font-semibold text-fg">
                {organization.timezone || 'UTC'} • {(organization.language || 'en').toUpperCase()}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-surface-secondary/50 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-fg-muted mb-1">
                <Shield className="h-4 w-4 text-primary-hover" />
                Tenant Identifier
              </div>
              <p className="font-mono text-xs text-fg-muted truncate" title={organizationId}>
                {organizationId || '—'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link to="/dashboard" className={buttonStyles('primary', 'md')}>
              <ArrowLeft className="h-4 w-4" />
              Go to Dashboard
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="Set up your organization"
        description="This creates the workspace identity your team will use throughout the application."
      />

      <Card>
        <OrganizationForm
          onSubmit={handleCreateOrganization}
          isPending={registerOrganization.isPending}
          error={registerOrganization.error}
        />
      </Card>
    </div>
  )
}
