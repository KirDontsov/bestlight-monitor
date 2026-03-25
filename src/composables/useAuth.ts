import { ref, Ref } from 'vue'
import { hashPassword } from '../utils/hash'
import { setAuthToken, clearAuthToken, isAuthenticated as checkIsAuthenticated } from '../utils/storage'
import { config } from '../config'

/**
 * Composable for authentication logic
 */
export function useAuth() {
  const isLoading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)
  const isAuthenticated: Ref<boolean> = ref(checkIsAuthenticated())

  /**
   * Login with username and password
   * @param login - Username
   * @param password - Plain text password
   * @returns True if successful
   */
  async function login(login: string, password: string): Promise<boolean> {
    isLoading.value = true
    error.value = null

    try {
      // Hash the password
      const passwordHash = await hashPassword(password)

      // Verify against config
      const isValid = login === config.auth.login && passwordHash === config.auth.passwordHash

      if (isValid) {
        // Set auth token (simple session identifier)
        setAuthToken(btoa(`${login}:${Date.now()}`))
        isAuthenticated.value = true
        return true
      } else {
        error.value = 'Неверный логин или пароль'
        return false
      }
    } catch (err) {
      error.value = 'Ошибка при входе: ' + (err as Error).message
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Logout current user
   */
  function logout(): void {
    clearAuthToken()
    isAuthenticated.value = false
  }

  /**
   * Check if user is authenticated
   */
  function checkAuth(): boolean {
    isAuthenticated.value = checkIsAuthenticated()
    return isAuthenticated.value
  }

  return {
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    checkAuth
  }
}
