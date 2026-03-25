/**
 * Application configuration
 * Values are loaded from environment variables
 */

export interface AppConfig {
  googleSheets: {
    apiKey: string
    sheetId: string
  }
  auth: {
    login: string
    passwordHash: string
  }
  pagination: {
    pageSize: number
    threshold: number
  }
  cache: {
    ttl: number
  }
}

export const config: AppConfig = {
  googleSheets: {
    apiKey: import.meta.env.VITE_GOOGLE_SHEETS_API_KEY,
    sheetId: import.meta.env.VITE_GOOGLE_SHEET_ID
  },
  auth: {
    login: import.meta.env.VITE_AUTH_LOGIN,
    passwordHash: import.meta.env.VITE_AUTH_PASSWORD_HASH
  },
  pagination: {
    pageSize: parseInt(import.meta.env.VITE_PAGINATION_PAGE_SIZE || '20', 10),
    threshold: parseInt(import.meta.env.VITE_PAGINATION_THRESHOLD || '200', 10)
  },
  cache: {
    ttl: parseInt(import.meta.env.VITE_CACHE_TTL || '300000', 10)
  }
}

export default config
