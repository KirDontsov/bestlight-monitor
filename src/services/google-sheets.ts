import { config } from '../config'

/**
 * Row data from Google Sheets
 */
export interface SheetRow {
  id: number
  [key: string]: string | number
}

/**
 * Google Sheets API client
 * Fetches and parses data from Google Sheets
 */

const { apiKey, sheetId } = config.googleSheets

/**
 * Fetch data from Google Sheets
 * @returns Array of row objects
 */
export async function fetchSheetData(): Promise<SheetRow[]> {
  // Get all columns (A to Z) to handle any number of columns
  const range = 'Статус!A1:Z'
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`

  const response = await fetch(url)

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('Access denied. Check API key and sheet permissions.')
    }
    if (response.status === 404) {
      throw new Error('Sheet not found. Verify the Sheet ID.')
    }
    throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return parseSheetValues(data.values || [])
}

/**
 * Parse sheet values into array of objects
 * @param values - 2D array from Google Sheets
 * @returns Array of row objects with headers as keys
 */
export function parseSheetValues(values: string[][]): SheetRow[] {
  if (values.length === 0) {
    return []
  }

  // Filter out empty rows and find first row with headers
  const nonEmptyRows = values.filter(row => row.length > 0 && row.some(cell => cell.trim() !== ''))

  if (nonEmptyRows.length < 2) {
    return []
  }

  // First non-empty row is headers
  const headers = nonEmptyRows[0].map(h =>
    h.trim().toLowerCase().replace(/\s+/g, '_').replace(/[.,]/g, '')
  )

  // Remaining rows are data
  const dataRows = nonEmptyRows.slice(1)

  return dataRows.map((row, index) => {
    const obj: SheetRow = {
      id: index
    }

    headers.forEach((header, i) => {
      obj[header] = row[i] !== undefined ? row[i].trim() : ''
    })

    return obj
  })
}

/**
 * Cache for sheet data
 */
let cachedData: SheetRow[] | null = null
let cacheTimestamp: number | null = null

/**
 * Fetch data with caching
 * @param forceRefresh - Force refresh ignoring cache
 * @returns Cached or fresh data
 */
export async function fetchSheetDataCached(forceRefresh = false): Promise<SheetRow[]> {
  const now = Date.now()

  if (!forceRefresh && cachedData && cacheTimestamp) {
    const age = now - cacheTimestamp
    if (age < config.cache.ttl) {
      return cachedData
    }
  }

  cachedData = await fetchSheetData()
  cacheTimestamp = now

  return cachedData
}

/**
 * Clear the cache
 */
export function clearCache(): void {
  cachedData = null
  cacheTimestamp = null
}
