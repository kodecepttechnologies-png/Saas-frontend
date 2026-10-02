const rawBaseUrl = import.meta.env.VITE_API_BASE_URL

if (!rawBaseUrl) {
  throw new Error('VITE_API_BASE_URL is not defined. Copy .env.example to .env and set it.')
}

/** Single place that reads environment variables. Feature code must import from here. */
export const env = {
  apiBaseUrl: rawBaseUrl.replace(/\/+$/, ''),
} as const
