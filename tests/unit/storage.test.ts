import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  setAuthToken,
  getAuthToken,
  clearAuthToken,
  isAuthenticated,
  setSessionData,
  getSessionData,
  clearSession
} from '../../src/utils/storage'

describe('storage', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  afterEach(() => {
    sessionStorage.clear()
  })

  describe('setAuthToken / getAuthToken', () => {
    it('should set and get auth token', () => {
      setAuthToken('test-token')
      expect(getAuthToken()).toBe('test-token')
    })

    it('should return null when no token is set', () => {
      expect(getAuthToken()).toBe(null)
    })

    it('should overwrite existing token', () => {
      setAuthToken('token1')
      setAuthToken('token2')
      expect(getAuthToken()).toBe('token2')
    })
  })

  describe('clearAuthToken', () => {
    it('should remove auth token', () => {
      setAuthToken('test-token')
      clearAuthToken()
      expect(getAuthToken()).toBe(null)
    })

    it('should not throw when no token exists', () => {
      expect(() => clearAuthToken()).not.toThrow()
    })
  })

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      setAuthToken('test-token')
      expect(isAuthenticated()).toBe(true)
    })

    it('should return false when no token exists', () => {
      expect(isAuthenticated()).toBe(false)
    })

    it('should return false after clearing token', () => {
      setAuthToken('test-token')
      expect(isAuthenticated()).toBe(true)
      clearAuthToken()
      expect(isAuthenticated()).toBe(false)
    })
  })

  describe('setSessionData / getSessionData', () => {
    it('should set and get session data', () => {
      const data = { login: 'admin', loginTime: Date.now() }
      setSessionData(data)
      expect(getSessionData()).toEqual(data)
    })

    it('should return null when no data is set', () => {
      expect(getSessionData()).toBe(null)
    })

    it('should return a copy, not the original object', () => {
      const data = { login: 'admin' }
      setSessionData(data)
      const retrieved = getSessionData()
      if (retrieved) {
        retrieved.login = 'modified'
      }
      expect(getSessionData()?.login).toBe('admin')
    })
  })

  describe('clearSession', () => {
    it('should clear auth token and session data', () => {
      setAuthToken('test-token')
      setSessionData({ login: 'admin' })

      clearSession()

      expect(getAuthToken()).toBe(null)
      expect(getSessionData()).toBe(null)
    })
  })
})
