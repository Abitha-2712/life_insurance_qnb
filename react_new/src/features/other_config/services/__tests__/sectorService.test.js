import { describe, it, expect } from 'vitest'
import service from '../sectorService'

describe('sectorService', () => {
  it('exposes Sector endpoints', () => {
    expect(service.urls.fetchAll).toBe('sector/getAll')
    expect(service.urls.create || service.urls.update).toBeTruthy()
  })
})
