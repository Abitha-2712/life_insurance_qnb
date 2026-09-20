import { describe, it, expect } from 'vitest'
import { encryptPassword } from '../encryptPassword'

const TEST_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKPKvhppgXmbQkg2ux0C1wswCqcnOIiD
kx1eTyiY0NnQX9R1ltZaGkgseOateZ5TGo5miuPtntMYY8RLX0zAGbsCAwEAAQ==
-----END PUBLIC KEY-----
`

describe('encryptPassword', () => {
  it('throws when public key missing', () => {
    expect(() => encryptPassword('', 'secret')).toThrow(/Public key missing/)
    expect(() => encryptPassword(null, 'secret')).toThrow(/Public key missing/)
  })

  it('throws when encryption fails on garbage key', () => {
    expect(() => encryptPassword('not-a-pem', 'secret')).toThrow()
  })

  it('encrypts with a valid RSA public key (non-empty ciphertext)', () => {
    const out = encryptPassword(TEST_PUBLIC_KEY, 'P@ssw0rd!')
    expect(typeof out).toBe('string')
    expect(out.length).toBeGreaterThan(20)
    expect(out).not.toBe('P@ssw0rd!')
  })
})
