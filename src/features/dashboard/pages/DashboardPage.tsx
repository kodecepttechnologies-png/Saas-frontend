import { Building2, ExternalLink, Globe, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { allNavItems } from '@/components/navigation/navConfig'
import { Badge, buttonStyles, Card, PageHeader } from '@/components/ui'
import { OrganizationBrand } from '@/features/organization/components/OrganizationBrand'
import { useAuth } from '@/hooks/useAuth'
import { useOrganization } from '@/hooks/useOrganization'

const areas = allNavItems.filter((item) => item.to !== '/dashboard' && !item.to.startsWith('/organization'))

export function DashboardPage() {
  const { user } = useAuth()
  const { organization, hasOrganization } = useOrganization()
  const name = user?.username ?? user?.email

  return (
    <div className="space-y-6">
      <PageHeader
        title={name ? `Welcome, ${name}` : 'Welcome'}
        description="Here is your workspace overview and workforce management hub."
      />

      {hasOrganization && organization ? (
        <Card className="relative overflow-hidden border-primary/20 bg-surface shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <OrganizationBrand
                size="lg"
                subtitle={
                  organization.industry
                    ? `${organization.industry} • ${organization.workspaceUrl ? `${organization.workspaceUrl}.workspace` : 'Workspace'}`
                    : organization.workspaceUrl
                      ? `${organization.workspaceUrl}.workspace`
                      : 'Active SaaS Tenant'
                }
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="success" className="px-3 py-1 text-xs">
                Active Organization
              </Badge>
              <Link
                to="/organization/setup"
                className={buttonStyles('secondary', 'sm', 'gap-1.5')}
              >
                <span>Workspace Details</span>
                <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-border/60 pt-4 text-xs text-fg-muted">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary-hover shrink-0" />
              <span className="truncate">
                Industry: <strong className="text-fg font-medium">{organization.industry || '—'}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary-hover shrink-0" />
              <span className="truncate font-mono">
                Slug: <strong className="text-fg font-medium">{organization.workspaceUrl || '—'}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary-hover shrink-0" />
              <span className="truncate">
                Timezone: <strong className="text-fg font-medium">{organization.timezone || 'UTC'}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary-hover font-semibold">LOC:</span>
              <span className="truncate">
                Language: <strong className="text-fg font-medium">{(organization.language || 'en').toUpperCase()}</strong>
              </span>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="flex flex-col gap-4 border-primary/40 bg-surface sm:flex-row sm:items-center">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary">
            <Building2 aria-hidden="true" className="h-6 w-6 text-white" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-fg">Set up your organization</h2>
            <p className="text-sm text-fg-muted">
              Create your organization to establish workspace identity and start managing your workforce.
            </p>
          </div>
          <Link to="/organization/setup" className={buttonStyles('primary', 'md', 'w-full sm:w-auto')}>
            Set up organization
          </Link>
        </Card>
      )}

      <section aria-labelledby="areas-heading">
        <h2 id="areas-heading" className="mb-3 text-lg font-bold text-fg">
          Workspace areas
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {areas.map(({ label, to, icon: Icon, description, enabled }) => (
            <li key={to}>
              <Card className="flex h-full items-start gap-3 transition-colors hover:border-primary-hover/40">
                <Icon aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0 text-primary-hover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    {enabled ? (
                      <Link to={to} className="font-semibold text-fg hover:underline">
                        {label}
                      </Link>
                    ) : (
                      <span className="font-semibold text-fg-secondary">{label}</span>
                    )}
                    {!enabled && <Badge tone="neutral">Coming soon</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-fg-muted">{description}</p>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
