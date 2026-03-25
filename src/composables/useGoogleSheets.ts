import { ref, computed, Ref, ComputedRef } from 'vue'
import { fetchSheetDataCached, clearCache, type SheetRow } from '../services/google-sheets'

/**
 * Composable for Google Sheets data fetching
 */
export function useGoogleSheets() {
  const data: Ref<SheetRow[]> = ref([])
  const isLoading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)
  const lastUpdated: Ref<Date | null> = ref(null)

  /**
   * Load data from Google Sheets
   * @param forceRefresh - Force refresh ignoring cache
   */
  async function loadData(forceRefresh = false): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const result = await fetchSheetDataCached(forceRefresh)
      data.value = result
      lastUpdated.value = new Date()

      if (forceRefresh) {
        clearCache()
      }
    } catch (err) {
      error.value = (err as Error).message
      data.value = []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Refresh data
   */
  async function refresh(): Promise<void> {
    await loadData(true)
  }

  /**
   * Check if data is empty
   */
  const hasData: ComputedRef<boolean> = computed(() => data.value.length > 0)

  /**
   * Get data count
   */
  const count: ComputedRef<number> = computed(() => data.value.length)

  return {
    data,
    isLoading,
    error,
    lastUpdated,
    hasData,
    count,
    loadData,
    refresh
  }
}
