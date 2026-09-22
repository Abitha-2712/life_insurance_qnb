import { describe, it, expect } from 'vitest'
import service from '../rule_managementService'

describe('rule_managementService', () => {
  it('uses bko-rule endpoints', () => {
    expect(service.urls.fetchAll).toBe('bko-rule/fetchAll')
    expect(service.urls.create).toBe('bko-rule/post')
    expect(service.urls.update).toBe('bko-rule/update')
    expect(service.urls.delete).toBe('bko-rule/delete')
  })
})
