import { describe, it, expect } from 'vitest'
import service from '../release_managementService'

describe('release_managementService', () => {
  it('uses release SoftFetch paths', () => {
    expect(service.urls.fetchAll).toBe('release-management/get-all')
    expect(service.urls.create).toBe('release-management/create')
  })
})
