import { describe, it, expect } from 'vitest'
import service from '../oci_userService'

describe('oci_userService', () => {
  it('uses oci-user SoftFetch paths', () => {
    expect(service.urls.fetchAll).toBe('oci-user/getAll')
    expect(service.urls.create).toBe('oci-user/save')
  })
})
