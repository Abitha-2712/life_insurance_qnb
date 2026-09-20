import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import service from '@/features/push_notification/services/push_notificationService'

describe('push_notificationService.test', () => {
  it('exposes fetchAll URL push-notification/customer/subscriptionList', () => {
    expect(service.urls.fetchAll).toBe('push-notification/customer/subscriptionList')
  })

  it('save/remove are functions', () => {
    expect(typeof service.save).toBe('function')
    expect(typeof service.remove).toBe('function')
    expect(typeof service.fetchAll).toBe('function')
  })
})
