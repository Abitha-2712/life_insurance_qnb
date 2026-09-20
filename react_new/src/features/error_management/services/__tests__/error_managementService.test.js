import { describe, it, expect } from 'vitest'
import service from '../error_managementService'

describe('error_managementService', () => {
  it('uses error SoftFetch paths', () => {
    expect(service.urls.fetchAll).toBe('error-config/getAll')
  })
})

