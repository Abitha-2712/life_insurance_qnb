import { describe, it, expect } from 'vitest'
import service from '../license_managementService'

describe('license_managementService', () => {
  it('uses bko-license endpoints', () => {
    expect(service.urls.fetchAll).toBe('bko-license/fetchAll')
    expect(service.urls.create).toBe('bko-license/post')
  })
})
