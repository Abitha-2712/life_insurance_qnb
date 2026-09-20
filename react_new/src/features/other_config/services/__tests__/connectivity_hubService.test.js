import { describe, it, expect } from 'vitest'
import service from '../connectivity_hubService'

describe('connectivity_hubService', () => {
  it('exposes Connectivity Hub endpoints', () => {
    expect(service.urls.fetchAll).toBe('connectivity-hub/getAll')
    expect(service.urls.create || service.urls.update).toBeTruthy()
  })
})
