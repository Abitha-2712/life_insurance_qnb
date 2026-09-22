import { describe, it, expect } from 'vitest'
import service from '../countryService'

describe('countryService mapRow', () => {
  it('maps Flutter country fields and Y/N labels', () => {
    const mapped = service.mapRow({
      countryCode: 'QA',
      countryDesc: 'Qatar',
      isoCountryCode: 'QAT',
      baseCurrency: 'QAR',
      mobNoPrefix: '+974',
      langEn: 'English',
      langAr: 'قطر',
      swiftName: 'QATARQA',
      benefAddress: 'Required',
      beneficiaryAddressPob: 'Not Required',
      beneficiaryAddressDob: 'Optional',
      tinEligibility: 'Required',
      tinType: 'TIN',
      tinValidation: 'REGEX',
      dialCode: '974',
      eipoSubscription: 'Y',
      eipoAllowedNationality: 'N',
      digitalOnboardingEligible: 'Y',
      status: 'IAC',
    })

    expect(mapped.id).toBe('QA')
    expect(mapped.countryDesc).toBe('Qatar')
    expect(mapped.langAr).toBe('قطر')
    expect(mapped.eipoSubscription).toBe('Yes')
    expect(mapped.eipoAllowedNationality).toBe('No')
    expect(mapped.status).toBe('IAC')
    expect(mapped.digitalOnboardingEligibility).toBe('Y')
  })
})
