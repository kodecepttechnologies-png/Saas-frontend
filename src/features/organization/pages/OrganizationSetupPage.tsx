import { ArrowLeft, Building2, CheckCircle2, Globe, Shield, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Alert } from '@/components/feedback/Alert'
import { Badge, buttonStyles, Card, PageHeader } from '@/components/ui'
import { useOrganization } from '@/hooks/useOrganization'
import { OrganizationBrand } from '../components/OrganizationBrand'
import { OrganizationInformationStep } from '../components/OrganizationInformationStep'
import { OrganizationReviewStep } from '../components/OrganizationReviewStep'
import { OrganizationSetupLayout } from '../components/OrganizationSetupLayout'
import { WorkspaceConfigurationStep } from '../components/WorkspaceConfigurationStep'
import { useOrganizationSetup } from '../hooks/useOrganizationSetup'
import type { OrganizationSetupStep } from '../types/organization.types'

const STEP_COPY: Record<OrganizationSetupStep, { title: string; subtitle: string }> = {
  1: {
    title: 'Organization Information',
    subtitle: 'Tell us about your organization',
  },
  2: {
    title: 'Configure your workspace',
    subtitle: 'Choose how your workspace should look and work',
  },
  3: {
    title: "You're all set!",
    subtitle: 'Your organization is ready to go.',
  },
}

export function OrganizationSetupPage() {
  const { organization, organizationId, hasOrganization } = useOrganization()
  const {
    step,
    form,
    values,
    logoFile,
    logoPreviewUrl,
    goToNextStep,
    goToPrevStep,
    goToStep,
    createOrganization,
    isPending,
    error,
  } = useOrganizationSetup()

  // If the organization setup is already completed, do not force the user through setup again.
  // Instead, present the active workspace profile card with an option to return to the dashboard.
  if (hasOrganization && organization) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 sm:p-8">
        <div className="w-full max-w-2xl space-y-6">
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

          <Card className="space-y-6 border border-border bg-surface p-6 sm:p-8 rounded-2xl">
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
      </div>
    )
  }

  const { title, subtitle } = STEP_COPY[step]

  return (
    <OrganizationSetupLayout
      currentStep={step}
      onStepClick={goToStep}
      title={title}
      subtitle={subtitle}
    >
      {step === 1 && (
        <OrganizationInformationStep
          form={form}
          onContinue={goToNextStep}
          isPending={isPending}
        />
      )}

      {step === 2 && (
        <WorkspaceConfigurationStep
          form={form}
          onContinue={goToNextStep}
          onBack={goToPrevStep}
          isPending={isPending}
        />
      )}

      {step === 3 && (
        <OrganizationReviewStep
          values={values}
          logoFile={logoFile}
          logoPreviewUrl={logoPreviewUrl}
          onBack={goToPrevStep}
          onSubmit={createOrganization}
          isPending={isPending}
          error={error}
        />
      )}
    </OrganizationSetupLayout>
  )
}
