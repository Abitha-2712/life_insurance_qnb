import { describe, it, expect } from 'vitest'
import service from '../menu_maintenanceService'

describe('menu_maintenanceService', () => {
  it('uses txn menus entitlement endpoints', () => {
    expect(service.urls.fetchAll).toBe('txn/menus/entitlement')
    expect(service.urls.create).toBe('txn/manage-menus')
  })
})

