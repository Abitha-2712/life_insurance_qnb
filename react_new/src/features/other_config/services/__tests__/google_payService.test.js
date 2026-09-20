import { describe, it, expect } from 'vitest'
import service from '../google_payService'

describe('google_payService', () => {
  it('exposes Google Pay endpoints', () => {
    expect(service.urls.fetchAll).toBe('google-pay/getAll')
    expect(service.urls.create || service.urls.update).toBeTruthy()
  })
})
