import { describe, it, expect } from 'vitest'
import service from '../bank_managementService'
import { bankManagementUrls } from '@/core/api/urls/bank_managementUrls'

describe('bank_managementService', () => {
  it('uses CSV bankManagementUrls', () => {
    expect(service.urls.fetchAll).toBe(bankManagementUrls.getAllBanks)
    expect(service.urls.create).toBe(bankManagementUrls.createBank)
    expect(service.urls.update).toBe(bankManagementUrls.updateBank)
    expect(service.urls.delete).toBe(bankManagementUrls.deleteBank)
  })

  it('mapRow maps EN/AR name and SWIFT aliases', () => {
    const mapped = service.mapRow({
      bankCode: 'ABQK',
      englishLabel: 'Ahli Bank',
      arabicLabel: 'الأهلي',
      swift: 'ABQKQAQA',
      country: 'QA',
    })
    expect(mapped.bankName).toBe('Ahli Bank')
    expect(mapped.bankNameAr).toBe('الأهلي')
    expect(mapped.swiftCode).toBe('ABQKQAQA')
    expect(mapped.countryCode).toBe('QA')
  })
})
