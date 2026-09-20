import { describe, it, expect } from 'vitest'
import service from '../kioskLocatorService'

describe('kioskLocatorService', () => {
  it('uses kiosk-locator endpoints', () => {
    expect(service.urls.fetchAll).toBe('kiosk-locator/getall')
    expect(service.urls.create).toBe('kiosk-locator/add')
  })
})
