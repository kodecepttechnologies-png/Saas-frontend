import { apiClient } from '@/services/apiClient'
import { API_PREFIX } from '@/utils/constants'
import type {
  OrganizationRegistrationPayload,
  RegisterOrganizationResponse,
} from '../types/organization.types'
import { extractOrganization } from '../utils/organization'

export const organizationApi = {
  /**
   * Registers a new organization.
   * Uses multipart/form-data for optional logo upload.
   * Axios and browser handle boundary automatically without manual boundary configuration.
   * Authorization header is attached automatically via the central apiClient auth interceptor.
   */
  async register(payload: OrganizationRegistrationPayload): Promise<RegisterOrganizationResponse> {
    const formData = new FormData()

    formData.append('organizationName', payload.organizationName)
    formData.append('industry', payload.industry)
    formData.append('workspaceUrl', payload.workspaceUrl)
    formData.append('timezone', payload.timezone)
    formData.append('language', payload.language)
    formData.append('theme', payload.theme)
    formData.append('termsAccepted', String(payload.termsAccepted))

    if (payload.logo) {
      formData.append('logo', payload.logo)
    }

    const { data } = await apiClient.post(`${API_PREFIX}/auth/register-organization`, formData)
    const organization = extractOrganization(data, payload)

    return {
      raw: data,
      organization,
      organizationId: organization?.id,
    }
  },
}
