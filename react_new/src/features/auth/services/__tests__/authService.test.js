import { describe, it, expect, vi, beforeEach } from 'vitest'

const apiRequest = vi.fn()
const encryptPassword = vi.fn(() => 'ENCRYPTED_PS')

vi.mock('@/core/api/client', () => ({
  apiRequest: (...args) => apiRequest(...args),
  authStatusFromPayload: (json) => json?.authStatus || '',
  ApiError: class ApiError extends Error {
    constructor(message, res) {
      super(message)
      this.res = res
    }
  },
}))

vi.mock('@/core/crypto/encryptPassword', () => ({
  encryptPassword: (...args) => encryptPassword(...args),
  default: (...args) => encryptPassword(...args),
}))

vi.mock('@/core/auth/AuthService', () => {
  const state = { token: '', user: {}, cookies: {}, keys: {} }
  return {
    default: {
      clearCookies: vi.fn(() => {
        state.cookies = {}
      }),
      clearKeys: vi.fn(() => {
        state.keys = {}
      }),
      setKeys: vi.fn((k) => {
        state.keys = k
      }),
      getPubKey: vi.fn(() => state.keys.publicKey || ''),
      getToken: vi.fn(() => state.token),
      getCookies: vi.fn(() => state.cookies),
      ingestCookiesFromPayload: vi.fn(),
      login: vi.fn((p) => {
        if (p.token != null) state.token = p.token
        if (p.user) state.user = p.user
      }),
    },
  }
})

vi.mock('@/core/config/env', () => ({
  env: {
    appId: 'APP',
    channelName: 'BO',
    categoryName: 'CAT',
    domainId: 'DOM',
  },
}))

vi.mock('@/core/i18n/t', () => ({
  t: (_k, fallback) => fallback,
}))

import { loginRequest, fetchRpKeys } from '../authService'
import { loginUrls } from '@/core/api/urls/loginUrls'

describe('authService encrypt path', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    encryptPassword.mockReturnValue('ENCRYPTED_PS')
  })

  it('fetchRpKeys stores public key from RP response', async () => {
    apiRequest.mockResolvedValueOnce({
      ok: true,
      data: { publicKey: 'PUB', privateKey: 'PRIV', encryEnabled: 'Y' },
    })
    const keys = await fetchRpKeys()
    expect(keys.publicKey).toBe('PUB')
    expect(apiRequest).toHaveBeenCalledWith(
      loginUrls.getRp,
      expect.objectContaining({ base: 'bo', auth: false }),
    )
  })

  it('loginRequest encrypts password and posts { un, ps }', async () => {
    apiRequest
      .mockResolvedValueOnce({
        ok: true,
        data: { publicKey: 'PUB_KEY', privateKey: 'PRIV' },
      })
      .mockResolvedValueOnce({
        ok: true,
        data: {
          authStatus: 'LOGIN SUCCESS',
          token: 'tok-1',
          userId: 'u1',
          userName: 'Ada',
          mfaYn: 'N',
        },
      })

    const result = await loginRequest({ username: 'ada', password: 'secret' })

    expect(encryptPassword).toHaveBeenCalledWith('PUB_KEY', 'secret')
    expect(apiRequest).toHaveBeenLastCalledWith(
      loginUrls.login,
      expect.objectContaining({
        base: 'bo',
        auth: false,
        body: { un: 'ada', ps: 'ENCRYPTED_PS' },
      }),
    )
    expect(result.authStatus).toBe('LOGIN SUCCESS')
    expect(result.needOtp).toBe(false)
    expect(result.token).toBe('tok-1')
  })

  it('loginRequest rejects empty credentials before RP', async () => {
    await expect(loginRequest({ username: '', password: '' })).rejects.toThrow(/required/i)
    expect(apiRequest).not.toHaveBeenCalled()
  })
})
