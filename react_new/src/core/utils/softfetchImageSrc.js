/**
 * Flutter SoftFetch table parity (apply_sub_product_table_page):
 * URL | data:image... | raw/url-safe base64 → renderable img src.
 */
export function softfetchImageSrc(raw, { mime = 'image/png', cacheBust } = {}) {
  if (raw == null) return ''
  let s = String(raw).trim()
  if (!s) return ''
  if (/^https?:\/\//i.test(s) || s.startsWith('blob:')) {
    if (cacheBust == null) return s
    const sep = s.includes('?') ? '&' : '?'
    return `${s}${sep}cb=${cacheBust}`
  }
  if (/^data:image\//i.test(s)) return s
  // strip data:*;base64, prefix if present without image/
  const comma = s.indexOf(',')
  if (s.toLowerCase().startsWith('data:') && comma !== -1) {
    s = s.slice(comma + 1).trim()
  }
  s = s.replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/')
  const mod = s.length % 4
  if (mod !== 0) s = s.padEnd(s.length + (4 - mod), '=')
  if (!s) return ''
  return `data:${mime};base64,${s}`
}

export function isLikelySoftfetchImageValue(raw) {
  if (raw == null) return false
  const s = String(raw).trim()
  if (!s) return false
  if (/^https?:\/\//i.test(s)) return true
  if (/^data:image\//i.test(s)) return true
  return s.length > 64 && /^[A-Za-z0-9+/_=\r\n-]+$/.test(s.slice(0, 200))
}

export default softfetchImageSrc
