import { describe, it, expect } from 'vitest'
import service from '../customer_serviceService'

describe('customer_serviceService', () => {
  it('uses crm-service-type endpoints', () => {
    expect(service.urls.fetchAll).toBe('crm-service-type/get-all')
    expect(service.urls.create).toBe('crm-service-type/add')
  })
})
