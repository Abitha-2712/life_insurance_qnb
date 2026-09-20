import { describe, it, expect } from 'vitest'
import service, { fetchDomains, fetchOtpDefaults } from '../default_parameterService'

describe('default_parameterService', () => {
  it('uses api/default-config endpoints', () => {
    expect(service.urls.fetchAll).toBe('api/default-config/getAll')
    expect(service.urls.create).toBe('api/default-config/action')
  })
  it('exposes domain and OTP default helpers', () => {
    expect(typeof fetchDomains).toBe('function')
    expect(typeof fetchOtpDefaults).toBe('function')
  })
})
