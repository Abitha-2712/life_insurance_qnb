import { describe, it, expect } from 'vitest'
import service, { refreshTables } from '../sync_table_managementService'

describe('sync_table_managementService', () => {
  it('uses migration endpoints', () => {
    expect(service.urls.fetchAll).toBe('migration/table-list')
    expect(service.urls.create).toBe('migration/saveOrUpdate')
  })

  it('exposes refreshTables helper', async () => {
    const res = await refreshTables()
    expect(res.status.code).toBeDefined()
  })
})
