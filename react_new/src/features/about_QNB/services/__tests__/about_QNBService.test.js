import { describe, it, expect } from 'vitest'
import service from '../about_QNBService'

describe('about_QNBService', () => {
  it('uses disclaimer summary/manage endpoints', () => {
    expect(service.urls.fetchAll).toBe('disclaimer/summary')
    expect(service.urls.create).toBe('disclaimer/manage')
  })
  it('seed includes EN/AR content', async () => {
    const res = await service.fetchAll()
    expect(res.data[0].contentEn).toBeTruthy()
  })
})
