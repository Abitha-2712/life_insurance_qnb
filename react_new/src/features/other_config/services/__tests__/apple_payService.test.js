import { describe, it, expect } from 'vitest'
import service from '../apple_payService'
import { appleUrls } from '@/core/api/urls/appleUrls'

describe('apple_payService', () => {
  it('uses CSV appleUrls', () => {
    expect(service.urls.fetchAll).toBe(appleUrls.fetchAllApple)
    expect(service.urls.create).toBe(appleUrls.manageApple)
    expect(service.urls.update).toBe(appleUrls.manageApple)
  })
})
