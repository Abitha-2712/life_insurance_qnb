import { describe, it, expect } from 'vitest'
import service from '../CMSService'

describe('CMSService', () => {
  it('uses txn/labels + manage-labels endpoints', () => {
    expect(service.urls.fetchAll).toBe('txn/labels')
    expect(service.urls.create).toBe('txn/manage-labels')
    expect(service.urls.update).toBe('txn/manage-labels')
  })
})
