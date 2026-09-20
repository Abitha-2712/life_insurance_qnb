import { describe, it, expect } from 'vitest'
import service from '../countryService'

describe('countryService mapRow', () => {
  it('spread does not overwrite String coercions / EN-AR mapping', () => {
    const mapped = service.mapRow({
      id: 42,
      countryCode: 'QA',
      englishLabel: 'Qatar',
      arabicLabel: 'قطر',
      status: 'Y',
      extra: 'keep',
    })
    expect(mapped.id).toBe('42')
    expect(typeof mapped.id).toBe('string')
    expect(mapped.countryName).toBe('Qatar')
    expect(mapped.countryNameAr).toBe('قطر')
    expect(mapped.extra).toBe('keep')
  })
})
