import { apiClient } from '@/services/apiClient'
import { AppError } from '@/services/errorHandler'
import { API_PREFIX } from '@/utils/constants'
import type {
  Organization,
  OrganizationRegistrationPayload,
} from '../types/organization.types'
import { extractOrganization } from '../utils/organization'

export const organizationApi = {
  /**
   * Registers the authenticated user's organization.
   *
   * The backend determines ownership from the JWT.
   *
   * multipart/form-data is required because the logo
   * is optional and may be uploaded as a File.
   */
  async register(
    payload: OrganizationRegistrationPayload,
  ): Promise<Organization> {
    const formData = new FormData()

    formData.append(
      'organizationName',
      payload.organizationName,
    )

    formData.append(
      'industry',
      payload.industry,
    )

    formData.append(
      'workspaceUrl',
      payload.workspaceUrl,
    )

    formData.append(
      'timezone',
      payload.timezone,
    )

    formData.append(
      'language',
      payload.language,
    )

    formData.append(
      'theme',
      payload.theme,
    )

    formData.append(
      'termsAccepted',
      String(payload.termsAccepted),
    )

    if (payload.logo) {
      formData.append(
        'logo',
        payload.logo,
      )
    }

    /*
     * Axios automatically creates the correct
     * multipart/form-data boundary.
     */
    const { data } =
      await apiClient.post(
        `${API_PREFIX}/auth/register-organization`,
        formData,
      )

    /*
     * Pass the original payload as a fallback.
     *
     * This is useful if the backend response only
     * returns part of the organization.
     */
    const organization =
      extractOrganization(
        data,
        payload,
      )

    if (!organization) {
      throw new AppError(
        'Your organization was created, but we could not read its details. Please sign in again.',
      )
    }

    /*
     * The backend's customId is mapped to `id`
     * inside normalizeOrganization().
     *
     * Example:
     *
     * customId: ORG-OG5G_W
     *
     * becomes:
     *
     * id: ORG-OG5G_W
     */
    return {
      ...organization,

      name:
        organization.name ||
        payload.organizationName,

      workspaceUrl:
        organization.workspaceUrl ||
        payload.workspaceUrl,

      slug:
        organization.slug ||
        organization.workspaceUrl ||
        payload.workspaceUrl,

      industry:
        organization.industry ||
        payload.industry,

      timezone:
        organization.timezone ||
        payload.timezone,

      language:
        organization.language ||
        payload.language,

      theme:
        organization.theme ||
        payload.theme,
    }
  },
}