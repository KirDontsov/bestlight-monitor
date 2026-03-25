/**
 * SHA-256 password hashing utility
 * Uses Web Crypto API
 */

/**
 * Hash a string using SHA-256
 * @param password - Plain text password
 * @returns Hex-encoded hash
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

/**
 * Verify a password against a hash
 * @param password - Plain text password
 * @param hash - Expected hash
 * @returns True if password matches
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const computedHash = await hashPassword(password)
  return computedHash === hash
}
