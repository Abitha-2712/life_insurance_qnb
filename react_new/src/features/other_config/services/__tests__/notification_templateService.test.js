import { describe, it, expect } from 'vitest'
import service from '../notification_templateService'

describe('notification_templateService', () => {
  it('exposes Notification Template endpoints', () => {
    expect(service.urls.fetchAll).toBe('notification-template/getAll')
    expect(service.urls.create || service.urls.update).toBeTruthy()
  })
})
