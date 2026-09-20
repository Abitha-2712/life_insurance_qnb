import { describe, it, expect } from 'vitest'
import service from '../roleService'

describe('roleService', () => {
  it('uses bko-role endpoints', () => {
    expect(service.urls.fetchAll).toBe('bko-role/fetchAll')
    expect(service.urls.create).toBe('bko-role/post')
    expect(service.urls.delete).toBe('bko-role/deleteAll')
  })
})
