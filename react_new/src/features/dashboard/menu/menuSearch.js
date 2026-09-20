/**
 * Flutter UiSliderMenu search parity helpers.
 * Source behavior: ui_slider_menu.dart (_isSearchVisible / _performSearch).
 */

export const RECENT_SEARCHES_KEY = 'qnb_bo_menu_recent_searches'
export const MAX_SUGGESTIONS = 6
export const MAX_RECENT = 6

function norm(s) {
  return String(s || '')
    .trim()
    .toLowerCase()
}

/**
 * Collect searchable terms from productDesc, subProductDesc, childMenuDesc.
 * @returns {Array<{ text: string, type: 'product'|'sub'|'child', productCode: string, productDesc: string, sub?: object, child?: object, url: string }>}
 */
export function collectAllTerms(products = []) {
  const terms = []
  for (const product of products || []) {
    const productDesc = product.productDesc || ''
    const productCode = product.productCode
    if (productDesc) {
      const isDashboard = String(productCode).toLowerCase() === 'dashboard'
      terms.push({
        text: productDesc,
        type: 'product',
        productCode,
        productDesc,
        url: isDashboard ? '/dashboard' : '',
      })
    }
    for (const sub of product.subProducts || []) {
      const subDesc = sub.subProductDesc || ''
      if (subDesc) {
        terms.push({
          text: subDesc,
          type: 'sub',
          productCode,
          productDesc,
          sub,
          url: sub.subProductUrl || '',
        })
      }
      for (const child of sub.childMenus || []) {
        const childDesc = child.childMenuDesc || ''
        if (childDesc) {
          terms.push({
            text: childDesc,
            type: 'child',
            productCode,
            productDesc,
            sub,
            child,
            url: child.childMenuUrl || '',
          })
        }
      }
    }
  }
  return terms
}

/** exact=100, prefix=50, contains=10; else 0 */
export function matchScore(termText, query) {
  const t = norm(termText)
  const q = norm(query)
  if (!q || !t) return 0
  if (t === q) return 100
  if (t.startsWith(q)) return 50
  if (t.includes(q)) return 10
  return 0
}

/**
 * Empty query → recent (max 6) filtered to live menu terms, else first 6 of all terms.
 * Non-empty → rank by score, top 6.
 */
export function searchSuggestions(products, query, recent = []) {
  const all = collectAllTerms(products)
  const q = String(query || '').trim()

  if (!q) {
    const liveByNorm = new Map()
    for (const term of all) {
      const key = norm(term.text)
      if (key && !liveByNorm.has(key)) liveByNorm.set(key, term)
    }
    const fromRecent = []
    for (const r of recent || []) {
      const hit = liveByNorm.get(norm(r))
      if (hit) fromRecent.push({ ...hit, fromRecent: true })
      if (fromRecent.length >= MAX_SUGGESTIONS) break
    }
    if (fromRecent.length) return fromRecent
    return all.slice(0, MAX_SUGGESTIONS).map((t) => ({ ...t, fromRecent: false }))
  }

  return all
    .map((term) => ({ ...term, score: matchScore(term.text, q), fromRecent: false }))
    .filter((t) => t.score > 0)
    .sort((a, b) => b.score - a.score || a.text.localeCompare(b.text))
    .slice(0, MAX_SUGGESTIONS)
}

/**
 * Prefer child > sub > parent (when parent name != sub name).
 * @returns {{ type, productCode, sub?, child?, url, titles } | null}
 */
export function findBestMatch(products, query) {
  const q = String(query || '').trim()
  if (!q) return null

  const all = collectAllTerms(products)
  const scored = all
    .map((term) => ({ ...term, score: matchScore(term.text, q) }))
    .filter((t) => t.score > 0)

  if (!scored.length) return null

  const rankType = (type) => (type === 'child' ? 3 : type === 'sub' ? 2 : 1)

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return rankType(b.type) - rankType(a.type)
  })

  // Prefer child/sub over parent when names collide with a deeper match of same score band
  let best = scored[0]
  const exactOrPrefix = scored.filter((t) => t.score >= 50)
  const pool = exactOrPrefix.length ? exactOrPrefix : scored

  const childHit = pool.find((t) => t.type === 'child')
  if (childHit) best = childHit
  else {
    const subHit = pool.find((t) => t.type === 'sub')
    if (subHit) {
      // Prefer sub over parent when parent name != sub name (always true for type sub)
      best = subHit
    } else {
      best = pool.find((t) => t.type === 'product') || pool[0]
    }
  }

  // If best is product but an equally-scored sub exists with different name, prefer sub
  if (best.type === 'product') {
    const altSub = pool.find(
      (t) =>
        t.type === 'sub' &&
        t.productCode === best.productCode &&
        norm(t.text) !== norm(best.text) &&
        t.score >= best.score,
    )
    if (altSub) best = altSub
  }

  let url = best.url || ''
  if (!url) {
    if (best.child?.childMenuUrl) url = best.child.childMenuUrl
    else if (best.sub?.subProductUrl) url = best.sub.subProductUrl
    else if (String(best.productCode).toLowerCase() === 'dashboard') url = '/dashboard'
    else url = '/dashboard'
  }

  const titles = {
    product: best.productDesc || '',
    sub: best.sub?.subProductDesc || '',
    child: best.child?.childMenuDesc || '',
    matched: best.text,
  }

  return {
    type: best.type,
    productCode: best.productCode,
    sub: best.sub || null,
    child: best.child || null,
    url,
    titles,
  }
}

export function loadRecentSearches() {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map((x) => String(x)).filter(Boolean).slice(0, MAX_RECENT)
  } catch {
    return []
  }
}

export function saveRecentSearch(term) {
  const text = String(term || '').trim()
  if (!text) return loadRecentSearches()
  const prev = loadRecentSearches().filter((t) => norm(t) !== norm(text))
  const next = [text, ...prev].slice(0, MAX_RECENT)
  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next))
  } catch {
    /* ignore quota */
  }
  return next
}
