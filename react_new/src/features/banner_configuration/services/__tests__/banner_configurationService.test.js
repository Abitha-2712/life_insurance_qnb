import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import service from '@/features/banner_configuration/services/banner_configurationService'

describe('banner_configurationService.test', () => {
  it('exposes fetchAll URL banner/summary', () => {
    expect(service.urls.fetchAll).toBe('banner/summary')
  })

  it('urls.create is banner/manage', () => {
    expect(service.urls.create).toBe('banner/manage')
  })

  it('save/remove are functions', () => {
    expect(typeof service.save).toBe('function')
    expect(typeof service.remove).toBe('function')
    expect(typeof service.fetchAll).toBe('function')
  })
})
