import type { SelectOption } from '@/components/ui'

export const industryOptions: SelectOption[] = [
  {
    value: '',
    label: 'Select an industry',
  },
  {
    value: 'Software',
    label: 'Software / Technology',
  },
  {
    value: 'Finance',
    label: 'Finance & Banking',
  },
  {
    value: 'Healthcare',
    label: 'Healthcare & Life Sciences',
  },
  {
    value: 'E-commerce',
    label: 'E-commerce & Retail',
  },
  {
    value: 'Education',
    label: 'Education & EdTech',
  },
  {
    value: 'Marketing',
    label: 'Marketing & Advertising',
  },
  {
    value: 'Real Estate',
    label: 'Real Estate & Construction',
  },
  {
    value: 'Consulting',
    label: 'Consulting & Professional Services',
  },
  {
    value: 'Manufacturing',
    label: 'Manufacturing & Logistics',
  },
  {
    value: 'Other',
    label: 'Other',
  },
]

export const languageOptions: SelectOption[] = [
  {
    value: 'en',
    label: 'English',
  },
  {
    value: 'es',
    label: 'Spanish',
  },
  {
    value: 'fr',
    label: 'French',
  },
  {
    value: 'de',
    label: 'German',
  },
  {
    value: 'hi',
    label: 'Hindi',
  },
]

export const themeOptions: SelectOption[] = [
  {
    value: 'dark',
    label: 'Dark',
  },
  {
    value: 'light',
    label: 'Light',
  },
]

const FALLBACK_TIMEZONES = [
  'UTC',
  'Asia/Kolkata',
  'Europe/London',
  'Europe/Berlin',
  'America/New_York',
  'America/Los_Angeles',
  'Asia/Dubai',
  'Asia/Singapore',
  'Australia/Sydney',
]

export function getTimezoneOptions(): SelectOption[] {
  const intl = Intl as unknown as {
    supportedValuesOf?: (
      key: string,
    ) => string[]
  }

  const zones =
    intl.supportedValuesOf?.('timeZone') ??
    FALLBACK_TIMEZONES

  const normalizedZones = Array.from(
    new Set(
      zones.map((zone) =>
        zone === 'Asia/Calcutta'
          ? 'Asia/Kolkata'
          : zone,
      ),
    ),
  )

  return normalizedZones.map((zone) => ({
    value: zone,
    label: zone.replace(/_/g, ' '),
  }))
}

export function getDefaultTimezone(): string {
  const timezone =
    Intl.DateTimeFormat()
      .resolvedOptions()
      .timeZone

  if (timezone === 'Asia/Calcutta') {
    return 'Asia/Kolkata'
  }

  return timezone || 'UTC'
}