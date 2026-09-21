import { describe, it, expect } from 'vitest'
import service from '../countryService'

describe('countryService', () => {
  it('uses bko-country endpoints', () => {
    expect(service.urls.fetchAll).toBe('bko-country/fetchAll')
    expect(service.urls.create).toBe('bko-country/post')
    expect(service.urls.delete).toBe('bko-country/delete')
  })

  it('buildUpdateBody sends UPDATE action', () => {
    const body = service.buildUpdateBody({
      countryCode: 'QA',
      countryDesc: 'Qatar',
      isoCountryCode: 'QAT',
      baseCurrency: 'QAR',
      status: 'IAC',
      digitalOnboardingEligibility: 'N',
    })

    expect(body.action).toBe('UPDATE')
    expect(body.status).toBe('IAC')
    expect(body.digitalOnboardingEligible).toBe('N')
  })

  it('buildDeleteBody sends countryCode and DELETE action', () => {
    expect(service.buildDeleteBody('QA', { countryCode: 'QA' })).toEqual({
      action: 'DELETE',
      countryCode: 'QA',
    })
  })
})
