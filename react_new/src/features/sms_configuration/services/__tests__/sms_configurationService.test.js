import { describe, it, expect } from 'vitest'
import service, { fetchTemplates, fetchPageDropdown } from '../sms_configurationService'

describe('sms_configurationService', () => {
  it('uses otpControlConfig endpoints', () => {
    expect(service.urls.fetchAll).toBe('api/otpControlConfig/getall')
    expect(service.urls.create).toBe('api/otpControlConfig/create')
  })
  it('exposes template/dropdown helpers', () => {
    expect(typeof fetchTemplates).toBe('function')
    expect(typeof fetchPageDropdown).toBe('function')
  })
})
