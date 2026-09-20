import { describe, it, expect } from 'vitest'
import service from '../funnelService'

describe('funnelService', () => {
  it('uses SoftFetch funnel endpoints', () => {
    expect(service.urls.fetchAll).toBe('funnel/getAll')
  })
})
