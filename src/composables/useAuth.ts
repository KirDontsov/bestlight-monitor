import { ref, Ref } from 'vue'
import { hashPassword } from '../utils/hash'
import { setAuthToken, clearAuthToken, isAuthenticated as checkIsAuthenticated, setSessionData } from '../utils/storage'
import { config, type AuthUser } from '../config'

/**
 * Composable for authentication logic
 */
export function useAuth() {
  const isLoading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)
  const isAuthenticated: Ref<boolean> = ref(checkIsAuthenticated())
  const currentUser: Ref<AuthUser | null> = ref(null)

  /**
   * Find user by login and verify password
   */
  function findUser(login: string, passwordHash: string): AuthUser | null {
    const user = config.auth.users.find(
      u => u.login.toLowerCase() === login.toLowerCase() && u.passwordHash === passwordHash
    )
    return user || null
  }

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

      // Find user in the list
      const user = findUser(login, passwordHash)

      if (user) {
        // Set auth token (simple session identifier)
        setAuthToken(btoa(`${user.login}:${Date.now()}`))
        setSessionData({ login: user.login, name: user.name || user.login, loginTime: Date.now() })
        currentUser.value = user
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
    currentUser.value = null
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
    currentUser,
    login,
    logout,
    checkAuth
  }
}
