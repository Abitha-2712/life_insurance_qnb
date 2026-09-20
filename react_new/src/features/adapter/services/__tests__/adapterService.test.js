import { describe, it, expect } from 'vitest'
import service from '../adapterService'

describe('adapterService', () => {
  it('uses SoftFetch adapter endpoints', () => {
    expect(service.urls.fetchAll).toBe('adapter/getAll')
    expect(service.urls.create).toBe('adapter/save')
  })
  it('maps adapter fields from alternate keys', async () => {
    const res = await service.fetchAll()
    expect(res.data[0].adapterCode).toBeTruthy()
    expect(res.data[0].adapterType).toBeTruthy()
  })
})
