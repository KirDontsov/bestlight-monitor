import { ref, Ref } from 'vue'

/**
 * Composable for generating and managing user GUID
 */
export function useUserGuid() {
  const guid: Ref<string | null> = ref(null)

  /**
   * Generate a new GUID
   * @returns Generated GUID string
   */
  function generateGuid(): string {
    const newGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })

    guid.value = newGuid
    localStorage.setItem('bestlight_user_guid', newGuid)
    return newGuid
  }

  /**
   * Get existing GUID from localStorage or generate new one
   * @returns Existing or new GUID
   */
  function getGuid(): string {
    if (guid.value) {
      return guid.value
    }

    const stored = localStorage.getItem('bestlight_user_guid')
    if (stored) {
      guid.value = stored
      return stored
    }

    return generateGuid()
  }

  /**
   * Clear stored GUID
   */
  function clearGuid(): void {
    guid.value = null
    localStorage.removeItem('bestlight_user_guid')
  }

  // Initialize on composable load
  getGuid()

  return {
    guid,
    generateGuid,
    getGuid,
    clearGuid
  }
}
