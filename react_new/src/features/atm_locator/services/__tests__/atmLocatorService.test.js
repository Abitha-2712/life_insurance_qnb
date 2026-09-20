import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import service from '@/features/atm_locator/services/atmLocatorService'

describe('atmLocatorService.test', () => {
  it('exposes fetchAll URL atm/getAll', () => {
    expect(service.urls.fetchAll).toBe('atm/getAll')
  })

  it('urls.create is atm/add', () => {
    expect(service.urls.create).toBe('atm/add')
  })

  it('save/remove are functions', () => {
    expect(typeof service.save).toBe('function')
    expect(typeof service.remove).toBe('function')
    expect(typeof service.fetchAll).toBe('function')
  })
})
