import { Link, NavLink } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { OrganizationBrand } from '@/features/organization/components/OrganizationBrand'
import { useOrganization } from '@/hooks/useOrganization'
import { cn } from '@/utils/cn'
import { navGroups } from './navConfig'

const rowBase = 'flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold'

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { organization, hasOrganization } = useOrganization()

  return (
    <div className="flex flex-col h-full">
      {/* Organization Branding Section: Display [Organization Logo] Organization Name */}
      <div className="border-b border-border p-3">
        <Link
          to={hasOrganization ? '/dashboard' : '/organization/setup'}
          onClick={onNavigate}
          className="group block rounded-xl p-2 transition-colors hover:bg-surface-secondary/70 focus-visible:ring-2 focus-visible:ring-primary-hover"
        >
          <OrganizationBrand
            size="md"
            subtitle={
              organization?.workspaceUrl
                ? `${organization.workspaceUrl}.workspace`
                : hasOrganization
                  ? 'Active Workspace'
                  : 'Setup Required'
            }
          />
        </Link>
      </div>

      <nav aria-label="Main" className="space-y-6 p-4 flex-1 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label ?? 'main'}>
            {group.label && (
              <h2 className="mb-2 px-3 text-xs font-semibold text-fg-muted uppercase tracking-wider">
                {group.label}
              </h2>
            )}
            <ul className="space-y-1">
              {group.items.map(({ label, to, icon: Icon, enabled }) => (
                <li key={to}>
                  {enabled ? (
                    <NavLink
                      to={to}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        cn(
                          rowBase,
                          isActive
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-fg-secondary hover:bg-surface-secondary hover:text-fg',
                        )
                      }
                    >
                      <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
                      <span>{label}</span>
                    </NavLink>
                  ) : (
                    <span aria-disabled="true" className={cn(rowBase, 'cursor-not-allowed text-fg-muted')}>
                      <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
                      <span className="flex-1">{label}</span>
                      <Badge tone="neutral">Soon</Badge>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  )
}
