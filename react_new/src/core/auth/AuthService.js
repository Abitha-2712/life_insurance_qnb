/**
 * Auth session — in-memory only for SPA lifetime.
 * Full page load / paste URL clears JS memory → login (no localStorage restore).
 * Flutter Hive persists on desktop; for web refresh the product asks for login again.
 */

const LEGACY_PUB_KEY = 'qnb_bo_pubkey'
const LEGACY_PRIV_KEY = 'qnb_bo_privkey'
const LEGACY_STORAGE_KEYS = [
  'bo_session_active',
  'qnb_bo_session',
  'qnb_bo_token',
  'qnb_bo_user',
  'qnb_bo_cookies',
  LEGACY_PUB_KEY,
  LEGACY_PRIV_KEY,
]

/** Active SPA session (lost on refresh / new tab paste). */
let _sessionActive = false
let _token = ''
let _user = {}
let _cookies = {}
let _pubKey = ''
let _privKey = ''

function isSessionCookieKey(key) {
  const k = String(key || '').toLowerCase()
  return (
    k === 'jsessionid' ||
    k === 'sessionid' ||
    k === 'session_id' ||
    k === 'session'
  )
}

function ingestCookiesDeep(data, target = {}) {
  if (!data || typeof data !== 'object') return target
  if (Array.isArray(data)) {
    for (const item of data) ingestCookiesDeep(item, target)
    return target
  }
  for (const [key, value] of Object.entries(data)) {
    if (isSessionCookieKey(key) && value != null && String(value).trim()) {
      target.JSESSIONID = String(value).trim()
    } else if (value && typeof value === 'object') {
      ingestCookiesDeep(value, target)
    }
  }
  return target
}

function readDocumentCookies() {
  if (typeof document === 'undefined' || !document.cookie) return {}
  const out = {}
  for (const part of document.cookie.split(';')) {
    const trimmed = part.trim()
    const eq = trimmed.indexOf('=')
    if (eq <= 0) continue
    const name = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim()
    if (name && value) out[name] = decodeURIComponent(value)
  }
  return out
}

function writeDocumentCookies(cookies) {
  if (typeof document === 'undefined' || !cookies) return
  for (const [name, value] of Object.entries(cookies)) {
    const n = String(name || '').trim()
    const v = String(value || '').trim()
    if (!n || !v) continue
    document.cookie = `${n}=${v}; path=/; SameSite=Lax`
  }
}

function expireDocumentCookies() {
  if (typeof document === 'undefined' || !document.cookie) return
  for (const part of document.cookie.split(';')) {
    const name = part.split('=')[0].trim()
    if (!name) continue
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    document.cookie = `${name}=; path=/; Max-Age=0`
  }
}

/** Drop leftover localStorage session from older builds. */
function purgeLegacyStorage() {
  try {
    for (const key of LEGACY_STORAGE_KEYS) {
      localStorage.removeItem(key)
    }
  } catch {
    /* ignore */
  }
}

purgeLegacyStorage()
expireDocumentCookies()

export const AuthService = {
  isLoggedIn() {
    return _sessionActive === true
  },

  getToken() {
    return _token || ''
  },

  getUser() {
    return _user && typeof _user === 'object' ? { ..._user } : {}
  },

  getUserId() {
    const user = this.getUser()
    return String(user.userId || user.userID || user.userid || '').trim()
  },

  getPubKey() {
    return _pubKey || ''
  },

  getPrivateKey() {
    return _privKey || ''
  },

  setKeys({ publicKey = '', privateKey = '' } = {}) {
    if (publicKey) _pubKey = String(publicKey)
    if (privateKey) _privKey = String(privateKey)
  },

  clearKeys() {
    _pubKey = ''
    _privKey = ''
    try {
      localStorage.removeItem(LEGACY_PUB_KEY)
      localStorage.removeItem(LEGACY_PRIV_KEY)
    } catch {
      /* ignore */
    }
  },

  getCookies() {
    return { ..._cookies }
  },

  /** Merge cookies (Flutter CookieManager.persistCookie / capture). */
  setCookies(next = {}) {
    const merged = { ..._cookies, ...next }
    for (const [k, v] of Object.entries(merged)) {
      if (!v) delete merged[k]
    }
    _cookies = merged
    writeDocumentCookies(merged)
    return merged
  },

  /**
   * Flutter CookieManager.clear() before RP — drop jar + non-HttpOnly cookies.
   * HttpOnly cookies are stripped on pre-login by the Vite proxy.
   */
  clearCookies() {
    _cookies = {}
    expireDocumentCookies()
  },

  /** Flutter CookieManager.ingestFromPayload */
  ingestCookiesFromPayload(payload) {
    const found = ingestCookiesDeep(payload, {})
    if (Object.keys(found).length === 0) return this.getCookies()
    return this.setCookies(found)
  },

  /** Flutter CookieManager.syncFromBrowser + generateCookieHeader */
  getCookieHeader() {
    const merged = {
      ..._cookies,
      ...readDocumentCookies(),
    }
    this.setCookies(merged)
    return Object.entries(merged)
      .filter(([, v]) => v != null && String(v).length > 0)
      .map(([k, v]) => `${k}=${v}`)
      .join('; ')
  },

  /**
   * Keep session in memory after LOGIN SUCCESS (cleared on page reload).
   * @param {{ token?: string, user?: object, cookies?: object }} payload
   */
  login(payload = {}) {
    const { token = '', user = {}, cookies } = payload
    if (token) _token = String(token)
    _user = user && typeof user === 'object' ? { ...user } : {}
    _sessionActive = true
    purgeLegacyStorage()
    if (cookies && typeof cookies === 'object') {
      this.setCookies(cookies)
    }
  },

  logout() {
    _sessionActive = false
    _token = ''
    _user = {}
    this.clearKeys()
    this.clearCookies()
    purgeLegacyStorage()
    // Lazy import avoids circular deps with dashboard → AuthService
    import('@/features/dashboard/services/dashboardService')
      .then((m) => m.clearDashboardPrefetch?.())
      .catch(() => {})
    import('@/features/dashboard/services/menuService')
      .then((m) => m.clearMenuPrefetch?.())
      .catch(() => {})
  },
}

export default AuthService
