import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchCities, saveCity, cityServiceMeta } from '../cityService'
import * as client from '@/core/api/client'

describe('cityService', () => {
  beforeEach(() => {
    vi.spyOn(client, 'apiRequest').mockResolvedValue({
      ok: true,
      status: 200,
      data: {
        status: { code: '000000' },
        data: [{ cityId: 1, englishLabel: 'Doha', arabicLabel: 'الدوحة', status: 'Y' }],
      },
      headers: new Headers(),
    })
  })
  afterEach(() => vi.restoreAllMocks())

  it('uses data API base and Flutter city URLs', () => {
    expect(cityServiceMeta.base).toBe('data')
    expect(cityServiceMeta.urls.fetchAll).toBe('master/city/fetchAll')
    expect(cityServiceMeta.urls.save).toBe('master/city/create')
  })

  it('fetchCities maps english/arabic labels', async () => {
    const res = await fetchCities()
    expect(res.data[0].cityNameEnglish).toBe('Doha')
    expect(res.data[0].cityNameArabic).toBe('الدوحة')
    expect(client.apiRequest.mock.calls[0][0]).toBe('master/city/fetchAll')
    expect(client.apiRequest.mock.calls[0][1].base).toBe('data')
  })

  it('saveCity posts englishLabel/arabicLabel payload', async () => {
    await saveCity({ cityNameEnglish: 'X', cityNameArabic: 'ي', status: 'Y' })
    const opts = client.apiRequest.mock.calls[0][1]
    expect(opts.body).toMatchObject({ englishLabel: 'X', arabicLabel: 'ي', status: 'Y' })
  })
})
