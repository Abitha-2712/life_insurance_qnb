import { describe, it, expect } from 'vitest'
import service from '@/features/user_management/services/user_managementService'
import { manageUserUrls } from '@/core/api/urls/manage_userUrls'

describe('user_managementService.test', () => {
  it('uses CSV manageUserUrls for user CRUD', () => {
    expect(service.urls.fetchAll).toBe(manageUserUrls.fetchAllUsers)
    expect(service.urls.create).toBe(manageUserUrls.saveUser)
    expect(service.urls.update).toBe(manageUserUrls.modifyUser || manageUserUrls.saveUser)
    expect(service.urls.delete).toBe(manageUserUrls.deleteUser)
  })

  it('mapRow normalizes user fields', () => {
    const mapped = service.mapRow({
      userId: 'u2',
      firstName: 'Sara',
      email: 'sara@qnb.com',
      role: 'MAKER',
      status: 'Y',
    })
    expect(mapped.id).toBe('u2')
    expect(mapped.userName).toBe('Sara')
    expect(mapped.userEmail).toBe('sara@qnb.com')
    expect(mapped.userRole).toBe('MAKER')
  })

  it('save/remove/fetchAll are functions', () => {
    expect(typeof service.save).toBe('function')
    expect(typeof service.remove).toBe('function')
    expect(typeof service.fetchAll).toBe('function')
  })
})
