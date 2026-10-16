import { ArrowLeft, Building2, CheckCircle2, Globe, Languages, Loader2, Sparkles, SunMoon } from 'lucide-react'
import { Alert } from '@/components/feedback/Alert'
import { Badge, Button, Card } from '@/components/ui'
import type { AppError } from '@/services/errorHandler'
import type { OrganizationFormValues } from '../schemas/organization.schemas'
import { languageOptions } from '../utils/options'

export interface OrganizationReviewStepProps {
  values: OrganizationFormValues
  logoPreviewUrl: string | null
  logoFile?: File
  onBack: () => void
  onSubmit: () => void
  isPending: boolean
  error?: AppError | null
}

export function OrganizationReviewStep({
  values,
  logoPreviewUrl,
  logoFile,
  onBack,
  onSubmit,
  isPending,
  error,
}: OrganizationReviewStepProps) {
  const languageLabel =
    languageOptions.find((l) => l.value === values.language)?.label ?? values.language

  const themeLabel =
    values.theme.charAt(0).toUpperCase() + values.theme.slice(1).toLowerCase()

  return (
    <Card className="border border-border/80 bg-surface shadow-2xl p-6 sm:p-8 rounded-2xl space-y-6">
      {/* Centralized API Error Alert */}
      {error && (
        <Alert tone="error" className="animate-shake">
          {error.message || 'Unable to create your organization. Please check your information and try again.'}
        </Alert>
      )}

      {/* Overview Header / Logo Preview Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border/70 bg-surface-secondary/60 p-4 sm:p-5">
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-surface p-1 shadow-sm">
            {logoPreviewUrl ? (
              <img
                src={logoPreviewUrl}
                alt="Selected logo"
                className="h-full w-full object-contain rounded-lg"
              />
            ) : (
              <Building2 className="h-8 w-8 text-primary-hover" aria-hidden="true" />
            )}
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-fg truncate">
              {values.organizationName || 'Untitled Organization'}
            </h2>
            <p className="text-xs sm:text-sm font-mono text-primary-hover truncate">
              {values.workspaceUrl ? `${values.workspaceUrl}.workspace` : 'Not set'}
            </p>
            {logoFile && (
              <span className="inline-block mt-1 text-[11px] text-fg-muted truncate">
                Logo: {logoFile.name} ({(logoFile.size / 1024).toFixed(1)} KB)
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <Badge tone="success">Ready to launch</Badge>
        </div>
      </div>

      {/* Review Details Grid */}
      <div className="grid gap-3 sm:grid-cols-2 text-sm">
        <div className="rounded-xl border border-border/70 bg-surface-secondary/40 p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-fg-muted">
            <Building2 className="h-3.5 w-3.5 text-primary-hover" />
            <span>Organization</span>
          </div>
          <p className="font-bold text-fg truncate">{values.organizationName}</p>
        </div>

        <div className="rounded-xl border border-border/70 bg-surface-secondary/40 p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-fg-muted">
            <Globe className="h-3.5 w-3.5 text-primary-hover" />
            <span>Workspace</span>
          </div>
          <p className="font-mono font-bold text-primary-hover truncate">
            {values.workspaceUrl}
          </p>
        </div>

        <div className="rounded-xl border border-border/70 bg-surface-secondary/40 p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-fg-muted">
            <Sparkles className="h-3.5 w-3.5 text-primary-hover" />
            <span>Industry</span>
          </div>
          <p className="font-semibold text-fg truncate">{values.industry}</p>
        </div>

        <div className="rounded-xl border border-border/70 bg-surface-secondary/40 p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-fg-muted">
            <Globe className="h-3.5 w-3.5 text-primary-hover" />
            <span>Timezone</span>
          </div>
          <p className="font-semibold text-fg truncate">{values.timezone}</p>
        </div>

        <div className="rounded-xl border border-border/70 bg-surface-secondary/40 p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-fg-muted">
            <Languages className="h-3.5 w-3.5 text-primary-hover" />
            <span>Language</span>
          </div>
          <p className="font-semibold text-fg truncate">{languageLabel}</p>
        </div>

        <div className="rounded-xl border border-border/70 bg-surface-secondary/40 p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-fg-muted">
            <SunMoon className="h-3.5 w-3.5 text-primary-hover" />
            <span>Theme</span>
          </div>
          <p className="font-semibold text-fg truncate">{themeLabel}</p>
        </div>
      </div>

      {/* Terms confirmation badge */}
      <div className="flex items-center gap-2 text-xs text-success font-medium bg-success/5 border border-success/20 rounded-lg p-3">
        <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
        <span>Terms and Conditions accepted</span>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 border-t border-border/60">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={onBack}
          disabled={isPending}
          className="w-full sm:w-auto gap-2"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          <span>Back</span>
        </Button>

        <Button
          type="button"
          size="lg"
          onClick={onSubmit}
          loading={isPending}
          disabled={isPending}
          className="w-full sm:w-auto min-w-[210px] font-bold shadow-lg shadow-primary/25"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating organization...
            </span>
          ) : (
            'Create Organization'
          )}
        </Button>
      </div>
    </Card>
  )
}
