import { describe, it, expect } from 'vitest'
import service from '../dc_city_masterService'

describe('dc_city_masterService', () => {
  it('uses SoftFetch dc-city endpoints', () => {
    expect(service.urls.fetchAll).toBe('dc-city/getAll')
  })
  it('maps EN/AR city labels like city master', async () => {
    const res = await service.fetchAll()
    expect(res.data[0].cityNameEnglish).toBeTruthy()
  })
})
