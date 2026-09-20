import { describe, it, expect } from 'vitest'
import service from '../charityService'

describe('charityService', () => {
  it('exposes Charity Management endpoints', () => {
    expect(service.urls.fetchAll).toBe('charity/getAll')
    expect(service.urls.create || service.urls.update).toBeTruthy()
  })
})
