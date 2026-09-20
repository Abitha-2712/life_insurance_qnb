import { describe, it, expect } from 'vitest'
import service from '../mfa_managementService'
import { mfaManagementUrls } from '@/core/api/urls/mfa_managementUrls'

describe('mfa_managementService', () => {
  it('uses CSV mfaManagementUrls', () => {
    expect(service.urls.fetchAll).toBe(mfaManagementUrls.mfagetall)
    expect(service.urls.create).toBe(mfaManagementUrls.mfasave)
    expect(service.urls.update).toBe(mfaManagementUrls.mfaupdate)
    expect(service.urls.delete).toBe(mfaManagementUrls.mfadelete)
  })

  it('mapRow maps name/type/channel', () => {
    const mapped = service.mapRow({
      code: 'BIO',
      englishLabel: 'Biometric',
      type: 'biometric',
      channelCode: 'MB',
      priority: 2,
    })
    expect(mapped.mfaCode).toBe('BIO')
    expect(mapped.mfaName).toBe('Biometric')
    expect(mapped.mfaType).toBe('biometric')
    expect(mapped.channel).toBe('MB')
    expect(mapped.priority).toBe('2')
  })
})
