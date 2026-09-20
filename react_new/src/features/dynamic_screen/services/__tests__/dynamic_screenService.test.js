import { describe, it, expect } from 'vitest'
import service from '../dynamic_screenService'

describe('dynamic_screenService', () => {
  it('uses SoftFetch dynamic-screen endpoints', () => {
    expect(service.urls.fetchAll).toBe('dynamic-screen/getAll')
  })
})
