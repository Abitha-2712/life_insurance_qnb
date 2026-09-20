import { describe, it, expect } from 'vitest'
import service, { runJob } from '../data_cleansingService'

describe('data_cleansingService', () => {
  it('uses SoftFetch data-cleansing endpoints', () => {
    expect(service.urls.fetchAll).toBe('data-cleansing/getAll')
    expect(service.urls.create).toBe('data-cleansing/run')
  })
  it('exposes runJob helper', () => {
    expect(typeof runJob).toBe('function')
  })
})
