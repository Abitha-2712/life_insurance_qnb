import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import service from '@/features/branch_locator/services/branchLocatorService'

describe('branchLocatorService.test', () => {
  it('exposes fetchAll URL branch-locator/getall', () => {
    expect(service.urls.fetchAll).toBe('branch-locator/getall')
  })

  it('urls.create is branch-locator/add', () => {
    expect(service.urls.create).toBe('branch-locator/add')
  })

  it('save/remove are functions', () => {
    expect(typeof service.save).toBe('function')
    expect(typeof service.remove).toBe('function')
    expect(typeof service.fetchAll).toBe('function')
  })
})
