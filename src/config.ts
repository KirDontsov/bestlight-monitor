/**
 * Application configuration
 * Values are loaded from environment variables
 */

export interface AuthUser {
  login: string
  passwordHash: string
  name?: string
}

export interface AppConfig {
  googleSheets: {
    apiKey: string
    sheetId: string
  }
  auth: {
    users: AuthUser[]
  }
  pagination: {
    pageSize: number
    threshold: number
  }
  cache: {
    ttl: number
  }
}

// Parse users from environment variable
// Format: VITE_AUTH_USERS=[{"login":"admin","passwordHash":"hash123","name":"Administrator"},{"login":"user","passwordHash":"hash456","name":"User"}]
function parseUsers(): AuthUser[] {
  const usersJson = import.meta.env.VITE_AUTH_USERS
  if (usersJson) {
    try {
      return JSON.parse(usersJson)
    } catch (e) {
      console.error('Failed to parse VITE_AUTH_USERS:', e)
    }
  }
  
  // Fallback to single user for backward compatibility
  const login = import.meta.env.VITE_AUTH_LOGIN
  const passwordHash = import.meta.env.VITE_AUTH_PASSWORD_HASH
  if (login && passwordHash) {
    return [{ login, passwordHash, name: login }]
  }
  
  return []
}

export const config: AppConfig = {
  googleSheets: {
    apiKey: import.meta.env.VITE_GOOGLE_SHEETS_API_KEY,
    sheetId: import.meta.env.VITE_GOOGLE_SHEET_ID
  },
  auth: {
    users: parseUsers()
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
