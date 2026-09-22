import { describe, it, expect } from 'vitest'
import service from '../termsDisclaimerService'

describe('termsDisclaimerService', () => {
  it('uses disclaimer endpoints', () => {
    expect(service.urls.fetchAll).toBe('disclaimer/summary')
    expect(service.urls.create).toBe('disclaimer/manage')
  })
})
