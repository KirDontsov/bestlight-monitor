/**
 * SessionStorage wrapper for auth state
 */

const AUTH_TOKEN_KEY = 'bestlight_auth_token'
const SESSION_DATA_KEY = 'bestlight_session_data'

export interface SessionData {
  login?: string
  loginTime?: number
  [key: string]: unknown
}

/**
 * Save auth token to session storage
 * @param token - Auth token (can be any non-empty string)
 */
export function setAuthToken(token: string): void {
  sessionStorage.setItem(AUTH_TOKEN_KEY, token)
}

/**
 * Get auth token from session storage
 * @returns Auth token or null if not found
 */
export function getAuthToken(): string | null {
  return sessionStorage.getItem(AUTH_TOKEN_KEY)
}

/**
 * Remove auth token from session storage
 */
export function clearAuthToken(): void {
  sessionStorage.removeItem(AUTH_TOKEN_KEY)
}

/**
 * Check if user is authenticated
 * @returns True if authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken()
}

/**
 * Save session data (e.g., user info, login time)
 * @param data - Data to store
 */
export function setSessionData(data: SessionData): void {
  sessionStorage.setItem(SESSION_DATA_KEY, JSON.stringify(data))
}

/**
 * Get session data
 * @returns Parsed session data or null
 */
export function getSessionData(): SessionData | null {
  const data = sessionStorage.getItem(SESSION_DATA_KEY)
  return data ? JSON.parse(data) : null
}

/**
 * Clear all session data
 */
export function clearSession(): void {
  clearAuthToken()
  sessionStorage.removeItem(SESSION_DATA_KEY)
}
