import { describe, it, expect } from 'vitest'
import service from '../digital__instant_onboardingService'

describe('digital__instant_onboardingService', () => {
  it('uses SoftFetch onboarding endpoints', () => {
    expect(service.urls.fetchAll).toBe('onboarding/getAll')
  })
  it('seed includes sequence/mandatory', async () => {
    const res = await service.fetchAll()
    expect(res.data[0].sequence).toBeTruthy()
  })
})
