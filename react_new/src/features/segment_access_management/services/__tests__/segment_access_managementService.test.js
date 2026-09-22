import { describe, it, expect } from 'vitest'
import service from '../segment_access_managementService'

describe('segment_access_managementService', () => {
  it('uses customerSeg endpoints', () => {
    expect(service.urls.fetchAll).toBe('customerSeg/getSegmentList')
    expect(service.urls.create).toBe('customerSeg/saveSegmentData')
  })
})
