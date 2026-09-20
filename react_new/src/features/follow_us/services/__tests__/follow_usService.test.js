import { describe, it, expect } from 'vitest'
import service from '../follow_usService'

describe('follow_usService', () => {
  it('uses SoftFetch reach-us endpoints', () => {
    expect(service.urls.fetchAll).toBe('reach-us/getAll')
  })
})
