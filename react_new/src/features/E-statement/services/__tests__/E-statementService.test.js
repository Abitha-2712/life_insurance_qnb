import { describe, it, expect } from 'vitest'
import service from '../E-statementService'

describe('E-statementService', () => {
  it('uses SoftFetch e-statement endpoints', () => {
    expect(service.urls.fetchAll).toBe('e-statement/getAll')
  })
  it('seed includes format/frequency', async () => {
    const res = await service.fetchAll()
    expect(res.data[0].format).toBe('PDF')
  })
})
