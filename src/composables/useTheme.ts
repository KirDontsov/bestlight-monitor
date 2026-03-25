import { ref, Ref } from 'vue'

const THEME_KEY = 'bestlight_theme'

export type Theme = 'light' | 'dark'

/**
 * Composable for theme management
 */
export function useTheme() {
  const currentTheme: Ref<Theme> = ref(getInitialTheme())

  /**
   * Get initial theme from localStorage or system preference
   */
  function getInitialTheme(): Theme {
    if (typeof window === 'undefined') {
      return 'light'
    }

    const stored = localStorage.getItem(THEME_KEY) as Theme | null
    if (stored === 'light' || stored === 'dark') {
      return stored
    }

    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }

    return 'light'
  }

  /**
   * Apply theme to document
   */
  function applyTheme(theme: Theme): void {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-theme')
    } else {
      document.documentElement.classList.remove('dark-theme')
    }
  }

  /**
   * Toggle between light and dark theme
   */
  function toggleTheme(): void {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
    applyTheme(currentTheme.value)
    localStorage.setItem(THEME_KEY, currentTheme.value)
  }

  /**
   * Set specific theme
   */
  function setTheme(theme: Theme): void {
    currentTheme.value = theme
    applyTheme(theme)
    localStorage.setItem(THEME_KEY, theme)
  }

  /**
   * Check if current theme is dark
   */
  const isDark = ref(currentTheme.value === 'dark')

  // Initialize theme on mount
  applyTheme(currentTheme.value)
  isDark.value = currentTheme.value === 'dark'

  return {
    currentTheme,
    isDark,
    toggleTheme,
    setTheme
  }
}
