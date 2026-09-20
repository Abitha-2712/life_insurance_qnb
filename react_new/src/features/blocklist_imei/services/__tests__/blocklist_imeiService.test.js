import { describe, it, expect } from 'vitest'
import service from '../blocklist_imeiService'

describe('blocklist_imeiService', () => {
  it('uses imei-block endpoints from blockListUrls', () => {
    expect(service.urls.fetchAll).toBe('imei-block/list')
    expect(service.urls.create).toBe('imei-block/manage')
  })
})
