import type { SelectOption } from '@/components/ui'

/**
 * ASSUMPTION TO VERIFY: accepted values for language and theme are undocumented.
 * Change these lists in one place if the backend expects different values.
 */
export const languageOptions: SelectOption[] = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'hi', label: 'Hindi' },
]

export const themeOptions: SelectOption[] = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
]

const FALLBACK_TIMEZONES = ['UTC', 'Asia/Kolkata', 'Europe/London', 'Europe/Berlin', 'America/New_York', 'America/Los_Angeles', 'Asia/Dubai', 'Asia/Singapore', 'Australia/Sydney']

export function getTimezoneOptions(): SelectOption[] {
  // Intl.supportedValuesOf is newer than our TS lib target, so it is accessed defensively.
  const intl = Intl as unknown as { supportedValuesOf?: (key: string) => string[] }
  const zones = intl.supportedValuesOf?.('timeZone') ?? FALLBACK_TIMEZONES
  return zones.map((z) => ({ value: z, label: z.replace(/_/g, ' ') }))
}

export function getDefaultTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
}
