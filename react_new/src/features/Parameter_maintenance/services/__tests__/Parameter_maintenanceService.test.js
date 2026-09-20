import { describe, it, expect } from 'vitest'
import service from '../Parameter_maintenanceService'

describe('Parameter_maintenanceService', () => {
  it('uses parameter list/manage endpoints', () => {
    expect(service.urls.fetchAll).toBe('backoffice-service/parameter/list')
    expect(service.urls.create).toBe('parameter/manage-parameter')
  })
})
