import { describe, it, expect } from 'vitest'
import service from '../profile_controlService'

describe('profile_controlService', () => {
  it('uses SoftFetch profile-control endpoints', () => {
    expect(service.urls.fetchAll).toBe('profile-control/getAll')
  })
  it('seed includes device/biometric controls', async () => {
    const res = await service.fetchAll()
    expect(res.data[0].maxDevices).toBeTruthy()
  })
})
