import { describe, it, expect } from 'vitest'
import { parseSheetValues } from '../../src/services/google-sheets'

describe('parseSheetValues', () => {
  it('should parse sheet values into objects', () => {
    const values = [
      ['Name', 'Age', 'City'],
      ['Alice', '30', 'New York'],
      ['Bob', '25', 'London']
    ]

    const result = parseSheetValues(values)

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      id: 0,
      name: 'Alice',
      age: '30',
      city: 'New York'
    })
    expect(result[1]).toEqual({
      id: 1,
      name: 'Bob',
      age: '25',
      city: 'London'
    })
  })

  it('should handle empty values', () => {
    const values = [
      ['Name', 'Age'],
      ['Alice', ''],
      ['', '30']
    ]

    const result = parseSheetValues(values)

    expect(result[0].age).toBe('')
    expect(result[1].name).toBe('')
  })

  it('should trim whitespace from values', () => {
    const values = [
      ['Name', 'Value'],
      ['  Alice  ', '  30  ']
    ]

    const result = parseSheetValues(values)

    expect(result[0].name).toBe('Alice')
    expect(result[0].value).toBe('30')
  })

  it('should convert headers to snake_case', () => {
    const values = [
      ['First Name', 'Last Name', 'Email Address'],
      ['Alice', 'Smith', 'alice@example.com']
    ]

    const result = parseSheetValues(values)

    expect(Object.keys(result[0])).toEqual([
      'id',
      'first_name',
      'last_name',
      'email_address'
    ])
  })

  it('should return empty array for empty input', () => {
    const result = parseSheetValues([])
    expect(result).toEqual([])
  })

  it('should handle headers only (no data rows)', () => {
    const values = [['Name', 'Age']]
    const result = parseSheetValues(values)
    expect(result).toEqual([])
  })

  it('should handle Google Sheets data format with Cyrillic headers', () => {
    const values = [
      ['убыток', 'автомобиль', 'гос. номер', 'Vin', 'Текущий статус'],
      ['11 206 841', '-', '-', 'XWEE381AEMC000323', 'ждём направление']
    ]

    const result = parseSheetValues(values)

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      id: 0,
      убыток: '11 206 841',
      автомобиль: '-',
      гос_номер: '-',
      vin: 'XWEE381AEMC000323',
      текущий_статус: 'ждём направление'
    })
  })
})
