/**
 * Flutter SessionTimeoutConfig parity.
 * Idle minutes before popup; buffer minutes after popup before force logout.
 * Labels keys: IDLE_TIMEOUT_MINUTES / BUFFER_TIMEOUT_MINUTES (from /txn/labels).
 */
const IDLE_KEY = 'qnb_bo_idle_timeout_minutes'
const BUFFER_KEY = 'qnb_bo_buffer_timeout_minutes'

export const IDLE_TIMEOUT_LABEL_KEY = 'IDLE_TIMEOUT_MINUTES'
export const BUFFER_TIMEOUT_LABEL_KEY = 'BUFFER_TIMEOUT_MINUTES'

export const DEFAULT_IDLE_TIMEOUT_MINUTES = 10
export const DEFAULT_BUFFER_TIMEOUT_MINUTES = 2

function readPositiveInt(key, fallback) {
  try {
    const n = parseInt(localStorage.getItem(key) || '', 10)
    if (Number.isFinite(n) && n > 0) return n
  } catch {
    /* ignore */
  }
  return fallback
}

export const SessionTimeoutConfig = {
  get idleTimeoutMinutes() {
    return readPositiveInt(IDLE_KEY, DEFAULT_IDLE_TIMEOUT_MINUTES)
  },

  get bufferTimeoutMinutes() {
    return readPositiveInt(BUFFER_KEY, DEFAULT_BUFFER_TIMEOUT_MINUTES)
  },

  get idleDurationMs() {
    return this.idleTimeoutMinutes * 60 * 1000
  },

  get bufferDurationMs() {
    return this.bufferTimeoutMinutes * 60 * 1000
  },

  setIdleTimeoutMinutes(minutes) {
    const n = parseInt(minutes, 10)
    if (!Number.isFinite(n) || n <= 0) return
    localStorage.setItem(IDLE_KEY, String(n))
  },

  setBufferTimeoutMinutes(minutes) {
    const n = parseInt(minutes, 10)
    if (!Number.isFinite(n) || n <= 0) return
    localStorage.setItem(BUFFER_KEY, String(n))
  },

  /**
   * Call after a successful /txn/labels response (Flutter applyFromLabels).
   * @param {Array<{ labelKey?: string, labelValue?: Array<{ langCode?: string, langValue?: string }>|string }>} labels
   */
  applyFromLabels(labels = []) {
    if (!Array.isArray(labels)) return
    const idle = minutesForKey(labels, IDLE_TIMEOUT_LABEL_KEY)
    const buffer = minutesForKey(labels, BUFFER_TIMEOUT_LABEL_KEY)
    this.setIdleTimeoutMinutes(idle ?? DEFAULT_IDLE_TIMEOUT_MINUTES)
    this.setBufferTimeoutMinutes(buffer ?? DEFAULT_BUFFER_TIMEOUT_MINUTES)
  },
}

function minutesForKey(labels, key) {
  for (const label of labels) {
    if (String(label?.labelKey || '').trim() !== key) continue
    const value = numericLangValue(label.labelValue)
    if (value != null) return value
  }
  return null
}

function numericLangValue(values) {
  if (values == null) return null
  if (typeof values === 'string' || typeof values === 'number') {
    const n = parseInt(String(values).trim(), 10)
    return Number.isFinite(n) && n > 0 ? n : null
  }
  if (!Array.isArray(values)) return null
  const preferred = new Set(['en'])
  for (const lang of preferred) {
    for (const entry of values) {
      if (entry?.langCode !== lang) continue
      const n = parseInt(String(entry.langValue || '').trim(), 10)
      if (Number.isFinite(n) && n > 0) return n
    }
  }
  for (const entry of values) {
    const n = parseInt(String(entry?.langValue || '').trim(), 10)
    if (Number.isFinite(n) && n > 0) return n
  }
  return null
}

export default SessionTimeoutConfig