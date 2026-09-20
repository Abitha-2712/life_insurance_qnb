import { describe, it, expect } from 'vitest'
import service from '../force_update_configurationService'
import { forceUpdateUrls } from '@/core/api/urls/force_updateUrls'

describe('force_update_configurationService', () => {
  it('uses CSV forceUpdateUrls', () => {
    expect(service.urls.fetchAll).toBe(forceUpdateUrls.forceSummaryList)
    expect(service.urls.update).toBe(forceUpdateUrls.forceModify)
    expect(service.urls.create).toBe(forceUpdateUrls.forceModify)
  })

  it('mapRow maps min/latest/store message aliases', () => {
    const mapped = service.mapRow({
      platform: 'iOS',
      minVersion: '4.0.0',
      latestVersion: '4.2.0',
      url: 'https://apps.apple.com/qnb',
      message: 'Please update',
      force: 'Y',
    })
    expect(mapped.version).toBe('4.0.0')
    expect(mapped.latestVersion).toBe('4.2.0')
    expect(mapped.storeUrl).toBe('https://apps.apple.com/qnb')
    expect(mapped.messageEn).toBe('Please update')
    expect(mapped.forceUpdate).toBe('Y')
  })
})
