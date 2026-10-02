import { useContext } from 'react'
import { OrganizationContext } from '@/app/providers/organizationContext'

export function useOrganization() {
  const ctx = useContext(OrganizationContext)
  if (!ctx) {
    throw new Error('useOrganization must be used inside <OrganizationProvider>')
  }
  return ctx
}
