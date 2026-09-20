import { describe, it, expect } from 'vitest'
import service from '../feature_managementService'
import { accessManagementUrls } from '@/core/api/urls/access_managementUrls'

describe('feature_managementService', () => {
  it('uses CSV access_managementUrls (bko-features)', () => {
    expect(service.urls.fetchAll).toBe(accessManagementUrls.fetchAllAccess)
    expect(service.urls.create).toBe(accessManagementUrls.saveAccess)
    expect(service.urls.update).toBe(accessManagementUrls.saveAccess)
    expect(service.urls.delete).toBe(accessManagementUrls.deleteAccess)
  })

  it('mapRow normalizes feature fields', () => {
    const mapped = service.mapRow({
      code: 'PAY',
      englishLabel: 'Payments',
      arabicLabel: 'مدفوعات',
      product: 'PY',
      domain: 'RETAIL',
      seq: 5,
    })
    expect(mapped.featureCode).toBe('PAY')
    expect(mapped.featureName).toBe('Payments')
    expect(mapped.featureNameAr).toBe('مدفوعات')
    expect(mapped.productCode).toBe('PY')
    expect(mapped.sequence).toBe('5')
  })
})
