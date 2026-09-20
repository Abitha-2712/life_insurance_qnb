import { describe, it, expect } from 'vitest'
import service, { refreshTables } from '../ready_to_sync_tableService'

describe('ready_to_sync_tableService', () => {
  it('uses migration table-list / saveOrUpdate', () => {
    expect(service.urls.fetchAll).toBe('migration/table-list')
    expect(service.urls.create).toBe('migration/saveOrUpdate')
  })
  it('exposes refreshTables helper', async () => {
    expect(typeof refreshTables).toBe('function')
    const res = await refreshTables()
    expect(res.status.code).toBeTruthy()
  })
})
