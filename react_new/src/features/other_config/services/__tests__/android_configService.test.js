import { describe, it, expect } from 'vitest'
import service from '../android_configService'
import { androidUrls } from '@/core/api/urls/androidUrls'

describe('android_configService', () => {
  it('uses CSV androidUrls', () => {
    expect(service.urls.fetchAll).toBe(androidUrls.fetchAllAndroid)
    expect(service.urls.create).toBe(androidUrls.manageAndroid)
    expect(service.urls.update).toBe(androidUrls.manageAndroid)
  })

  it('mapRow maps key/value aliases', () => {
    const mapped = service.mapRow({ key: 'minSdk', value: '24', package: 'com.qnb' })
    expect(mapped.configKey).toBe('minSdk')
    expect(mapped.configValue).toBe('24')
    expect(mapped.packageName).toBe('com.qnb')
  })
})
