import { describe, it, expect } from 'vitest'
import service from '../blocklist_ipService'

describe('blocklist_ipService', () => {
  it('uses ip-block list/manage endpoints', () => {
    expect(service.urls.fetchAll).toBe('backoffice-service/ip-block/list')
    expect(service.urls.create).toBe('backoffice-service/ip-block/manage')
  })
})
