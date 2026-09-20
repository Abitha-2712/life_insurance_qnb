import { describe, it, expect } from 'vitest'
import service, {
  createPartner,
  savePartnerMapping,
  fetchPartnerProducts,
} from '../partner_onboardingService'
import { partnerOnboardingUrls } from '@/core/api/urls/partner_onboardingUrls'

describe('partner_onboardingService', () => {
  it('lists partners via partners/list', () => {
    expect(service.urls.fetchAll).toBe(partnerOnboardingUrls.partnerList)
    expect(service.urls.create).toBe(partnerOnboardingUrls.createUpdate)
  })

  it('exposes stepper helpers', async () => {
    const created = await createPartner({ partnerCode: 'T1', partnerName: 'Test' })
    expect(created.status.code).toBeTruthy()
    const mapped = await savePartnerMapping({ partnerId: 'T1', productIds: ['P1'] })
    expect(mapped.status.code).toBeTruthy()
    const products = await fetchPartnerProducts()
    expect(Array.isArray(products.data)).toBe(true)
  })
})
