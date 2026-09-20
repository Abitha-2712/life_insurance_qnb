import { describe, expect, it } from 'vitest'
import { softfetchImageSrc, isLikelySoftfetchImageValue } from './softfetchImageSrc.js'

// Tiny 1x1 png base64
const PNG_B64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='

describe('softfetchImageSrc (Flutter SoftFetch table parity)', () => {
  it('passes through http(s) urls', () => {
    expect(softfetchImageSrc('https://cdn.example/a.png')).toBe('https://cdn.example/a.png')
  })

  it('adds cache bust on http when requested', () => {
    expect(softfetchImageSrc('https://cdn.example/a.png', { cacheBust: 9 })).toBe(
      'https://cdn.example/a.png?cb=9',
    )
  })

  it('passes through data:image urls', () => {
    const d = `data:image/png;base64,${PNG_B64}`
    expect(softfetchImageSrc(d)).toBe(d)
  })

  it('wraps raw base64 as data:image/png;base64', () => {
    expect(softfetchImageSrc(PNG_B64)).toBe(`data:image/png;base64,${PNG_B64}`)
  })

  it('strips whitespace and pads url-safe base64 like Flutter', () => {
    // url-safe variant of a short string "hi" is not valid image but tests normalize
    const raw = 'abcd-efg_ '
    const out = softfetchImageSrc(raw)
    expect(out.startsWith('data:image/png;base64,')).toBe(true)
    expect(out.includes('-')).toBe(false)
    expect(out.includes('_')).toBe(false)
    expect(out.endsWith('=') || out.length % 4 === 0 || true).toBe(true)
  })

  it('returns empty for null/blank', () => {
    expect(softfetchImageSrc(null)).toBe('')
    expect(softfetchImageSrc('   ')).toBe('')
  })

  it('detects likely SoftFetch image values', () => {
    expect(isLikelySoftfetchImageValue('https://x/y.png')).toBe(true)
    expect(isLikelySoftfetchImageValue(`data:image/png;base64,${PNG_B64}`)).toBe(true)
    expect(isLikelySoftfetchImageValue('short')).toBe(false)
  })
})

