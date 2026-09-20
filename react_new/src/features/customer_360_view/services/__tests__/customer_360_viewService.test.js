import { describe, it, expect } from 'vitest'
import service from '../customer_360_viewService'

describe('customer_360_viewService', () => {
  it('uses blockUnblock endpoints', () => {
    expect(service.urls.fetchAll).toBe('blockUnblock/detail')
    expect(service.urls.update).toBe('blockUnblock/update')
    expect(service.urls.create).toBe('blockUnblock/add-blocked-user')
  })
})
