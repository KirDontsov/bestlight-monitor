import { describe, it, expect } from 'vitest'
import { hashPassword, verifyPassword } from '../../src/utils/hash'

describe('hashPassword', () => {
  it('should hash a password with SHA-256', async () => {
    const password = 'admin'
    const hash = await hashPassword(password)

    // SHA-256 hash of 'admin' is known
    expect(hash).toBe('8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918')
  })

  it('should produce different hashes for different passwords', async () => {
    const hash1 = await hashPassword('password1')
    const hash2 = await hashPassword('password2')

    expect(hash1).not.toBe(hash2)
  })

  it('should produce consistent hashes for the same password', async () => {
    const hash1 = await hashPassword('test')
    const hash2 = await hashPassword('test')

    expect(hash1).toBe(hash2)
  })

  it('should handle empty string', async () => {
    const hash = await hashPassword('')
    expect(hash).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')
  })
})

describe('verifyPassword', () => {
  it('should verify correct password', async () => {
    const password = 'admin'
    const hash = await hashPassword(password)
    const isValid = await verifyPassword(password, hash)

    expect(isValid).toBe(true)
  })

  it('should reject incorrect password', async () => {
    const password = 'admin'
    const hash = await hashPassword(password)
    const isValid = await verifyPassword('wrong', hash)

    expect(isValid).toBe(false)
  })

  it('should reject empty password when hash is not empty', async () => {
    const password = 'admin'
    const hash = await hashPassword(password)
    const isValid = await verifyPassword('', hash)

    expect(isValid).toBe(false)
  })
})
