import { useState } from 'react'
import { Building2, Layers } from 'lucide-react'
import { env } from '@/config/env'
import { useOrganization } from '@/hooks/useOrganization'
import { cn } from '@/utils/cn'

export interface OrganizationBrandProps {
  /** Override organization name */
  name?: string
  /** Override organization logo URL/path */
  logo?: string
  /** Optional subtitle, such as workspace URL or category */
  subtitle?: string
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Header tone variant */
  tone?: 'default' | 'onPrimary'
  /** Toggle logo image / icon visibility */
  showLogo?: boolean
  /** Toggle name text visibility */
  showName?: boolean
  /** Toggle subtitle text visibility */
  showSubtitle?: boolean
  /** Custom fallback text when no active organization exists */
  fallbackName?: string
  /** Container styling */
  className?: string
  /** Logo container styling */
  logoClassName?: string
  /** Organization name typography styling */
  nameClassName?: string
}

function getInitials(name?: string): string {
  if (!name) return 'W'
  const words = name.trim().split(/\s+/)
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

function resolveLogoUrl(url?: string): string | undefined {
  if (!url) return undefined
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url
  }
  // Relative server path returned by backend
  const cleanPath = url.startsWith('/') ? url : `/${url}`
  return `${env.apiBaseUrl}${cleanPath}`
}

export function OrganizationBrand({
  name: propName,
  logo: propLogo,
  subtitle,
  size = 'md',
  tone = 'default',
  showLogo = true,
  showName = true,
  showSubtitle = true,
  fallbackName = 'SaaS Workspace',
  className,
  logoClassName,
  nameClassName,
}: OrganizationBrandProps) {
  const { organization, organizationName: contextName, organizationLogo: contextLogo, logoUrl: contextLogoUrl, hasOrganization } = useOrganization()
  const [imgError, setImgError] = useState(false)

  const activeName = propName ?? contextName ?? organization?.name ?? (hasOrganization ? 'Workspace' : fallbackName)
  const rawLogo = propLogo ?? contextLogo ?? contextLogoUrl ?? organization?.logo ?? organization?.logoUrl
  const activeLogoUrl = resolveLogoUrl(rawLogo)
  const isDefaultGeneric = !hasOrganization && !propName

  const sizeClasses = {
    sm: {
      container: 'gap-2',
      logoBox: 'h-8 w-8 rounded-lg text-xs',
      icon: 'h-4 w-4',
      name: 'text-sm font-bold',
      subtitle: 'text-[11px]',
    },
    md: {
      container: 'gap-3',
      logoBox: 'h-10 w-10 rounded-xl text-sm',
      icon: 'h-5 w-5',
      name: 'text-base font-bold',
      subtitle: 'text-xs',
    },
    lg: {
      container: 'gap-4',
      logoBox: 'h-14 w-14 rounded-2xl text-lg',
      icon: 'h-7 w-7',
      name: 'text-xl font-extrabold',
      subtitle: 'text-sm',
    },
  }[size]

  return (
    <div className={cn('flex items-center min-w-0', sizeClasses.container, className)}>
      {showLogo && (
        <div
          className={cn(
            'flex shrink-0 items-center justify-center overflow-hidden border border-border shadow-sm',
            sizeClasses.logoBox,
            activeLogoUrl && !imgError
              ? 'bg-surface p-0.5'
              : tone === 'onPrimary'
                ? 'bg-white/15 text-white font-black tracking-wider border-white/20'
                : 'bg-primary text-white font-black tracking-wider',
            logoClassName,
          )}
        >
          {activeLogoUrl && !imgError ? (
            <img
              src={activeLogoUrl}
              alt={`${activeName} logo`}
              className="h-full w-full object-contain rounded-[inherit]"
              onError={() => setImgError(true)}
            />
          ) : isDefaultGeneric ? (
            <Layers aria-hidden="true" className={sizeClasses.icon} />
          ) : activeName ? (
            <span>{getInitials(activeName)}</span>
          ) : (
            <Building2 aria-hidden="true" className={sizeClasses.icon} />
          )}
        </div>
      )}

      {(showName || (showSubtitle && subtitle)) && (
        <div className="min-w-0 flex-1">
          {showName && (
            <p
              className={cn(
                'truncate leading-tight font-extrabold tracking-tight',
                tone === 'onPrimary' ? 'text-white' : 'text-fg',
                sizeClasses.name,
                nameClassName,
              )}
              title={activeName}
            >
              {activeName}
            </p>
          )}
          {showSubtitle && subtitle && (
            <p className={cn('truncate text-fg-muted leading-tight mt-0.5', sizeClasses.subtitle)}>
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  )
}