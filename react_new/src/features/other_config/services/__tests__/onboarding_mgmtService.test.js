import { describe, it, expect } from 'vitest'
import service from '../onboarding_mgmtService'

describe('onboarding_mgmtService', () => {
  it('exposes Onboarding Management endpoints', () => {
    expect(service.urls.fetchAll).toBe('onboarding-mgmt/getAll')
    expect(service.urls.create || service.urls.update).toBeTruthy()
  })
})
